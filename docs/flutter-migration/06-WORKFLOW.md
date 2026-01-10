# 🔄 Flutter Migration Workflow

## Giới thiệu

Tài liệu này cung cấp **workflow chi tiết** để thực hiện migration từng phase của dự án movie-finder từ React sang Flutter.

---

## 📋 Workflow Overview

```
Phase 1: Foundation (2-3 ngày)
    ↓
Phase 2: Data & Domain (3-4 ngày)
    ↓
Phase 3: Business Logic (3-4 ngày)
    ↓
Phase 4: UI Implementation (5-7 ngày)
    ↓
Phase 5: Optimization & Testing (3-4 ngày)
    ↓
🎉 Launch Ready!
```

---

## 🚀 Phase 1: Foundation Setup (2-3 ngày)

### Ngày 1: Project Initialization

#### Morning (2 giờ)

```bash
# 1. Create Flutter project
flutter create movie_finder --platforms=android,ios,web

cd movie_finder

# 2. Add initial pubspec.yaml dependencies
flutter pub get

# 3. Run initial setup
flutter run
```

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 1.1: Create pubspec.yaml with all dependencies

  - Add: flutter_bloc, go_router, get_it, supabase_flutter, dio, dartz, etc.
  - Run: `flutter pub get`

- [ ] Task 1.2: Create lib/core/constants/ folder structure
  - app_colors.dart (Material 3 colors)
  - app_strings.dart (Vietnamese strings)
  - app_config.dart (API URLs, timeouts)
  - app_constants.dart (regex, limits)

**Checklist:**

```
✓ All dependencies installed
✓ Constants files created
✓ No import errors
```

### Ngày 2: Core Setup

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 1.3: Create app_theme.dart

  - Material 3 dark theme
  - Custom colors, typography, shapes
  - Test: `flutter run` - should display correct colors

- [ ] Task 1.4: Setup error handling
  - lib/core/error/failures.dart
  - lib/core/error/exceptions.dart
  - 5 failure types

**Checklist:**

```
✓ Theme applies correctly
✓ No theme errors
✓ Failure classes created
```

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 1.5: Create API client (Dio)

  - lib/core/network/api_client.dart
  - HTTP client with interceptors
  - Error handling

- [ ] Task 1.6: Setup Supabase client
  - lib/core/network/supabase_client.dart
  - Initialize with env variables
  - Test connection

**Checklist:**

```
✓ Dio client created
✓ Supabase initialized
✓ No connection errors
```

### Ngày 3: Dependency Injection & Routing

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 1.7: Setup GetIt (DI)

  - lib/injection_container.dart
  - Register all services
  - Create `setup()` function called in main()

- [ ] Task 1.8: Create routing structure
  - lib/routes/app_router.dart
  - GoRouter configuration
  - Named routes for all screens

**Checklist:**

```
✓ GetIt registered all dependencies
✓ No circular dependencies
✓ Router compiles without errors
```

#### Afternoon (2 giờ)

**Tasks:**

- [ ] Task 1.9: Create Material 3 widgets

  - lib/core/widgets/loading_widget.dart
  - lib/core/widgets/error_widget.dart
  - Custom shimmer loading states

- [ ] Task 1.10: Setup Main App
  - lib/main.dart
  - Initialize getit
  - Run app with router

**Testing:**

```
✓ App starts without errors
✓ Routing works
✓ Loading indicators appear
```

**Output Phase 1:**

```
lib/
├── core/
│   ├── constants/
│   ├── error/
│   ├── network/
│   ├── theme/
│   ├── widgets/
│   └── utils/
├── features/
│   └── (placeholder)
├── injection_container.dart
├── main.dart
└── routes/
```

---

## 📊 Phase 2: Data & Domain Layer (3-4 ngày)

### Ngày 4: Entities & Models

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 2.1: Create domain entities

  - lib/features/movie/domain/entities/
  - MovieEntity, EpisodeEntity, UserEntity, etc.
  - Use freezed/equatable for value equality

- [ ] Task 2.2: Create data models
  - lib/features/movie/data/models/
  - MovieModel.fromJson/toJson
  - Map to entities with `toEntity()`

**Testing:**

```bash
# Verify fromJson/toJson
flutter test test/features/movie/data/models/

# Visual check
dart run lib/features/movie/data/models/movie_model.dart
```

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 2.3: Create repository interfaces

  - lib/features/movie/domain/repositories/
  - Define abstract methods
  - Return Either<Failure, Entity>

- [ ] Task 2.4: Create data sources
  - lib/features/movie/data/datasources/
  - MovieRemoteDataSource (PhimAPI)
  - MovieSupabaseDataSource

**Checklist:**

```
✓ All entities created
✓ Models can parse JSON
✓ Repository interfaces defined
✓ Data sources structure ready
```

### Ngày 5: Repository Implementations

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 2.5: Implement MovieRepository

  - lib/features/movie/data/repositories/
  - Handle errors with Either pattern
  - Combine remote + supabase sources

- [ ] Task 2.6: Implement other repositories
  - UserRepository
  - LibraryRepository
  - HistoryRepository

