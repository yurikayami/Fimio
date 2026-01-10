# 👤 Profile Feature - Overview & Architecture

## 🎯 Mục đích

Tài liệu này hướng dẫn xây dựng **User Profile Feature** theo phong cách **AniYomi** (Material You design, bottom sheets, settings sections) cho ứng dụng Flutter movie-finder.

---

## 📋 Feature Requirements (từ React UserProfile.jsx)

### Core Features

- ✅ **User Authentication**

  - Email/Password login & register
  - Google Sign-In (OAuth)
  - Guest mode support
  - Logout

- ✅ **Profile Display**

  - Avatar image
  - Banner image
  - Username/Full name
  - Email
  - VIP badge (optional)

- ✅ **Profile Editing**

  - Update full name
  - Update avatar URL
  - Update banner URL
  - Save to Supabase

- ✅ **Stats Dashboard**

  - Total movies watched
  - Total watch time (hours/minutes)
  - Favorites count

- ✅ **Favorite Genres** (Top 5)

  - Fetched from saved movies
  - Display as chips/tags
  - Sortable by count

- ✅ **Favorite Countries** (Top 5)

  - Fetched from saved movies
  - Display as chips/tags
  - Sortable by count

- ✅ **Saved Movies**

  - Grid display with posters
  - Navigation to movie detail
  - Count display

- ✅ **Watch History** (Recent 10)
  - Thumbnail display
  - Current episode info
  - Navigation to continue watching

---

## 🏗️ Architecture (Clean Architecture)

```
lib/features/profile/
├── domain/
│   ├── entities/
│   │   ├── user_profile.dart         # Pure profile entity
│   │   ├── user_stats.dart           # Stats entity
│   │   └── preference.dart           # Genre/Country preference
│   ├── repositories/
│   │   └── profile_repository.dart   # Abstract interface
│   └── usecases/
│       ├── get_user_profile.dart
│       ├── update_user_profile.dart
│       ├── get_user_stats.dart
│       ├── get_saved_movies.dart
│       ├── get_watch_history.dart
│       ├── get_favorite_genres.dart
│       └── get_favorite_countries.dart
│
├── data/
│   ├── models/
│   │   ├── user_profile_model.dart   # fromJson/toJson
│   │   ├── user_stats_model.dart
│   │   └── preference_model.dart
│   ├── datasources/
│   │   ├── profile_remote_datasource.dart    # Supabase API
│   │   └── profile_local_datasource.dart     # SharedPreferences cache
│   └── repositories/
│       └── profile_repository_impl.dart      # Implements interface
│
└── presentation/
    ├── bloc/
    │   ├── profile_bloc.dart         # Main profile BLoC
    │   ├── profile_event.dart        # Events (load, update, logout)
    │   └── profile_state.dart        # States (loading, loaded, error)
    ├── pages/
    │   └── user_profile_page.dart    # Main profile screen
    └── widgets/
        ├── profile_header.dart       # Avatar, banner, edit button
        ├── stats_card.dart           # Watch stats display
        ├── preference_card.dart      # Genres/Countries chips
        ├── saved_movies_grid.dart    # Saved movies grid
        ├── watch_history_grid.dart   # Watch history grid
        ├── profile_edit_sheet.dart   # Bottom sheet for editing
        └── auth_dialog.dart          # Login/Register modal
```

---

## 🎨 UI Design Philosophy (AniYomi Style)

### Material You Principles

- **Dynamic color scheme** based on user wallpaper (Material 3)
- **Surface containers** with elevation tints
- **Rounded corners** (12-16dp standard)
- **Bottom sheets** instead of dialogs for editing
- **FAB** (Floating Action Button) for primary actions
- **Adaptive layouts** (phone vs tablet)

### Color Palette (Dark Theme)

```dart
// Primary (Dynamic from wallpaper)
primary: Color(0xFF7C4DFF),          // Purple
onPrimary: Color(0xFFFFFFFF),

// Surface
surface: Color(0xFF1C1B1E),          // Dark surface
surfaceVariant: Color(0xFF2B2930),   // Cards
onSurface: Color(0xFFE6E1E5),

// Accent colors for stats
red: Color(0xFFEF5350),      // Movies watched
blue: Color(0xFF42A5F5),     // Watch time
pink: Color(0xFFEC407A),     // Favorites
purple: Color(0xFFAB47BC),   // Genres
cyan: Color(0xFF26C6DA),     // Countries
```

