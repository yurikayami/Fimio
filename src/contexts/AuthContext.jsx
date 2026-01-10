import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getRedirectUrl } from '@/lib/supabase';
import { Capacitor } from '@capacitor/core';

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Google Auth on native platforms
        if (Capacitor.isNativePlatform()) {
            import('@/services/googleAuth').then(({ initGoogleAuth }) => {
                initGoogleAuth();
            });
        }

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        signInWithGoogle: async () => {
            // Use native Google Sign-In on mobile for popup experience
            if (Capacitor.isNativePlatform()) {
                try {
                    const { signInWithGoogleNative } = await import('@/services/googleAuth');
                    const data = await signInWithGoogleNative();
                    return data;
                } catch (error) {
                    console.error('Native Google Sign-In failed:', error);
                    throw error;
                }
            }

            // Fallback to OAuth redirect for web
            const redirectTo = getRedirectUrl();
            console.log('Signing in with Google, redirect to:', redirectTo);
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                }
            });
            
            if (error) throw error;
            return data;
        },
        signInWithEmail: async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        },
        signUpWithEmail: async (email, password, fullName) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
                    },
                },
            });
            if (error) throw error;
            return data;
        },
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
