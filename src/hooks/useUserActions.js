import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useUserActions = () => {
    const { user } = useAuth();

    const syncMovieToDB = async (movieData) => {
        const { data: movieId, error: syncError } = await supabase
            .rpc('sync_movie_data', { p_movie_data: movieData });

        if (syncError) throw syncError;
        return movieId;
    }

    const addToLibrary = async (movieData) => {
        if (!user) {
            return { error: "User not logged in" };
        }

        try {
            const movieId = await syncMovieToDB(movieData);

            // 2. Add to User's Library
            const { error: saveError } = await supabase
                .from('library')
                .upsert({ user_id: user.id, movie_id: movieId }, { onConflict: 'user_id, movie_id' });

            if (saveError) throw saveError;

            return { success: true };
        } catch (error) {
            console.error("Action Error:", error);
            return { error: error.message };
        }
    };

    const addToHistory = async (movieData, episodeName) => {
        if (!user) return; // Silent fail for history if not logged in

        try {
            const movieId = await syncMovieToDB(movieData);

            // Add to User's History
            const { error: saveError } = await supabase
                .from('watch_history')
                .upsert({
                    user_id: user.id,
                    movie_id: movieId,
                    episode_name: episodeName, // Optional
                    watched_at: new Date().toISOString()
                }, { onConflict: 'user_id, movie_id' });

            if (saveError) throw saveError;
        } catch (error) {
            console.error("History Error:", error);
        }
    }

    const checkIsSaved = async (slug) => {
        if (!user) return false;

        const { data } = await supabase
            .from('library')
            .select(`
            id,
            movies!inner(slug)
        `)
            .eq('user_id', user.id)
            .eq('movies.slug', slug)
            .maybeSingle();

        return !!data;
    };

    const removeFromLibrary = async (movieSlug) => {
        if (!user) return { error: "User not logged in" };

        try {
            // Find movie_id first
            const { data: movie } = await supabase.from('movies').select('id').eq('slug', movieSlug).single();
            if (!movie) throw new Error("Movie not found");

            const { error } = await supabase
                .from('library')
                .delete()
                .eq('user_id', user.id)
                .eq('movie_id', movie.id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Remove Library Error:", error);
            return { error: error.message };
        }
    };

    const removeFromHistory = async (historyId) => {
        if (!user) return { error: "User not logged in" };

        try {
            const { error } = await supabase
                .from('watch_history')
                .delete()
                .eq('id', historyId)
                .eq('user_id', user.id); // Ensure ownership

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Remove History Error:", error);
            return { error: error.message };
        }
    };

    return { addToLibrary, addToHistory, checkIsSaved, removeFromLibrary, removeFromHistory };
};