### Layout Structure

```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │   Banner Image (Parallax)     │  │ <- Collapsing toolbar
│  │                               │  │
│  │   ┌─────┐                     │  │
│  │   │ Av  │  Username  ⚙️       │  │ <- Pinned header
│  │   └─────┘  email              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────┬─────┬─────┐               │ <- Stats cards
│  │ 🎬  │ ⏱️  │ ❤️  │               │
│  └─────┴─────┴─────┘               │
│                                     │
│  ┌─────────────────────────────┐   │ <- Preferences
│  │ Favorite Genres 📊          │   │
│  │ [tag] [tag] [tag]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Favorite Countries 🌍       │   │
│  │ [tag] [tag] [tag]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ <- Saved movies grid
│  │ Saved Movies 📚              │   │
│  │ ┌───┬───┬───┬───┬───┐       │   │
│  │ │🎬│🎬│🎬│🎬│🎬│       │   │
│  │ └───┴───┴───┴───┴───┘       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ <- Watch history
│  │ Recent Activity 🕐           │   │
│  │ ┌─────┬─────┬─────┐         │   │
│  │ │ 📺  │ 📺  │ 📺  │         │   │
│  │ └─────┴─────┴─────┘         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔄 State Management (BLoC Pattern)

### ProfileBloc Events

```dart
// Load user profile & all data
class LoadProfileEvent extends ProfileEvent {
  final String? userId;
}

// Update profile info
class UpdateProfileEvent extends ProfileEvent {
  final String fullName;
  final String? avatarUrl;
  final String? bannerUrl;
}

// Logout
class LogoutEvent extends ProfileEvent {}

// Refresh data
class RefreshProfileEvent extends ProfileEvent {}
```

### ProfileBloc States

```dart
// Initial state
class ProfileInitial extends ProfileState {}

// Loading
class ProfileLoading extends ProfileState {}

// Loaded successfully
class ProfileLoaded extends ProfileState {
  final UserProfile profile;
  final UserStats stats;
  final List<Preference> favoriteGenres;
  final List<Preference> favoriteCountries;
  final List<MovieEntity> savedMovies;
  final List<WatchHistoryEntity> watchHistory;
}

// Error
class ProfileError extends ProfileState {
  final String message;
}
```

---

## 📊 Data Flow

### Load Profile Flow

```
User opens Profile Page
    ↓
ProfileBloc receives LoadProfileEvent
    ↓
Use Cases execute in parallel:
    - GetUserProfile (from Supabase profiles table)
    - GetUserStats (calculate from watch_history)
    - GetFavoriteGenres (from library + movie_genres join)
    - GetFavoriteCountries (from library + movie_countries join)
    - GetSavedMovies (from library table)
    - GetWatchHistory (from watch_history table, limit 10)
    ↓
All data combined in ProfileLoaded state
    ↓
UI updates with all sections
```

### Update Profile Flow

```
User taps Edit button
    ↓
Show ProfileEditSheet (Bottom Sheet)
    ↓
User edits full_name, avatar_url, banner_url
    ↓
User taps Save
    ↓
ProfileBloc receives UpdateProfileEvent
    ↓
UpdateUserProfile use case:
    - Validate input (Zod-like with Dart validators)
    - Update Supabase profiles table
    - Update local cache
    ↓
Emit ProfileLoaded with updated data
    ↓
UI updates, bottom sheet closes
```

### Logout Flow

```
User taps Logout button
    ↓
Show confirmation dialog
    ↓
User confirms
    ↓
ProfileBloc receives LogoutEvent
    ↓
AuthBloc receives SignOutEvent
    ↓
Supabase auth.signOut()
    ↓
Clear all cached data
    ↓
Navigate to Landing/Login page
```

---

## 🗄️ Supabase Schema (Existing Tables)

### profiles table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  full_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  is_vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### watch_history table

```sql
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  movie_id UUID REFERENCES movies(id),
  current_episode TEXT,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  watch_duration_minutes INT DEFAULT 0
);
```

### library table

```sql
CREATE TABLE library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  movie_id UUID REFERENCES movies(id),
  added_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Queries needed

