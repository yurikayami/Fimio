import { useState, useEffect } from 'react';
import { Film, Clock, Heart, BarChart3, Calendar, TrendingUp, Edit3, Settings, Bookmark, Star, LogOut, LogIn, Mail, Lock } from 'lucide-react';
import { getSavedMovies as getLocalSavedMovies } from '@/lib/savedMovies';
import { getWatchHistory as getLocalWatchHistory } from '@/lib/watchHistory';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// === SCHEMAS ===
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const profileSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  avatar_url: z.string().optional(),
  banner_url: z.string().optional(),
});

// Global cache outside component
let globalCache = null;

// Helper: Fetch genres from saved movies list
const fetchGenresFromMovies = async (movieIds) => {
  if (!movieIds || movieIds.length === 0) return [];
  
  try {
    const { data } = await supabase
      .from('movie_genres')
      .select('genres ( name )')
      .in('movie_id', movieIds);
    
    const genreMap = new Map();
    if (data) {
      data.forEach(item => {
        if (item.genres?.name) {
          genreMap.set(item.genres.name, (genreMap.get(item.genres.name) || 0) + 1);
        }
      });
    }
    
    return Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => ({ name }));
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// Helper: Fetch countries from saved movies list
const fetchCountriesFromMovies = async (movieIds) => {
  if (!movieIds || movieIds.length === 0) return [];
  
  try {
    const { data } = await supabase
      .from('movie_countries')
      .select('countries ( name )')
      .in('movie_id', movieIds);
    
    const countryMap = new Map();
    if (data) {
      data.forEach(item => {
        if (item.countries?.name) {
          countryMap.set(item.countries.name, (countryMap.get(item.countries.name) || 0) + 1);
        }
      });
    }
    
    return Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => ({ name }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export function UserProfile() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();

  // Check Cache
  const cached = (globalCache && globalCache.userId === user?.id) ? globalCache.data : null;

  // Data State
  const [stats, setStats] = useState(cached?.stats || { totalMoviesWatched: 0, totalWatchTime: 0 });
  const [genres, setGenres] = useState(cached?.genres || []);
  const [countries, setCountries] = useState(cached?.countries || []);
  const [watchHistory, setWatchHistory] = useState(cached?.watchHistory || []);
  const [savedMovies, setSavedMovies] = useState(cached?.savedMovies || []);
  const [loading, setLoading] = useState(!cached);

  // Profile State
  const [profile, setProfile] = useState(cached?.profile || {
    username: 'Khách',
    avatar: 'https://github.com/shadcn.png',
    banner: 'https://w.wallhaven.cc/full/9o/wallhaven-9ode5x.jpg',
    email: '',
    isVip: false
  });

  // Dialog States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  // Forms
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      avatar_url: "",
      banner_url: "",
    },
  });

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      if (!cached) setLoading(true);

      if (user) {
        // === LOGGED IN ===
        try {
          // 1. Profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          let newProfile = profile;

          if (profileData) {
            newProfile = {
              username: profileData.full_name || user.email?.split('@')[0],
              avatar: profileData.avatar_url || 'https://github.com/shadcn.png',
              banner: profileData.banner_url || 'https://w.wallhaven.cc/full/9o/wallhaven-9ode5x.jpg',
              email: user.email,
              isVip: profileData.is_vip || false
            };
            setProfile(newProfile);

            // Update form values
            profileForm.reset({
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url || '',
              banner_url: profileData.banner_url || '',
            });
          }

          // 2. History - with proper join to movies table
          const { data: historyData } = await supabase
            .from('watch_history')
            .select(`
              id,
              episode_name,
              watched_at,
              movies:movie_id (
                id,
                slug,
                name,
                thumb_url,
                episode_current
              )
            `)
            .eq('user_id', user.id)
            .order('watched_at', { ascending: false })
            .limit(10);

          const formattedHistory = historyData && historyData.length > 0 
            ? historyData
                .filter(h => h.movies)
                .map(h => ({
                  ...h.movies,
                  currentEpisode: h.movies.episode_current,
                  episodeName: h.episode_name
                })) 
            : [];
          setWatchHistory(formattedHistory);

          // 3. Saved - with proper join to movies table
          const { data: savedData } = await supabase
            .from('library')
            .select(`
              id,
              created_at,
              movies:movie_id (
                id,
                slug,
                name,
                poster_url,
                thumb_url
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          const formattedSaved = savedData && savedData.length > 0 
            ? savedData
                .filter(s => s.movies)
                .map(s => s.movies)
            : [];
          setSavedMovies(formattedSaved);

          // Stats
          const newStats = {
            totalMoviesWatched: formattedHistory.length,
            totalWatchTime: formattedHistory.length * 45
          };
          setStats(newStats);

          // Preferences - fetch from database using movie IDs
          const historyMovieIds = formattedHistory.map(m => m.id).filter(Boolean);
          const savedMovieIds = formattedSaved.map(m => m.id).filter(Boolean);
          const allMovieIds = [...new Set([...historyMovieIds, ...savedMovieIds])];

          const newGenres = await fetchGenresFromMovies(allMovieIds);
          const newCountries = await fetchCountriesFromMovies(allMovieIds);
          setGenres(newGenres);
          setCountries(newCountries);

          // Update Cache
          globalCache = {
            userId: user.id,
            data: {
              stats: newStats,
              genres: newGenres,
              countries: newCountries,
              watchHistory: formattedHistory,
              savedMovies: formattedSaved,
              profile: newProfile,
              editForm: profileForm.getValues()
            }
          };

        } catch (err) {
          console.error("Data load error", err);
        }
      } else {
        // === GUEST ===
        const guestProfile = {
          username: 'Khách tham quan',
          avatar: 'https://ui-avatars.com/api/?name=Guest&background=random',
          banner: 'https://w.wallhaven.cc/full/9o/wallhaven-9ode5x.jpg',
          email: 'Chưa đăng nhập'
        };
        setProfile(guestProfile);

        const localHistory = getLocalWatchHistory().slice(0, 10);
        const localSaved = getLocalSavedMovies();

        setWatchHistory(localHistory);
        setSavedMovies(localSaved);

        const guestStats = {
          totalMoviesWatched: localHistory.length,
          totalWatchTime: localHistory.length * 45
        };
        setStats(guestStats);

        // Preferences - Extract from local movie data (from API cache)
        const allMovies = [...localHistory, ...localSaved];
        const guestGenres = allMovies.length > 0 
          ? Array.from(new Map(
              allMovies
                .flatMap(m => (m.category || []).map(c => c.name))
                .reduce((map, name) => map.set(name, (map.get(name) || 0) + 1), new Map())
                .entries()
            ))
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name]) => ({ name }))
          : [];
        
        const guestCountries = allMovies.length > 0
          ? Array.from(new Map(
              allMovies
                .flatMap(m => (m.country || []).map(c => c.name))
                .reduce((map, name) => map.set(name, (map.get(name) || 0) + 1), new Map())
                .entries()
            ))
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([name]) => ({ name }))
          : [];

        setGenres(guestGenres);
        setCountries(guestCountries);

        globalCache = {
          userId: undefined,
          data: {
            stats: guestStats,
            genres: guestGenres,
            countries: guestCountries,
            watchHistory: localHistory,
            savedMovies: localSaved,
            profile: guestProfile,
            editForm: { full_name: '', avatar_url: '', banner_url: '' }
          }
        };
      }

      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Actions
  const onProfileUpdate = async (values) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          avatar_url: values.avatar_url,
          banner_url: values.banner_url,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedProfile = {
        ...profile,
        username: values.full_name,
        avatar: values.avatar_url,
        banner: values.banner_url
      };

      setProfile(updatedProfile);

      if (globalCache && globalCache.userId === user.id) {
        globalCache.data.profile = updatedProfile;
      }

      setIsEditOpen(false);
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  const onLogin = async (values) => {
    setAuthError('');
    try {
      await signInWithEmail(values.email, values.password);
      setIsAuthOpen(false);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const onRegister = async (values) => {
    setAuthError('');
    try {
      await signUpWithEmail(values.email, values.password, values.fullName);
      setIsAuthOpen(false);
      alert("Đăng ký thành công!");
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsEditOpen(false);
    // Reset cache/state if needed
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Đang tải hồ sơ...</div>;

  return (
    <div className="flex flex-1">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-8 flex-1 space-y-6 pb-8">

        {/* === HEADER SECTION === */}
        <div className="md:relative md:aspect-[47/10] md:rounded-2xl md:overflow-hidden md:shadow-2xl md:bg-gradient-to-br md:from-slate-800 md:via-slate-900 md:to-black md:group">

          {/* Banner Background */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${profile.banner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          </div>

          {/* EDIT BUTTON (Only for Users) */}
          {user && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button
                  className="absolute top-4 right-4 z-10 p-2 bg-slate-900/50 hover:bg-slate-800 backdrop-blur-md border border-slate-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg active:scale-95 flex items-center justify-center group/edit"
                  title="Cài đặt hồ sơ"
                >
                  <Settings className="w-4 h-4 text-slate-200 group-hover/edit:text-white" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900/60 backdrop-blur-2xl border border-slate-400/20 shadow-2xl max-h-[90vh] overflow-y-auto w-[95vw] max-w-lg rounded-2xl supports-[backdrop-filter]:bg-slate-950/40 [&>button.absolute.right-4.top-4]:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-950/30 rounded-2xl pointer-events-none" />
                
                {/* Close Button - Easier to tap */}
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-600/40 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center group"
                  title="Đóng"
                >
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <DialogHeader className="pb-4 border-b border-slate-400/15 relative z-10">
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Cài đặt hồ sơ</DialogTitle>
                  <DialogDescription className="hidden">Cập nhật thông tin hồ sơ người dùng của bạn</DialogDescription>
                </DialogHeader>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileUpdate)} className="space-y-5 py-4 relative z-10">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Tên hiển thị
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tên của bạn" 
                              className="bg-slate-800/40 border-slate-500/40 backdrop-blur-sm hover:border-slate-400/60 focus:border-indigo-500 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-indigo-500/20 transition-all text-slate-100 placeholder:text-slate-500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Avatar URL
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Link ảnh đại diện" 
                              className="bg-slate-800/40 border-slate-500/40 backdrop-blur-sm hover:border-slate-400/60 focus:border-purple-500 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all text-slate-100 placeholder:text-slate-500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="banner_url"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                            Banner URL
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Link ảnh bìa" 
                              className="bg-slate-800/40 border-slate-500/40 backdrop-blur-sm hover:border-slate-400/60 focus:border-pink-500 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-pink-500/20 transition-all text-slate-100 placeholder:text-slate-500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 mt-6 pt-5 border-t border-slate-400/15">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-indigo-500/50 transition-all font-semibold active:scale-95 transform"
                      >
                        Lưu thay đổi
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditOpen(false)} 
                        className="flex-1 bg-slate-800/40 border-slate-400/30 hover:bg-slate-700/50 hover:border-slate-400/40 backdrop-blur-sm font-semibold transition-all active:scale-95 transform"
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </Form>

                <div className="pt-4 border-t border-slate-400/15 mt-4 relative z-10">
                  <Button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/50 transition-all font-semibold active:scale-95 transform"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* User Info Overlay */}
          <div className="md:relative md:h-full md:flex md:items-end md:p-8 p-4 md:p-0 bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-black/50 md:bg-none rounded-xl md:rounded-none md:shadow-none shadow-lg md:border-0 border border-slate-700/50">
            <div className="flex gap-4 md:gap-6 w-full md:items-end">
              {/* Avatar */}
              <div className="relative group/avatar flex-shrink-0">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-lg border-2 md:border-4 border-white/20 overflow-hidden shadow-lg md:shadow-2xl shadow-black/80 transition-transform duration-300 group-hover/avatar:scale-105">
                  <img src={profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-base md:text-4xl font-bold text-white drop-shadow-lg truncate">{profile.username}</h1>
                  {profile.isVip && (
                    <div className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs md:text-sm font-bold text-yellow-300">VIP</span>
                    </div>
                  )}
                  {!user && (
                    <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-7 text-xs">
                          <LogIn className="w-3 h-3 mr-1" /> Đăng nhập
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900/60 backdrop-blur-2xl border border-slate-400/20 shadow-2xl w-[95vw] max-w-md rounded-2xl supports-[backdrop-filter]:bg-slate-950/40">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-950/30 rounded-2xl pointer-events-none" />
                        <DialogHeader className="pb-4 border-b border-slate-400/15 relative z-10">
                          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Đăng nhập / Đăng ký</DialogTitle>
                          <DialogDescription className="hidden">Đăng nhập hoặc đăng ký tài khoản của bạn</DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="login" className="w-full relative z-10" onValueChange={(value) => value}>
                          <TabsList className="grid w-full grid-cols-2 bg-slate-800/40 border border-slate-400/20 backdrop-blur-sm">
                            <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700">Đăng nhập</TabsTrigger>
                            <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700">Đăng ký</TabsTrigger>
                          </TabsList>

                          <div className="mt-5">
                            {authError && (
                              <div className="mb-4 p-3.5 bg-red-500/30 border border-red-400/30 backdrop-blur-sm rounded-lg text-red-300 text-sm font-semibold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                {authError}
                              </div>
                            )}

                            <TabsContent value="login" className="space-y-4">
                              <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                  <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                                          <Mail className="w-4 h-4 text-indigo-400" />
                                          Email
                                        </FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="email@example.com" 
                                            className="bg-slate-800/30 border-slate-400/30 backdrop-blur-sm hover:border-slate-400/40 focus:border-indigo-400 focus:bg-slate-800/40 transition-all text-slate-100 placeholder:text-slate-500"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                                          <Lock className="w-4 h-4 text-indigo-400" />
                                          Mật khẩu
                                        </FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="bg-slate-800/30 border-slate-400/30 backdrop-blur-sm hover:border-slate-400/40 focus:border-indigo-400 focus:bg-slate-800/40 transition-all text-slate-100 placeholder:text-slate-500"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-indigo-600/90 to-indigo-700/90 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold py-2"
                                  >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Đăng nhập
                                  </Button>
                                </form>
                              </Form>
                            </TabsContent>

                            <TabsContent value="register" className="space-y-4">
                              <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                                  <FormField
                                    control={registerForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                          Họ tên
                                        </FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="Nguyễn Văn A" 
                                            className="bg-slate-800/30 border-slate-400/30 backdrop-blur-sm hover:border-slate-400/40 focus:border-green-400 focus:bg-slate-800/40 transition-all text-slate-100 placeholder:text-slate-500"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                                          <Mail className="w-4 h-4 text-green-400" />
                                          Email
                                        </FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="email@example.com" 
                                            className="bg-slate-800/30 border-slate-400/30 backdrop-blur-sm hover:border-slate-400/40 focus:border-green-400 focus:bg-slate-800/40 transition-all text-slate-100 placeholder:text-slate-500"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                      <FormItem className="space-y-2">
                                        <FormLabel className="text-slate-200 font-semibold flex items-center gap-2">
                                          <Lock className="w-4 h-4 text-green-400" />
                                          Mật khẩu
                                        </FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="bg-slate-800/30 border-slate-400/30 backdrop-blur-sm hover:border-slate-400/40 focus:border-green-400 focus:bg-slate-800/40 transition-all text-slate-100 placeholder:text-slate-500"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-green-600/90 to-green-700/90 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/30 transition-all font-semibold py-2"
                                  >
                                    Đăng ký
                                  </Button>
                                </form>
                              </Form>
                            </TabsContent>

                            <div className="relative my-5">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-400/20"></span>
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900/60 backdrop-blur-sm px-3 text-slate-400 font-semibold">Hoặc</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full bg-slate-800/30 border-slate-400/30 hover:bg-slate-800/50 hover:border-slate-400/40 backdrop-blur-sm font-semibold transition-all"
                              onClick={signInWithGoogle}
                            >
                              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              Đăng nhập với Google
                            </Button>
                          </div>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <p className="text-slate-300 text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-2 truncate">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{user ? profile.email : 'Hãy đăng nhập để lưu trữ phim'}</span>
                </p>

                {/* Quick Stats */}
                <div className="flex md:flex gap-3 md:gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 md:p-2 bg-red-500/20 rounded">
                      <Film className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm md:text-xl font-bold text-white">{stats.totalMoviesWatched}</p>
                      <p className="text-xs text-slate-400 hidden md:block">Phim</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 md:p-2 bg-pink-500/20 rounded">
                      <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm md:text-xl font-bold text-white">{savedMovies.length}</p>
                      <p className="text-xs text-slate-400 hidden md:block">Yêu thích</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === MAIN STATS GRID === */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {/* Total Movies */}
          <Card className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/20 hover:border-red-500/50 transition-all">
            <CardContent className="p-2 md:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-slate-500 md:text-slate-400 mb-0.5 md:mb-1">Tổng xem</p>
                  <p className="text-lg md:text-3xl font-bold text-white">{stats.totalMoviesWatched}</p>
                  <div className="hidden md:flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Phim đã xem</span>
                  </div>
                </div>
                <div className="p-1.5 md:p-3 bg-red-500/20 rounded-lg md:rounded-xl flex-shrink-0">
                  <Film className="w-3.5 h-3.5 md:w-6 md:h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watch Time */}
          <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/50 transition-all">
            <CardContent className="p-2 md:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-slate-500 md:text-slate-400 mb-0.5 md:mb-1">Thời lượng</p>
                  <p className="text-lg md:text-3xl font-bold text-white">{Math.floor(stats.totalWatchTime / 60)}h</p>
                  <p className="text-xs text-slate-600 md:text-slate-500 mt-1 md:mt-2 hidden md:block">{stats.totalWatchTime % 60}m</p>
                </div>
                <div className="p-1.5 md:p-3 bg-blue-500/20 rounded-lg md:rounded-xl flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 md:w-6 md:h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorites */}
          <Card className="bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20 hover:border-pink-500/50 transition-all">
            <CardContent className="p-2 md:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-slate-500 md:text-slate-400 mb-0.5 md:mb-1">Yêu thích</p>
                  <p className="text-lg md:text-3xl font-bold text-white">{savedMovies.length}</p>
                  <div className="hidden md:flex items-center gap-1 mt-2">
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                    <span className="text-xs text-pink-400">Đã lưu</span>
                  </div>
                </div>
                <div className="p-1.5 md:p-3 bg-pink-500/20 rounded-lg md:rounded-xl flex-shrink-0">
                  <Heart className="w-3.5 h-3.5 md:w-6 md:h-6 text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === PREFERENCES === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-700 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 hover:border-purple-500/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-300">Thể loại yêu thích</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">{genres.length} thể loại</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <div key={genre.name} className="px-3 py-1.5 rounded-full border bg-purple-500/20 border-purple-500/50 text-purple-300 text-xs font-medium">{genre.name}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20 hover:border-cyan-500/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Bookmark className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-300">Quốc gia yêu thích</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">{countries.length} quốc gia</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <div key={country.name} className="px-3 py-1.5 rounded-full border bg-cyan-500/20 border-cyan-500/50 text-cyan-300 text-xs font-medium">{country.name}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === SAVED MOVIES === */}
        {savedMovies.length > 0 && (
          <Card className="border-slate-700 bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Bookmark className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-slate-300">Phim đã lưu</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">{savedMovies.length} phim</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {savedMovies.map((movie) => (
                  <Link
                    key={movie.slug}
                    to={`/movie/${movie.slug}`}
                    className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 ring-1 ring-slate-700 hover:ring-2 hover:ring-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/30"
                  >
                    <img
                      src={buildImageUrl(movie.poster_url)}
                      onError={(e) => { e.target.src = buildImageUrl(movie.thumb_url); }}
                      alt={movie.name}
                      className="w-full h-full object-cover group-hover:brightness-90 group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-bold text-white line-clamp-2">{movie.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* === WATCH HISTORY === */}
        <Card className="border-slate-700 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-slate-300">Hoạt động gần đây</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Trong 10 phim gần nhất</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {watchHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3 opacity-50" />
                <p className="text-slate-400">Chưa có hoạt động xem phim</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {watchHistory.map((movie) => (
                  <Link
                    key={movie.slug}
                    to={`/movie/${movie.slug}`}
                    className="group relative overflow-hidden rounded-xl aspect-video bg-slate-800 ring-1 ring-slate-700 hover:ring-2 hover:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <img
                      src={buildImageUrl(movie.thumb_url)}
                      alt={movie.name}
                      className="w-full h-full object-cover group-hover:brightness-90 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-white font-semibold line-clamp-1">{movie.name}</p>
                      {movie.currentEpisode && <p className="text-xs text-blue-300">Tập {movie.currentEpisode}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
