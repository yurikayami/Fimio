# 🎬 Fimio Flutter Migration - Technical Implementation Blueprint

## Mục Lục Tài Liệu

| File                                                       | Nội Dung                         | Trạng Thái |
| ---------------------------------------------------------- | -------------------------------- | ---------- |
| [00-overview.md](./00-overview.md)                         | Tổng quan dự án & Kiến trúc      | 📄 Current |
| [01-phase-foundation.md](./01-phase-foundation.md)         | Phase 1: Foundation & Core Setup | 📄         |
| [02-phase-data-domain.md](./02-phase-data-domain.md)       | Phase 2: Data & Domain Layer     | 📄         |
| [03-phase-business-logic.md](./03-phase-business-logic.md) | Phase 3: Business Logic (BLoC)   | 📄         |
| [04-phase-ui.md](./04-phase-ui.md)                         | Phase 4: UI Implementation       | 📄         |
| [05-phase-optimization.md](./05-phase-optimization.md)     | Phase 5: Optimization & Polish   | 📄         |

---

## 1. Executive Summary

### 1.1 Mục Tiêu Dự Án

Chuyển đổi ứng dụng web xem phim **Fimio** từ ReactJS sang **Flutter** để:

- Hỗ trợ đa nền tảng (iOS, Android, Web) từ một codebase duy nhất
- Cải thiện hiệu năng và trải nghiệm người dùng native
- Tận dụng backend Supabase hiện có

### 1.2 Tech Stack Mới

| Layer                | Technology                            |
| -------------------- | ------------------------------------- |
| **Framework**        | Flutter 3.x (Dart 3.x)                |
| **State Management** | flutter_bloc (Cubit/Bloc)             |
| **Routing**          | go_router                             |
| **DI**               | get_it + injectable                   |
| **Backend**          | Supabase (giữ nguyên)                 |
| **HTTP Client**      | dio                                   |
| **Local Storage**    | shared_preferences / hive             |
| **Video Player**     | video_player + chewie / better_player |
| **Image Caching**    | cached_network_image                  |

---

## 2. Source Code Analysis (ReactJS → Flutter Mapping)

### 2.1 API Services Mapping

**Source:** `src/services/api.js`

| React Function                       | Flutter Equivalent                         | Notes                    |
| ------------------------------------ | ------------------------------------------ | ------------------------ |
| `getLatestMovies(page)`              | `MovieRemoteDataSource.getLatestMovies()`  | Pagination support       |
| `searchMovies(keyword, options)`     | `MovieRemoteDataSource.searchMovies()`     | Filter params            |
| `getMovieDetails(slug)`              | `MovieRemoteDataSource.getMovieDetails()`  | Returns Movie + Episodes |
| `getMoviesByType(typeList, options)` | `MovieRemoteDataSource.getMoviesByType()`  | Category filtering       |
| `getCategories()`                    | `CategoryRemoteDataSource.getCategories()` | Static data              |
| `getCountries()`                     | `CountryRemoteDataSource.getCountries()`   | Static data              |
| `buildImageUrl(url)`                 | `ImageUrlHelper.buildOptimizedUrl()`       | WebP conversion          |

### 2.2 Supabase Integration Mapping

**Source:** `src/lib/supabase.js`, `src/hooks/useUserActions.js`

| React Hook/Function               | Flutter Equivalent                      |
| --------------------------------- | --------------------------------------- |
| `useAuth()`                       | `AuthBloc` + `AuthRepository`           |
| `supabase.auth.signInWithOAuth()` | `SupabaseClient.auth.signInWithOAuth()` |
| `addToLibrary()`                  | `LibraryRepository.addMovie()`          |
| `addToHistory()`                  | `WatchHistoryRepository.addEntry()`     |
| `checkIsSaved()`                  | `LibraryRepository.isMovieSaved()`      |
| `removeFromLibrary()`             | `LibraryRepository.removeMovie()`       |
| `sync_movie_data` RPC             | `MovieRepository.syncMovieData()`       |

### 2.3 Database Schema (Supabase)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    profiles     │     │     movies      │     │    episodes     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID, PK)   │     │ id (BIGINT, PK) │     │ id (BIGINT, PK) │
│ email           │     │ slug (UNIQUE)   │     │ movie_id (FK)   │
│ full_name       │     │ name            │     │ server_name     │
│ avatar_url      │     │ origin_name     │     │ name            │
│ banner_url      │     │ poster_url      │     │ link_embed      │
│ is_vip          │     │ thumb_url       │     │ link_m3u8       │
│ created_at      │     │ year            │     └─────────────────┘
│ updated_at      │     │ type            │
└─────────────────┘     │ quality         │
        │               │ content         │
        │               │ ...             │
        ▼               └─────────────────┘