```sql
-- Get user stats
SELECT
  COUNT(DISTINCT movie_id) as total_movies_watched,
  SUM(watch_duration_minutes) as total_watch_time
FROM watch_history
WHERE user_id = $1;

-- Get favorite genres (top 5)
SELECT g.name, COUNT(*) as count
FROM library l
JOIN movie_genres mg ON l.movie_id = mg.movie_id
JOIN genres g ON mg.genre_id = g.id
WHERE l.user_id = $1
GROUP BY g.name
ORDER BY count DESC
LIMIT 5;

-- Get favorite countries (top 5)
SELECT c.name, COUNT(*) as count
FROM library l
JOIN movie_countries mc ON l.movie_id = mc.movie_id
JOIN countries c ON mc.country_id = c.id
WHERE l.user_id = $1
GROUP BY c.name
ORDER BY count DESC
LIMIT 5;

-- Get saved movies
SELECT m.*
FROM library l
JOIN movies m ON l.movie_id = m.id
WHERE l.user_id = $1
ORDER BY l.added_at DESC;

-- Get watch history (recent 10)
SELECT m.*, wh.current_episode, wh.last_watched_at
FROM watch_history wh
JOIN movies m ON wh.movie_id = m.id
WHERE wh.user_id = $1
ORDER BY wh.last_watched_at DESC
LIMIT 10;
```

---

## 🔐 Authentication Integration

### AuthContext → AuthBloc mapping

**React AuthContext:**

```jsx
const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } =
  useAuth();
```

**Flutter AuthBloc:**

```dart
// Get current user
final authState = context.read<AuthBloc>().state;
final user = authState is AuthAuthenticated ? authState.user : null;

// Sign in with email
context.read<AuthBloc>().add(SignInWithEmailEvent(email, password));

// Sign in with Google
context.read<AuthBloc>().add(SignInWithGoogleEvent());

// Sign up
context.read<AuthBloc>().add(SignUpWithEmailEvent(email, password, fullName));

// Sign out
context.read<AuthBloc>().add(SignOutEvent());
```

---

## 🎨 Widget Tree Structure

```dart
UserProfilePage
├── CustomScrollView
│   ├── SliverAppBar (Collapsing with banner)
│   │   ├── FlexibleSpaceBar
│   │   │   ├── Banner Image (parallax)
│   │   │   └── Gradient overlay
│   │   └── ProfileHeader (pinned)
│   │       ├── Avatar (circular)
│   │       ├── Username & email
│   │       └── Edit IconButton
│   │
│   ├── SliverToBoxAdapter (Stats Cards)
│   │   └── Row
│   │       ├── StatsCard (Movies)
│   │       ├── StatsCard (Watch Time)
│   │       └── StatsCard (Favorites)
│   │
│   ├── SliverToBoxAdapter (Preferences)
│   │   ├── PreferenceCard (Genres)
│   │   └── PreferenceCard (Countries)
│   │
│   ├── SliverToBoxAdapter (Saved Movies Section)
│   │   └── SavedMoviesGrid
│   │
│   └── SliverToBoxAdapter (Watch History Section)
│       └── WatchHistoryGrid
│
└── ProfileEditSheet (Bottom Sheet - shown on edit)
    └── Form
        ├── TextFormField (Full Name)
        ├── TextFormField (Avatar URL)
        ├── TextFormField (Banner URL)
        └── Save Button
```

---

## 📦 Dependencies Required

Add to `pubspec.yaml`:

```yaml
dependencies:
  # Already included from Phase 1-4
  flutter_bloc: ^9.0.0
  supabase_flutter: ^2.0.0
  cached_network_image: ^3.3.0
  lucide_icons: ^0.309.0

  # New for Profile feature
  image_picker: ^1.0.0 # For avatar/banner upload
  google_sign_in: ^6.2.0 # For Google OAuth
  shared_preferences: ^2.2.0 # For local cache
```

---

## ⚡ Performance Optimizations

### Caching Strategy