**Testing:**

```bash
flutter test test/features/movie/domain/repositories/
```

#### Afternoon (2 giờ)

**Tasks:**

- [ ] Task 2.7-2.11: Create use cases
  - lib/features/movie/domain/usecases/
  - GetLatestMovies
  - GetMovieDetail
  - SearchMovies
  - etc.

**Testing:**

```bash
flutter test test/features/movie/domain/usecases/
```

**Output Phase 2:**

```
lib/features/movie/
├── domain/
│   ├── entities/
│   ├── repositories/ (interfaces)
│   └── usecases/
└── data/
    ├── models/
    ├── datasources/
    └── repositories/ (implementations)
```

---

## ⚙️ Phase 3: Business Logic (3-4 ngày)

### Ngày 6: Authentication & Home

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 3.1: Create AuthBloc

  - lib/features/auth/presentation/bloc/
  - States: AuthInitial, AuthLoading, AuthLogged, AuthError
  - Events: SignInEmail, SignUpEmail, SignInGoogle, SignOut

- [ ] Task 3.2: Create HomeCubit
  - lib/features/home/presentation/cubit/
  - Load multiple movie sections
  - Handle loading states

**Testing:**

```bash
flutter test test/features/auth/presentation/bloc/auth_bloc_test.dart
flutter test test/features/home/presentation/cubit/home_cubit_test.dart
```

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 3.3: Register in DI
- [ ] Task 3.4: Create MovieDetailCubit
- [ ] Task 3.5: Create ExploreCubit with filters

**Checklist:**

```
✓ AuthBloc emits correct states
✓ HomeCubit loads all sections
✓ MovieDetailCubit selects episodes
✓ ExploreCubit handles filters
```

### Ngày 7-8: Other Cubits

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 3.6: Create SearchCubit

  - Debounce search input
  - Store recent searches
  - Handle results

- [ ] Task 3.7: Create LibraryCubit
  - Load saved movies
  - Add/remove from library
  - Persist to Supabase

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 3.8: Create HistoryCubit

  - Track watch history
  - Resume watching
  - Clear history

- [ ] Task 3.9: Create WatchStatusCubit (if needed)

**Testing:**

```bash
flutter test test/features/
```

**Output Phase 3:**

```
lib/features/
├── auth/presentation/bloc/
├── home/presentation/cubit/
├── movie/presentation/cubit/
├── explore/presentation/cubit/
├── search/presentation/cubit/
├── library/presentation/cubit/
└── history/presentation/cubit/
```

---

## 🎨 Phase 4: UI Implementation (5-7 ngày)

### Ngày 9: Reusable Widgets

#### Morning (4 giờ)

**Tasks:**

- [ ] Task 4.1: Create MovieCard widgets

  - lib/features/movie/presentation/widgets/movie_card.dart
  - MovieCardHorizontal
  - MovieCardTop10

- [ ] Task 4.2: Create MovieGrid & Row
  - ResponsiveMovieGrid
  - MovieRow
  - MovieRowTop10

**Testing:**

```bash
flutter test test/features/movie/presentation/widgets/

# Run app to see widgets
flutter run
```

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 4.3: Create HeroSection

  - Auto-play slider
  - Page indicators
  - Gradient overlay

- [ ] Task 4.4: Create VideoPlayerWidget
  - Chewie integration
  - HLS support
  - Error handling

**Checklist:**

```
✓ MovieCard renders correctly
✓ Grid is responsive
✓ Hero section animates
✓ Video player initializes
```

### Ngày 10: Pages

#### Morning (4 giờ)

**Tasks:**

- [ ] Task 4.5: Create HomePage

  - Hero section
  - Multiple movie rows
  - Pull-to-refresh
  - Responsive layout

- [ ] Task 4.6: Create MovieDetailPage
  - Video player
  - Episode selector
  - Save/bookmark button
  - Movie info display

**Testing:**

```bash
flutter run

# Navigate to pages via routes
# Test responsive on different screen sizes
```

#### Afternoon (4 giờ)

**Tasks:**

- [ ] Task 4.7: Create ExplorePage

  - Filter sidebar/bar
  - Responsive grid
  - Pagination

- [ ] Task 4.8: Create Library & History Pages
- [ ] Task 4.9: Create Search Page

**Testing:**

```bash
flutter run

# Test all navigation routes
# Verify filters work
# Test search with debounce
```

### Ngày 11: Polish Pages

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 4.10: Update router with real pages
  - Remove placeholder pages
  - Add all new pages
  - Test routing

**Testing:**

```bash
flutter run

# Test all routes work
# Test back button behavior
```

#### Afternoon (2 giờ)

**Polish:**

- [ ] Add loading skeletons for all lists
- [ ] Add error states with retry
- [ ] Add empty states with CTAs
- [ ] Responsive design tweaks

**Checklist:**

```
✓ All pages implemented
✓ Navigation works
✓ Responsive on mobile, tablet, web
✓ Loading states shown
✓ Error states handled
✓ Empty states displayed
```