┌─────────────────┐              │
│    library      │              │
├─────────────────┤              │
│ user_id (FK)    │◄─────────────┤
│ movie_id (FK)   │              │
│ created_at      │              │
└─────────────────┘              │
                                 │
┌─────────────────┐              │
│ watch_history   │              │
├─────────────────┤              │
│ user_id (FK)    │◄─────────────┘
│ movie_id (FK)   │
│ episode_name    │
│ last_position   │
│ watched_at      │
└─────────────────┘
```

---

## 3. Clean Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Screens   │  │   Widgets   │  │   BLoC/Cubit (State)    │  │
│  │  (Pages)    │  │ (Components)│  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (calls)
┌──────────────────────────────────────────────────────────────────┐
│                       DOMAIN LAYER                               │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │  Entities   │  │    Use Cases    │  │ Repository Interfaces│  │
│  │ (Pure Dart) │  │ (Business Logic)│  │   (Abstract Class)   │  │
│  └─────────────┘  └─────────────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (implements)
┌──────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Repositories  │  │  Data Sources   │  │     Models      │  │
│  │ (Implementation)│  │ (Remote/Local)  │  │ (fromJson/toJson)│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Project Structure (Target)

```
lib/
├── main.dart                          # Entry point
├── app.dart                           # MaterialApp configuration
├── injection_container.dart           # GetIt DI setup
│
├── core/                              # Shared utilities
│   ├── constants/
│   │   ├── api_constants.dart
│   │   ├── app_colors.dart
│   │   └── app_strings.dart
│   ├── error/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   ├── network/
│   │   ├── api_client.dart
│   │   └── network_info.dart
│   ├── theme/
│   │   ├── app_theme.dart
│   │   └── text_styles.dart
│   ├── utils/
│   │   ├── image_url_helper.dart
│   │   └── date_formatter.dart
│   └── widgets/                       # Shared widgets
│       ├── loading_widget.dart
│       ├── error_widget.dart
│       └── cached_image.dart
│
├── features/                          # Feature modules
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── usecases/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       └── widgets/
│   │
│   ├── movie/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   ├── home/
│   │   └── presentation/
│   │
│   ├── explore/
│   │   └── presentation/
│   │
│   ├── library/                       # Saved movies
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   ├── history/                       # Watch history
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │
│   └── profile/
│       └── presentation/
│
└── routes/
    └── app_router.dart                # go_router configuration
```

---

## 5. Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5

  # Routing
  go_router: ^13.0.0

  # Dependency Injection
  get_it: ^7.6.4
  injectable: ^2.3.2

  # Backend
  supabase_flutter: ^2.3.0

  # Networking
  dio: ^5.4.0
  connectivity_plus: ^5.0.2

  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0

  # UI Components
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  flutter_svg: ^2.0.9

  # Video Player
  video_player: ^2.8.2
  chewie: ^1.7.4
  # Alternative: better_player: ^0.0.84

  # Utilities
  intl: ^0.19.0
  dartz: ^0.10.1 # Either type for error handling
  url_launcher: ^6.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.8
  injectable_generator: ^2.4.1
  hive_generator: ^2.0.1
  mocktail: ^1.0.1
  bloc_test: ^9.1.5
```

---

## 6. Timeline Estimate

| Phase                   | Duration       | Deliverables                       |
| ----------------------- | -------------- | ---------------------------------- |
| Phase 1: Foundation     | 2-3 days       | Project setup, DI, Routing, Theme  |
| Phase 2: Data/Domain    | 3-4 days       | Models, Repositories, Data Sources |
| Phase 3: Business Logic | 3-4 days       | All BLoCs/Cubits                   |
| Phase 4: UI             | 5-7 days       | All screens and widgets            |
| Phase 5: Optimization   | 2-3 days       | Performance, Testing, Polish       |
| **Total**               | **15-21 days** | Production-ready app               |

---

## 7. Quick Start Commands

```bash
# Create Flutter project
flutter create --org com.fimio fimio_flutter

# Add dependencies
flutter pub add flutter_bloc equatable go_router get_it injectable supabase_flutter dio cached_network_image video_player chewie dartz

# Add dev dependencies
flutter pub add --dev build_runner injectable_generator mocktail bloc_test

# Generate code (after setting up injectable)
flutter pub run build_runner build --delete-conflicting-outputs

# Run app
flutter run -d chrome  # Web
flutter run -d android # Android
flutter run -d ios     # iOS
```

---

**Tiếp tục đọc các Phase chi tiết trong các file tiếp theo.**
