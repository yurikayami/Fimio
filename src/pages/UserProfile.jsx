import { useState, useEffect } from 'react';
import { Film, Clock, Award, Heart, Star, BarChart3, Calendar, TrendingUp, Edit3, Save, X, Bookmark } from 'lucide-react';
import { getUserStats, getTopGenres, getTopCountries } from '@/lib/userStats';
import { getSavedMovies } from '@/lib/savedMovies';
import { getWatchHistory } from '@/lib/watchHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const GENRE_COLORS = {
  'Hành động': 'bg-red-500/20 border-red-500/50 text-red-300',
  'Hài hước': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  'Tình cảm': 'bg-pink-500/20 border-pink-500/50 text-pink-300',
  'Khoa học viễn tưởng': 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  'Kinh dị': 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  'Tâm lý': 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300',
  'Phiêu lưu': 'bg-green-500/20 border-green-500/50 text-green-300',
  'Chính kịch': 'bg-violet-500/20 border-violet-500/50 text-violet-300',
};

export function UserProfile() {
  const [stats, setStats] = useState(null);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [username, setUsername] = useState('Nakayuri Sara');
  const [avatar, setAvatar] = useState('https://avatarfiles.alphacoders.com/326/thumb-1920-326478.png');
  const [banner, setBanner] = useState('https://w.wallhaven.cc/full/9o/wallhaven-9ode5x.jpg');
  const [tempUsername, setTempUsername] = useState(username);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(avatar);
  const [tempBannerUrl, setTempBannerUrl] = useState(banner);

  useEffect(() => {
    const loadProfileData = async () => {
      setStats(getUserStats());
      setGenres(getTopGenres(7));
      setCountries(getTopCountries(5));
      setWatchHistory(getWatchHistory().slice(0, 10));
      
      // Load saved profile data
      const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
      if (savedProfile.username) setUsername(savedProfile.username);
      if (savedProfile.avatar) setAvatar(savedProfile.avatar);
      if (savedProfile.banner) setBanner(savedProfile.banner);
    };
    loadProfileData();
  }, []);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempAvatarUrl(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempBannerUrl(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setUsername(tempUsername);
    setAvatar(tempAvatarUrl);
    setBanner(tempBannerUrl);
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify({
      username: tempUsername,
      avatar: tempAvatarUrl,
      banner: tempBannerUrl,
    }));
    
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setTempAvatarUrl(avatar);
    setTempBannerUrl(banner);
    setIsEditMode(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  const getSavedCount = () => getSavedMovies().length;

  return (
    <div className="space-y-6 pb-8">
      {/* Edit Settings Modal */}
      {isEditMode && (
        <Card className="bg-slate-800/80 border-slate-700 fixed inset-0 z-50 m-4 overflow-y-auto md:inset-auto md:right-4 md:top-20 md:w-96 md:max-h-[calc(100vh-100px)]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Cài đặt hồ sơ</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Tên người dùng</label>
              <Input
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Nhập tên người dùng"
                className="bg-slate-700 border-slate-600"
              />
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Avatar</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              {tempAvatarUrl && (
                <div className="mt-2">
                  <img src={tempAvatarUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                </div>
              )}
              <div className="text-xs text-slate-400 mt-2">hoặc dán URL ảnh:</div>
              <Input
                value={tempAvatarUrl}
                onChange={(e) => setTempAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="bg-slate-700 border-slate-600 text-xs"
              />
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Banner</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFile}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              {tempBannerUrl && (
                <div className="mt-2">
                  <img src={tempBannerUrl} alt="Preview" className="w-full h-24 rounded-lg object-cover" />
                </div>
              )}
              <div className="text-xs text-slate-400 mt-2">hoặc dán URL ảnh:</div>
              <Input
                value={tempBannerUrl}
                onChange={(e) => setTempBannerUrl(e.target.value)}
                placeholder="https://..."
                className="bg-slate-700 border-slate-600 text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile} className="flex-1 bg-accent hover:bg-accent/90">
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Banner */}
      <div className="relative aspect-[47/10] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black group">
        {/* Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        </div>
        
        {/* Edit Button on Banner Hover */}
        <button
          onClick={() => {
            setTempUsername(username);
            setTempAvatarUrl(avatar);
            setTempBannerUrl(banner);
            setIsEditMode(true);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-accent hover:bg-accent/90 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-lg"
          title="Chỉnh sửa hồ sơ"
        >
          <Edit3 className="w-5 h-5 text-white" />
        </button>
        
        {/* Profile Content */}
        <div className="relative h-full flex items-end p-8">
          <div className="flex items-end gap-6 w-full">
            {/* Avatar */}
            <div className="relative group/avatar">
              <div className="w-32 h-32 rounded-lg border-4 border-white/20 overflow-hidden shadow-2xl shadow-black/80 transition-transform duration-300 group-hover/avatar:scale-105">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-black animate-pulse" />
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {username}
                </h1>
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-yellow-300">VIP</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                @movie_lover • Tham gia từ Tháng 1, 2024
              </p>
              
              {/* Quick Stats */}
              <div className="flex gap-4 md:gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Film className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white">{stats?.totalMoviesWatched || 0}</p>
                    <p className="text-xs text-slate-400">Phim đã xem</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white">{getSavedCount()}</p>
                    <p className="text-xs text-slate-400">Yêu thích</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white">{formatDuration(stats?.totalWatchTime || 0)}</p>
                    <p className="text-xs text-slate-400">Thời lượng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Movies */}
        <Card className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/20 hover:border-red-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Tổng phim xem</p>
                <p className="text-3xl font-bold text-white">{stats.totalMoviesWatched}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+12% tuần này</span>
                </div>
              </div>
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Film className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watch Time */}
        <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Thời lượng xem</p>
                <p className="text-3xl font-bold text-white">{Math.floor(stats.totalWatchTime / 60)}h</p>
                <p className="text-xs text-slate-500 mt-2">{stats.totalWatchTime % 60}m bổ sung</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card className="bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20 hover:border-pink-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Phim yêu thích</p>
                <p className="text-3xl font-bold text-white">{getSavedCount()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                  <span className="text-xs text-pink-400">Đã lưu</span>
                </div>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-500/20 hover:border-yellow-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Thành tích</p>
                <p className="text-3xl font-bold text-white">{stats.achievements.length}</p>
                <p className="text-xs text-yellow-400 mt-2">Đã mở khóa</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Genres & Countries Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Genres */}
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
                <div 
                  key={genre.name}
                  className="px-3 py-1.5 rounded-full border bg-purple-500/20 border-purple-500/50 text-purple-300 text-xs font-medium transition-all hover:bg-purple-500/30 hover:shadow-lg"
                >
                  {genre.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Countries */}
        <Card className="border-slate-700 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-cyan-500/20 hover:border-cyan-500/50 transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Award className="w-5 h-5 text-cyan-400" />
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
                <div 
                  key={country.name}
                  className="px-3 py-1.5 rounded-full border bg-cyan-500/20 border-cyan-500/50 text-cyan-300 text-xs font-medium transition-all hover:bg-cyan-500/30 hover:shadow-lg"
                >
                  {country.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Movies - Cover Cards */}
      {getSavedCount() > 0 && (
        <Card className="border-slate-700 bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border-pink-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Bookmark className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-slate-300">Phim đã lưu</CardTitle>
                <p className="text-xs text-slate-500 mt-1">{getSavedCount()} phim</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {getSavedMovies().map((movie) => (
                <Link
                  key={movie.slug}
                  to={`/movie/${movie.slug}`}
                  className="group relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 ring-1 ring-slate-700 hover:ring-2 hover:ring-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/30"
                >
                  {/* Poster Image */}
                  <img
                    src={movie.poster_url || movie.thumb_url}
                    alt={movie.name}
                    className="w-full h-full object-cover group-hover:brightness-90 group-hover:scale-110 transition-all duration-300"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Movie Info - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-bold text-white line-clamp-2">{movie.name}</p>
                  </div>
                  
                  {/* Heart Icon - Top Right */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-2 bg-pink-500/30 backdrop-blur-sm rounded-lg">
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity - Watch History */}
      <Card className="border-slate-700 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-slate-300">Hoạt động gần đây</CardTitle>
              <p className="text-xs text-slate-500 mt-1">{watchHistory.length} phim</p>
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
                  {/* Thumbnail Image */}
                  <img
                    src={movie.thumb_url}
                    alt={movie.name}
                    className="w-full h-full object-cover group-hover:brightness-90 group-hover:scale-105 transition-all duration-300"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Movie Info - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs text-white font-semibold line-clamp-1">{movie.name}</p>
                    {movie.currentEpisode && (
                      <p className="text-xs text-blue-300">Tập {movie.currentEpisode}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
