# ⚙️ Profile Feature - BLoC State Management

## Mục đích

Implement ProfileBloc với events, states, và business logic.

---

## Task 1: Create ProfileBloc Events

### Prompt cho AI Agent:

```
Tạo events trong lib/features/profile/presentation/bloc/:

File: profile_event.dart
---
import 'package:equatable/equatable.dart';

abstract class ProfileEvent extends Equatable {
  const ProfileEvent();

  @override
  List<Object?> get props => [];
}

/// Load complete profile data
class LoadProfileEvent extends ProfileEvent {
  final String userId;

  const LoadProfileEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}

/// Refresh profile data
class RefreshProfileEvent extends ProfileEvent {
  final String userId;

  const RefreshProfileEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}

/// Update profile information
class UpdateProfileEvent extends ProfileEvent {
  final String userId;
  final String fullName;
  final String? avatarUrl;
  final String? bannerUrl;

  const UpdateProfileEvent({
    required this.userId,
    required this.fullName,
    this.avatarUrl,
    this.bannerUrl,
  });

  @override
  List<Object?> get props => [userId, fullName, avatarUrl, bannerUrl];
}

/// Logout user
class LogoutEvent extends ProfileEvent {
  const LogoutEvent();
}
```

---

## Task 2: Create ProfileBloc States

### Prompt cho AI Agent:

```
Tạo states trong lib/features/profile/presentation/bloc/:

File: profile_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../movie/domain/entities/movie_entity.dart';
import '../../domain/entities/preference.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/entities/user_stats.dart';
import '../../domain/entities/watch_history_item.dart';

abstract class ProfileState extends Equatable {
  const ProfileState();

  @override
  List<Object?> get props => [];
}

/// Initial state
class ProfileInitial extends ProfileState {
  const ProfileInitial();
}

/// Loading state
class ProfileLoading extends ProfileState {
  const ProfileLoading();
}

/// Loaded state with all data
class ProfileLoaded extends ProfileState {
  final UserProfile profile;
  final UserStats stats;
  final List<Preference> favoriteGenres;
  final List<Preference> favoriteCountries;
  final List<MovieEntity> savedMovies;
  final List<WatchHistoryItem> watchHistory;

  const ProfileLoaded({
    required this.profile,
    required this.stats,
    required this.favoriteGenres,
    required this.favoriteCountries,
    required this.savedMovies,
    required this.watchHistory,
  });

  /// Check if has any data
  bool get hasAnyData =>
      savedMovies.isNotEmpty ||
      watchHistory.isNotEmpty ||
      favoriteGenres.isNotEmpty ||
      favoriteCountries.isNotEmpty;

  @override
  List<Object?> get props => [
        profile,
        stats,
        favoriteGenres,
        favoriteCountries,
        savedMovies,
        watchHistory,
      ];

  ProfileLoaded copyWith({
    UserProfile? profile,
    UserStats? stats,
    List<Preference>? favoriteGenres,
    List<Preference>? favoriteCountries,
    List<MovieEntity>? savedMovies,
    List<WatchHistoryItem>? watchHistory,
  }) {
    return ProfileLoaded(
      profile: profile ?? this.profile,
      stats: stats ?? this.stats,
      favoriteGenres: favoriteGenres ?? this.favoriteGenres,
      favoriteCountries: favoriteCountries ?? this.favoriteCountries,
      savedMovies: savedMovies ?? this.savedMovies,
      watchHistory: watchHistory ?? this.watchHistory,
    );
  }
}

/// Error state
class ProfileError extends ProfileState {
  final String message;

  const ProfileError({required this.message});

  @override
  List<Object?> get props => [message];
}

/// Updating state (for profile updates)
class ProfileUpdating extends ProfileState {
  final ProfileLoaded currentData;

  const ProfileUpdating({required this.currentData});

  @override
  List<Object?> get props => [currentData];
}
```

---

## Task 3: Implement ProfileBloc

### Prompt cho AI Agent:

```
Tạo BLoC trong lib/features/profile/presentation/bloc/:

File: profile_bloc.dart
---
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/user_stats.dart';
import '../../domain/usecases/get_favorite_countries.dart';
import '../../domain/usecases/get_favorite_genres.dart';
import '../../domain/usecases/get_saved_movies.dart';
import '../../domain/usecases/get_user_profile.dart';
import '../../domain/usecases/get_user_stats.dart';
import '../../domain/usecases/get_watch_history.dart';
import '../../domain/usecases/update_user_profile.dart';
import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final GetUserProfile getUserProfile;
  final UpdateUserProfile updateUserProfile;
  final GetUserStats getUserStats;
  final GetFavoriteGenres getFavoriteGenres;
  final GetFavoriteCountries getFavoriteCountries;
  final GetSavedMovies getSavedMovies;
  final GetWatchHistory getWatchHistory;

  ProfileBloc({
    required this.getUserProfile,
    required this.updateUserProfile,
    required this.getUserStats,
    required this.getFavoriteGenres,
    required this.getFavoriteCountries,
    required this.getSavedMovies,
    required this.getWatchHistory,
  }) : super(const ProfileInitial()) {
    on<LoadProfileEvent>(_onLoadProfile);
    on<RefreshProfileEvent>(_onRefreshProfile);
    on<UpdateProfileEvent>(_onUpdateProfile);
    on<LogoutEvent>(_onLogout);
  }

  /// Load all profile data
  Future<void> _onLoadProfile(
    LoadProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(const ProfileLoading());

    try {
      // Load all data in parallel using Future.wait
      final results = await Future.wait([
        getUserProfile(event.userId).then((r) => r.fold((l) => null, (r) => r)),
        getUserStats(event.userId).then((r) => r.fold((l) => UserStats.empty, (r) => r)),
        getFavoriteGenres(event.userId).then((r) => r.fold((l) => <dynamic>[], (r) => r)),
        getFavoriteCountries(event.userId).then((r) => r.fold((l) => <dynamic>[], (r) => r)),
        getSavedMovies(event.userId).then((r) => r.fold((l) => <dynamic>[], (r) => r)),
        getWatchHistory(event.userId).then((r) => r.fold((l) => <dynamic>[], (r) => r)),
      ]);

      final profile = results[0];
      if (profile == null) {
        emit(const ProfileError(message: 'Không thể tải hồ sơ người dùng'));
        return;
      }

      emit(ProfileLoaded(
        profile: profile,
        stats: results[1] as UserStats,
        favoriteGenres: results[2] as List<dynamic>,
        favoriteCountries: results[3] as List<dynamic>,
        savedMovies: results[4] as List<dynamic>,
        watchHistory: results[5] as List<dynamic>,
      ));
    } catch (e) {
      emit(ProfileError(message: 'Đã xảy ra lỗi: ${e.toString()}'));
    }
  }

  /// Refresh profile data
  Future<void> _onRefreshProfile(
    RefreshProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    // Use same logic as LoadProfile but don't emit loading state
    await _onLoadProfile(LoadProfileEvent(userId: event.userId), emit);
  }

  /// Update profile information
  Future<void> _onUpdateProfile(
    UpdateProfileEvent event,
    Emitter<ProfileState> emit,
  ) async {
    final currentState = state;
    if (currentState is! ProfileLoaded) return;

    emit(ProfileUpdating(currentData: currentState));

    final result = await updateUserProfile(UpdateProfileParams(
      userId: event.userId,
      fullName: event.fullName,
      avatarUrl: event.avatarUrl,
      bannerUrl: event.bannerUrl,
    ));

    result.fold(
      (failure) {
        emit(ProfileError(message: failure.message));
        // Restore previous state after showing error
        Future.delayed(const Duration(seconds: 2), () {
          if (!isClosed) emit(currentState);
        });
      },
      (updatedProfile) {
        emit(currentState.copyWith(profile: updatedProfile));
      },
    );
  }

  /// Logout
  Future<void> _onLogout(
    LogoutEvent event,
    Emitter<ProfileState> emit,
  ) async {
    // Clear state and emit initial
    emit(const ProfileInitial());

    // Note: Actual logout (Supabase signOut) should be handled by AuthBloc
    // This just resets the ProfileBloc state
  }
}
```

---

## Task 4: Register in Dependency Injection

### Prompt cho AI Agent:

```
Add to lib/injection_container.dart:

// ProfileBloc - Factory (creates new instance for each user)
sl.registerFactory<ProfileBloc>(
  () => ProfileBloc(
    getUserProfile: sl(),
    updateUserProfile: sl(),
    getUserStats: sl(),
    getFavoriteGenres: sl(),
    getFavoriteCountries: sl(),
    getSavedMovies: sl(),
    getWatchHistory: sl(),
  ),
);
```

---

## Task 5: BLoC Testing

### Prompt cho AI Agent:

```
Create test file: test/features/profile/presentation/bloc/profile_bloc_test.dart

import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:your_app/core/error/failures.dart';
import 'package:your_app/features/profile/domain/entities/user_profile.dart';
import 'package:your_app/features/profile/domain/entities/user_stats.dart';
import 'package:your_app/features/profile/domain/usecases/get_user_profile.dart';
import 'package:your_app/features/profile/domain/usecases/get_user_stats.dart';
// ... other imports

// Mock classes
class MockGetUserProfile extends Mock implements GetUserProfile {}
class MockGetUserStats extends Mock implements GetUserStats {}
// ... other mocks

void main() {
  late ProfileBloc bloc;
  late MockGetUserProfile mockGetUserProfile;
  late MockGetUserStats mockGetUserStats;
  // ... other mocks

  setUp(() {
    mockGetUserProfile = MockGetUserProfile();
    mockGetUserStats = MockGetUserStats();
    // ... initialize other mocks

    bloc = ProfileBloc(
      getUserProfile: mockGetUserProfile,
      getUserStats: mockGetUserStats,
      // ... inject all use cases
    );
  });

  tearDown(() => bloc.close());

  group('ProfileBloc', () {
    const testUserId = 'test-user-123';
    final testProfile = UserProfile(
      id: testUserId,
      fullName: 'Test User',
      email: 'test@example.com',
      createdAt: DateTime.now(),
    );
    const testStats = UserStats.empty;

    test('initial state is ProfileInitial', () {
      expect(bloc.state, equals(const ProfileInitial()));
    });

    blocTest<ProfileBloc, ProfileState>(
      'emits [ProfileLoading, ProfileLoaded] when LoadProfileEvent succeeds',
      build: () {
        when(() => mockGetUserProfile(any()))
            .thenAnswer((_) async => Right(testProfile));
        when(() => mockGetUserStats(any()))
            .thenAnswer((_) async => const Right(testStats));
        // ... mock other use cases

        return bloc;
      },
      act: (bloc) => bloc.add(const LoadProfileEvent(userId: testUserId)),
      expect: () => [
        const ProfileLoading(),
        isA<ProfileLoaded>()
            .having((s) => s.profile.id, 'profile id', testUserId)
            .having((s) => s.stats, 'stats', testStats),
      ],
    );

    blocTest<ProfileBloc, ProfileState>(
      'emits [ProfileLoading, ProfileError] when LoadProfileEvent fails',
      build: () {
        when(() => mockGetUserProfile(any()))
            .thenAnswer((_) async => Left(ServerFailure('Error')));

        return bloc;
      },
      act: (bloc) => bloc.add(const LoadProfileEvent(userId: testUserId)),
      expect: () => [
        const ProfileLoading(),
        isA<ProfileError>()
            .having((s) => s.message, 'message', contains('Không thể tải')),
      ],
    );

    blocTest<ProfileBloc, ProfileState>(
      'emits [ProfileUpdating, ProfileLoaded] when UpdateProfileEvent succeeds',
      build: () {
        when(() => mockUpdateUserProfile(any()))
            .thenAnswer((_) async => Right(testProfile));

        return bloc;
      },
      seed: () => ProfileLoaded(
        profile: testProfile,
        stats: testStats,
        favoriteGenres: const [],
        favoriteCountries: const [],
        savedMovies: const [],
        watchHistory: const [],
      ),
      act: (bloc) => bloc.add(UpdateProfileEvent(
        userId: testUserId,
        fullName: 'Updated Name',
      )),
      expect: () => [
        isA<ProfileUpdating>(),
        isA<ProfileLoaded>()
            .having((s) => s.profile.fullName, 'full name', 'Updated Name'),
      ],
    );
  });
}
```

---

## ✅ Checklist ProfileBloc

- [ ] ProfileEvent classes created (Load, Refresh, Update, Logout)
- [ ] ProfileState classes created (Initial, Loading, Loaded, Error, Updating)
- [ ] ProfileBloc implemented with all event handlers
- [ ] Parallel data loading with Future.wait()
- [ ] Error handling with Either pattern
- [ ] Registered as Factory in DI (new instance per user)
- [ ] Unit tests written with bloc_test
- [ ] All use cases properly injected

---

## 🎯 Usage Example in Widget

```dart
// In UserProfilePage
@override
Widget build(BuildContext context) {
  return BlocProvider(
    create: (_) => sl<ProfileBloc>()
      ..add(LoadProfileEvent(userId: user.id)),
    child: BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        if (state is ProfileLoading) {
          return const LoadingWidget();
        }

        if (state is ProfileError) {
          return ErrorWidget(
            message: state.message,
            onRetry: () => context.read<ProfileBloc>().add(
              LoadProfileEvent(userId: user.id),
            ),
          );
        }

        if (state is ProfileLoaded) {
          return _buildProfileContent(state);
        }

        return const SizedBox.shrink();
      },
    ),
  );
}

// Refresh on pull
RefreshIndicator(
  onRefresh: () async {
    context.read<ProfileBloc>().add(
      RefreshProfileEvent(userId: user.id),
    );
    // Wait for state to update
    await context.read<ProfileBloc>().stream.firstWhere(
      (state) => state is! ProfileLoading,
    );
  },
  child: _buildScrollableContent(),
);

// Update profile
void _onSaveProfile() {
  context.read<ProfileBloc>().add(UpdateProfileEvent(
    userId: user.id,
    fullName: _nameController.text,
    avatarUrl: _avatarController.text,
    bannerUrl: _bannerController.text,
  ));
}
```

---

**Tiếp theo:** [03-profile-ui.md](./03-profile-ui.md) - Complete UI với AniYomi style