```dart
// Global cache outside component (like React globalCache)
class ProfileCache {
  static ProfileCache? _instance;
  static ProfileCache get instance => _instance ??= ProfileCache._();

  ProfileCache._();

  String? userId;
  ProfileLoaded? data;
  DateTime? cachedAt;

  bool isValid(String? currentUserId) {
    if (userId != currentUserId) return false;
    if (data == null || cachedAt == null) return false;

    // Cache valid for 5 minutes
    final age = DateTime.now().difference(cachedAt!);
    return age.inMinutes < 5;
  }

  void cache(String userId, ProfileLoaded data) {
    this.userId = userId;
    this.data = data;
    this.cachedAt = DateTime.now();
  }

  void clear() {
    userId = null;
    data = null;
    cachedAt = null;
  }
}
```

### Lazy Loading

- Load stats & preferences in parallel using `Future.wait()`
- Use `ListView.builder` for saved movies (if list is large)
- Use `GridView.builder` with `cacheExtent` for images

### Image Optimization

```dart
CachedNetworkImage(
  imageUrl: profile.avatarUrl,
  memCacheWidth: 200,  // Limit memory usage
  memCacheHeight: 200,
  maxWidthDiskCache: 500,
  maxHeightDiskCache: 500,
  placeholder: (context, url) => Shimmer.fromColors(
    baseColor: Colors.grey[800]!,
    highlightColor: Colors.grey[700]!,
    child: Container(color: Colors.grey[800]),
  ),
);
```

---

## 🧪 Testing Strategy

### Unit Tests

- `profile_model_test.dart` - Test fromJson/toJson
- `profile_repository_test.dart` - Mock Supabase calls
- `get_user_stats_test.dart` - Test stats calculation

### BLoC Tests

```dart
blocTest<ProfileBloc, ProfileState>(
  'emits [ProfileLoading, ProfileLoaded] when LoadProfileEvent succeeds',
  build: () => ProfileBloc(...),
  act: (bloc) => bloc.add(LoadProfileEvent(userId: 'test-123')),
  expect: () => [
    ProfileLoading(),
    isA<ProfileLoaded>(),
  ],
);
```

### Widget Tests

- `user_profile_page_test.dart` - Test UI rendering
- `profile_edit_sheet_test.dart` - Test form validation

---

## 📝 Implementation Phases

### Phase 1: Data Layer (1 ngày)

- [ ] Create entities (UserProfile, UserStats, Preference)
- [ ] Create models with fromJson/toJson
- [ ] Create repository interface
- [ ] Create data sources (remote + local)
- [ ] Implement repository with Either pattern

### Phase 2: Domain Layer (0.5 ngày)

- [ ] Create use cases (7 use cases)
- [ ] Write unit tests for use cases
- [ ] Register in DI container

### Phase 3: BLoC Layer (1 ngày)

- [ ] Create ProfileBloc with events & states
- [ ] Implement event handlers
- [ ] Add caching logic
- [ ] Write BLoC tests
- [ ] Register in DI

### Phase 4: UI Layer (2 ngày)

- [ ] Create UserProfilePage with CustomScrollView
- [ ] Create ProfileHeader widget
- [ ] Create StatsCard widget
- [ ] Create PreferenceCard widget
- [ ] Create SavedMoviesGrid widget
- [ ] Create WatchHistoryGrid widget
- [ ] Create ProfileEditSheet (Bottom Sheet)
- [ ] Create AuthDialog (if not already exists)
- [ ] Add routing to profile page
- [ ] Test on different screen sizes

### Phase 5: Polish (0.5 ngày)

- [ ] Add animations (parallax banner, fade-in cards)
- [ ] Add pull-to-refresh
- [ ] Add error states with retry
- [ ] Add empty states
- [ ] Optimize image loading
- [ ] Test auth flow

**Total estimate:** 5 days

---

## 🎯 Next Steps

1. Read [01-profile-data-domain.md](./01-profile-data-domain.md) - Data & Domain layer implementation
2. Read [02-profile-bloc.md](./02-profile-bloc.md) - BLoC state management
3. Read [03-profile-ui.md](./03-profile-ui.md) - UI widgets with AniYomi style

---

**Note:** Tài liệu này được tạo dựa trên `src/pages/UserProfile.jsx` và follow phong cách AniYomi (Material You, bottom sheets, modern UI).