**Output Phase 4:**

```
lib/features/
├── home/presentation/pages/
├── movie/presentation/pages/
├── explore/presentation/pages/
├── library/presentation/pages/
├── history/presentation/pages/
└── search/presentation/pages/
```

---

## 🔧 Phase 5: Optimization & Testing (3-4 ngày)

### Ngày 12: Performance & Testing

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 5.1: Image caching setup

  - CachedNetworkImage configuration
  - Memory management
  - Shimmer loading

- [ ] Task 5.2: List optimization
  - ListView.builder everywhere
  - Cache extent
  - Repaint boundaries

**Testing:**

```bash
flutter run --profile

# Check performance in DevTools
# Monitor memory usage
```

#### Afternoon (3 giờ)

**Tasks:**

- [ ] Task 5.3: Web platform optimization
- [ ] Task 5.4: Setup testing
  - Test helpers
  - Mock classes
  - Write sample tests

**Testing:**

```bash
flutter test test/

# All tests should pass
```

### Ngày 13: Polish & Deploy

#### Morning (3 giờ)

**Tasks:**

- [ ] Task 5.5: Enhanced error handling
- [ ] Task 5.6: Analytics (if needed)
- [ ] Task 5.7: App polish
  - Splash screen
  - Onboarding
  - Settings page

**Testing:**

```bash
flutter run

# Test splash screen
# Test onboarding flow
# Test settings page
```

#### Afternoon (2-3 giờ)

**Tasks:**

- [ ] Task 5.8: Pre-launch checklist
- [ ] Task 5.9: Build & deploy

**Building:**

```bash
# Android
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

**Output Phase 5:**

```
✓ Performance optimized
✓ Tests created
✓ Error handling enhanced
✓ App polished
✓ Ready to deploy
```

---

## 📅 Total Timeline

| Phase     | Duration       | Status      |
| --------- | -------------- | ----------- |
| Phase 1   | 2-3 days       | ⏳ Planning |
| Phase 2   | 3-4 days       | ⏳ Planning |
| Phase 3   | 3-4 days       | ⏳ Planning |
| Phase 4   | 5-7 days       | ⏳ Planning |
| Phase 5   | 3-4 days       | ⏳ Planning |
| **Total** | **16-22 days** | **⏳**      |

---

## 🎯 Key Milestones

### ✅ Milestone 1: Core App Structure (After Phase 1)

- Project initializes
- Theme applies
- Router works
- DI configured

### ✅ Milestone 2: Data Layer Ready (After Phase 2)

- API integration works
- Models parse JSON
- Repositories functional
- Use cases available

### ✅ Milestone 3: App Logic Complete (After Phase 3)

- All BLoCs/Cubits created
- State management working
- User can auth
- Can load movies

### ✅ Milestone 4: Full UI Implementation (After Phase 4)

- All screens implemented
- Navigation works
- Responsive design
- Video player works

### ✅ Milestone 5: Production Ready (After Phase 5)

- Performance optimized
- Tests written
- Error handling polished
- Ready to deploy

---

## 🚨 Common Issues & Solutions

### Issue 1: Build errors after adding dependencies

```bash
# Solution:
flutter pub get
flutter clean
flutter pub get
flutter run
```

### Issue 2: GoRouter navigation not working

```bash
# Check:
- Routes defined in app_router.dart
- All pages imported
- Route names are correct
```

### Issue 3: BLoC state not updating UI

```bash
# Check:
- BlocBuilder is wrapping widget
- State class extends Equatable
- Events are being added correctly
- close() called in dispose
```

### Issue 4: Images not loading

```bash
# Solution:
- Check URL is valid
- Add User-Agent header in DIO
- Check CORS headers
- Verify cache manager config
```

### Issue 5: Video player not playing

```bash
# Check:
- URL is HLS (.m3u8)
- Network request succeeds
- Chewie initialized properly
- Error message from player
```

---

## 📝 Daily Standup Template

```markdown
## Daily Standup Report

**Date:** [Date]
**Phase:** [Phase Number]
**Tasks Completed:**

- [ ] Task X.Y: [Description]

**Blockers:**

- [Any issues encountered]

**Tomorrow's Plan:**

- [ ] Task X.Y+1: [Description]

**Code Quality:**

- [ ] No console errors
- [ ] No warnings
- [ ] Proper formatting
- [ ] Tests passing
```

---

## 🔗 Reference Links

- [Flutter Documentation](https://docs.flutter.dev)
- [BLoC Pattern](https://bloclibrary.dev)
- [Supabase Flutter](https://supabase.com/docs/guides/getting-started/quickstarts/flutter)
- [GoRouter Documentation](https://pub.dev/packages/go_router)
- [GetIt Service Locator](https://pub.dev/packages/get_it)
- [Dartz Either Pattern](https://pub.dev/packages/dartz)
- [Clean Architecture](https://resocoder.com/flutter-clean-architecture)

---

**Lưu ý:** Workflow này là flexible - bạn có thể điều chỉnh số ngày/giờ dựa trên kinh nghiệm của bạn.
