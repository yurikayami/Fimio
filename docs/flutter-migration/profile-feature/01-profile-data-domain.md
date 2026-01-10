# 📊 Profile Feature - Data & Domain Layer

## Mục đích

Xây dựng Data và Domain layer cho Profile feature theo Clean Architecture.

---

## Task 1: Create Domain Entities

### Prompt cho AI Agent:

```
Tạo các entities trong lib/features/profile/domain/entities/:

1. File: user_profile.dart
---
import 'package:equatable/equatable.dart';

class UserProfile extends Equatable {
  final String id;
  final String fullName;
  final String email;
  final String? avatarUrl;
  final String? bannerUrl;
  final bool isVip;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const UserProfile({
    required this.id,
    required this.fullName,
    required this.email,
    this.avatarUrl,
    this.bannerUrl,
    this.isVip = false,
    required this.createdAt,
    this.updatedAt,
  });

  /// Get display avatar with fallback
  String get displayAvatar =>
      avatarUrl ?? 'https://github.com/shadcn.png';

  /// Get display banner with fallback
  String get displayBanner =>
      bannerUrl ?? 'https://w.wallhaven.cc/full/9o/wallhaven-9ode5x.jpg';

  /// Get display name
  String get displayName => fullName.isEmpty ? 'Khách' : fullName;

  @override
  List<Object?> get props => [
        id,
        fullName,
        email,
        avatarUrl,
        bannerUrl,
        isVip,
        createdAt,
        updatedAt,
      ];

  UserProfile copyWith({
    String? id,
    String? fullName,
    String? email,
    String? avatarUrl,
    String? bannerUrl,
    bool? isVip,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserProfile(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bannerUrl: bannerUrl ?? this.bannerUrl,
      isVip: isVip ?? this.isVip,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

2. File: user_stats.dart
---
import 'package:equatable/equatable.dart';

class UserStats extends Equatable {
  final int totalMoviesWatched;
  final int totalWatchTimeMinutes;
  final int favoritesCount;

  const UserStats({
    required this.totalMoviesWatched,
    required this.totalWatchTimeMinutes,
    required this.favoritesCount,
  });

  /// Get watch time in hours
  int get watchTimeHours => totalWatchTimeMinutes ~/ 60;

  /// Get remaining watch time minutes
  int get watchTimeMinutesRemainder => totalWatchTimeMinutes % 60;

  /// Get formatted watch time (e.g., "12h 30m")
  String get formattedWatchTime {
    final hours = watchTimeHours;
    final minutes = watchTimeMinutesRemainder;

    if (hours == 0) {
      return '${minutes}m';
    } else if (minutes == 0) {
      return '${hours}h';
    } else {
      return '${hours}h ${minutes}m';
    }
  }

  /// Empty stats (for guest or new users)
  static const empty = UserStats(
    totalMoviesWatched: 0,
    totalWatchTimeMinutes: 0,
    favoritesCount: 0,
  );

  @override
  List<Object?> get props => [
        totalMoviesWatched,
        totalWatchTimeMinutes,
        favoritesCount,
      ];

  UserStats copyWith({
    int? totalMoviesWatched,
    int? totalWatchTimeMinutes,
    int? favoritesCount,
  }) {
    return UserStats(
      totalMoviesWatched: totalMoviesWatched ?? this.totalMoviesWatched,
      totalWatchTimeMinutes: totalWatchTimeMinutes ?? this.totalWatchTimeMinutes,
      favoritesCount: favoritesCount ?? this.favoritesCount,
    );
  }
}

3. File: preference.dart
---
import 'package:equatable/equatable.dart';

/// Represents a user preference (genre or country)
class Preference extends Equatable {
  final String name;
  final int count;

  const Preference({
    required this.name,
    required this.count,
  });

  @override
  List<Object?> get props => [name, count];

  Preference copyWith({
    String? name,
    int? count,
  }) {
    return Preference(
      name: name ?? this.name,
      count: count ?? this.count,
    );
  }
}

4. File: watch_history_item.dart
---
import 'package:equatable/equatable.dart';

class WatchHistoryItem extends Equatable {
  final String movieSlug;
  final String movieName;
  final String? thumbUrl;
  final String? currentEpisode;
  final DateTime lastWatchedAt;
  final int watchDurationMinutes;

  const WatchHistoryItem({
    required this.movieSlug,
    required this.movieName,
    this.thumbUrl,
    this.currentEpisode,
    required this.lastWatchedAt,
    this.watchDurationMinutes = 0,
  });

  /// Get display episode text
  String? get episodeDisplay =>
      currentEpisode != null ? 'Tập $currentEpisode' : null;

  /// Get time ago text (e.g., "2 giờ trước")
  String get timeAgoText {
    final now = DateTime.now();
    final difference = now.difference(lastWatchedAt);

    if (difference.inDays > 365) {
      final years = difference.inDays ~/ 365;
      return '$years năm trước';
    } else if (difference.inDays > 30) {
      final months = difference.inDays ~/ 30;
      return '$months tháng trước';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} ngày trước';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} giờ trước';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} phút trước';
    } else {
      return 'Vừa xong';
    }
  }

  @override
  List<Object?> get props => [
        movieSlug,
        movieName,
        thumbUrl,
        currentEpisode,
        lastWatchedAt,
        watchDurationMinutes,
      ];

  WatchHistoryItem copyWith({
    String? movieSlug,
    String? movieName,
    String? thumbUrl,
    String? currentEpisode,
    DateTime? lastWatchedAt,
    int? watchDurationMinutes,
  }) {
    return WatchHistoryItem(
      movieSlug: movieSlug ?? this.movieSlug,
      movieName: movieName ?? this.movieName,
      thumbUrl: thumbUrl ?? this.thumbUrl,
      currentEpisode: currentEpisode ?? this.currentEpisode,
      lastWatchedAt: lastWatchedAt ?? this.lastWatchedAt,
      watchDurationMinutes: watchDurationMinutes ?? this.watchDurationMinutes,
    );
  }
}
```

---

## Task 2: Create Data Models

### Prompt cho AI Agent:

```
Tạo các models trong lib/features/profile/data/models/:

1. File: user_profile_model.dart
---
import '../../domain/entities/user_profile.dart';

class UserProfileModel extends UserProfile {
  const UserProfileModel({
    required super.id,
    required super.fullName,
    required super.email,
    super.avatarUrl,
    super.bannerUrl,
    super.isVip,
    required super.createdAt,
    super.updatedAt,
  });

  /// From JSON (Supabase response)
  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      id: json['id'] as String,
      fullName: json['full_name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatar_url'] as String?,
      bannerUrl: json['banner_url'] as String?,
      isVip: json['is_vip'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : null,
    );
  }

  /// To JSON (for updates)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'full_name': fullName,
      'email': email,
      'avatar_url': avatarUrl,
      'banner_url': bannerUrl,
      'is_vip': isVip,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  /// To entity
  UserProfile toEntity() => this;

  /// From entity
  factory UserProfileModel.fromEntity(UserProfile entity) {
    return UserProfileModel(
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
      bannerUrl: entity.bannerUrl,
      isVip: entity.isVip,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }
}

2. File: user_stats_model.dart
---
import '../../domain/entities/user_stats.dart';

class UserStatsModel extends UserStats {
  const UserStatsModel({
    required super.totalMoviesWatched,
    required super.totalWatchTimeMinutes,
    required super.favoritesCount,
  });

  /// From JSON (calculated stats)
  factory UserStatsModel.fromJson(Map<String, dynamic> json) {
    return UserStatsModel(
      totalMoviesWatched: json['total_movies_watched'] as int? ?? 0,
      totalWatchTimeMinutes: json['total_watch_time'] as int? ?? 0,
      favoritesCount: json['favorites_count'] as int? ?? 0,
    );
  }

  /// To JSON
  Map<String, dynamic> toJson() {
    return {
      'total_movies_watched': totalMoviesWatched,
      'total_watch_time': totalWatchTimeMinutes,
      'favorites_count': favoritesCount,
    };
  }

  /// To entity
  UserStats toEntity() => this;

  /// From entity
  factory UserStatsModel.fromEntity(UserStats entity) {
    return UserStatsModel(
      totalMoviesWatched: entity.totalMoviesWatched,
      totalWatchTimeMinutes: entity.totalWatchTimeMinutes,
      favoritesCount: entity.favoritesCount,
    );
  }
}

3. File: preference_model.dart
---
import '../../domain/entities/preference.dart';

class PreferenceModel extends Preference {
  const PreferenceModel({
    required super.name,
    required super.count,
  });

  /// From JSON (genre/country aggregate)
  factory PreferenceModel.fromJson(Map<String, dynamic> json) {
    return PreferenceModel(
      name: json['name'] as String,
      count: json['count'] as int? ?? 0,
    );
  }

  /// To JSON
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'count': count,
    };
  }

  /// To entity
  Preference toEntity() => this;

  /// From entity
  factory PreferenceModel.fromEntity(Preference entity) {
    return PreferenceModel(
      name: entity.name,
      count: entity.count,
    );
  }
}

4. File: watch_history_item_model.dart
---
import '../../domain/entities/watch_history_item.dart';

class WatchHistoryItemModel extends WatchHistoryItem {
  const WatchHistoryItemModel({
    required super.movieSlug,
    required super.movieName,
    super.thumbUrl,
    super.currentEpisode,
    required super.lastWatchedAt,
    super.watchDurationMinutes,
  });

  /// From JSON (Supabase watch_history + movies join)
  factory WatchHistoryItemModel.fromJson(Map<String, dynamic> json) {
    // Handle nested movie object or flat structure
    final movieData = json['movies'] as Map<String, dynamic>?;

    return WatchHistoryItemModel(
      movieSlug: (movieData?['slug'] ?? json['movie_slug']) as String,
      movieName: (movieData?['name'] ?? json['movie_name']) as String,
      thumbUrl: (movieData?['thumb_url'] ?? json['thumb_url']) as String?,
      currentEpisode: json['current_episode'] as String?,
      lastWatchedAt: json['last_watched_at'] != null
          ? DateTime.parse(json['last_watched_at'] as String)
          : DateTime.now(),
      watchDurationMinutes: json['watch_duration_minutes'] as int? ?? 0,
    );
  }

  /// To JSON
  Map<String, dynamic> toJson() {
    return {
      'movie_slug': movieSlug,
      'movie_name': movieName,
      'thumb_url': thumbUrl,
      'current_episode': currentEpisode,
      'last_watched_at': lastWatchedAt.toIso8601String(),
      'watch_duration_minutes': watchDurationMinutes,
    };
  }

  /// To entity
  WatchHistoryItem toEntity() => this;

  /// From entity
  factory WatchHistoryItemModel.fromEntity(WatchHistoryItem entity) {
    return WatchHistoryItemModel(
      movieSlug: entity.movieSlug,
      movieName: entity.movieName,
      thumbUrl: entity.thumbUrl,
      currentEpisode: entity.currentEpisode,
      lastWatchedAt: entity.lastWatchedAt,
      watchDurationMinutes: entity.watchDurationMinutes,
    );
  }
}
```

---

## Task 3: Create Repository Interface

### Prompt cho AI Agent:

```
Tạo repository interface trong lib/features/profile/domain/repositories/:

File: profile_repository.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../movie/domain/entities/movie_entity.dart';
import '../entities/preference.dart';
import '../entities/user_profile.dart';
import '../entities/user_stats.dart';
import '../entities/watch_history_item.dart';

abstract class ProfileRepository {
  /// Get user profile by ID
  Future<Either<Failure, UserProfile>> getUserProfile(String userId);

  /// Update user profile
  Future<Either<Failure, UserProfile>> updateUserProfile({
    required String userId,
    required String fullName,
    String? avatarUrl,
    String? bannerUrl,
  });

  /// Get user stats (movies watched, watch time, favorites)
  Future<Either<Failure, UserStats>> getUserStats(String userId);

  /// Get favorite genres (top 5)
  Future<Either<Failure, List<Preference>>> getFavoriteGenres(String userId);

  /// Get favorite countries (top 5)
  Future<Either<Failure, List<Preference>>> getFavoriteCountries(String userId);

  /// Get saved movies from library
  Future<Either<Failure, List<MovieEntity>>> getSavedMovies(String userId);

  /// Get watch history (recent 10)
  Future<Either<Failure, List<WatchHistoryItem>>> getWatchHistory(
    String userId, {
    int limit = 10,
  });
}
```

---

## Task 4: Create Data Sources

### Prompt cho AI Agent:

```
Tạo data sources trong lib/features/profile/data/datasources/:

1. File: profile_remote_datasource.dart
---
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/error/exceptions.dart';
import '../../../movie/data/models/movie_model.dart';
import '../models/preference_model.dart';
import '../models/user_profile_model.dart';
import '../models/user_stats_model.dart';
import '../models/watch_history_item_model.dart';

abstract class ProfileRemoteDataSource {
  Future<UserProfileModel> getUserProfile(String userId);
  Future<UserProfileModel> updateUserProfile({
    required String userId,
    required String fullName,
    String? avatarUrl,
    String? bannerUrl,
  });
  Future<UserStatsModel> getUserStats(String userId);
  Future<List<PreferenceModel>> getFavoriteGenres(String userId);
  Future<List<PreferenceModel>> getFavoriteCountries(String userId);
  Future<List<MovieModel>> getSavedMovies(String userId);
  Future<List<WatchHistoryItemModel>> getWatchHistory(String userId, int limit);
}

class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final SupabaseClient supabase;

  ProfileRemoteDataSourceImpl({required this.supabase});

  @override
  Future<UserProfileModel> getUserProfile(String userId) async {
    try {
      final response = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .single();

      return UserProfileModel.fromJson(response);
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<UserProfileModel> updateUserProfile({
    required String userId,
    required String fullName,
    String? avatarUrl,
    String? bannerUrl,
  }) async {
    try {
      final updates = {
        'full_name': fullName,
        if (avatarUrl != null) 'avatar_url': avatarUrl,
        if (bannerUrl != null) 'banner_url': bannerUrl,
        'updated_at': DateTime.now().toIso8601String(),
      };

      final response = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();

      return UserProfileModel.fromJson(response);
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<UserStatsModel> getUserStats(String userId) async {
    try {
      // Get stats from watch_history
      final watchHistoryResponse = await supabase
          .from('watch_history')
          .select('movie_id, watch_duration_minutes')
          .eq('user_id', userId);

      final uniqueMovies = <String>{};
      int totalWatchTime = 0;

      for (final item in watchHistoryResponse) {
        uniqueMovies.add(item['movie_id'] as String);
        totalWatchTime += (item['watch_duration_minutes'] as int? ?? 0);
      }

      // Get favorites count from library
      final libraryResponse = await supabase
          .from('library')
          .select('id', const FetchOptions(count: CountOption.exact))
          .eq('user_id', userId);

      return UserStatsModel(
        totalMoviesWatched: uniqueMovies.length,
        totalWatchTimeMinutes: totalWatchTime,
        favoritesCount: libraryResponse.count ?? 0,
      );
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<PreferenceModel>> getFavoriteGenres(String userId) async {
    try {
      // Get movie IDs from library
      final libraryResponse = await supabase
          .from('library')
          .select('movie_id')
          .eq('user_id', userId);

      final movieIds = libraryResponse
          .map((item) => item['movie_id'] as String)
          .toList();

      if (movieIds.isEmpty) return [];

      // Get genres with count
      final genresResponse = await supabase
          .from('movie_genres')
          .select('genres ( name )')
          .inFilter('movie_id', movieIds);

      // Aggregate genres
      final genreMap = <String, int>{};
      for (final item in genresResponse) {
        final genreName = item['genres']?['name'] as String?;
        if (genreName != null) {
          genreMap[genreName] = (genreMap[genreName] ?? 0) + 1;
        }
      }

      // Sort and take top 5
      final sortedGenres = genreMap.entries.toList()
        ..sort((a, b) => b.value.compareTo(a.value));

      return sortedGenres
          .take(5)
          .map((entry) => PreferenceModel(name: entry.key, count: entry.value))
          .toList();
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<PreferenceModel>> getFavoriteCountries(String userId) async {
    try {
      // Get movie IDs from library
      final libraryResponse = await supabase
          .from('library')
          .select('movie_id')
          .eq('user_id', userId);

      final movieIds = libraryResponse
          .map((item) => item['movie_id'] as String)
          .toList();

      if (movieIds.isEmpty) return [];

      // Get countries with count
      final countriesResponse = await supabase
          .from('movie_countries')
          .select('countries ( name )')
          .inFilter('movie_id', movieIds);

      // Aggregate countries
      final countryMap = <String, int>{};
      for (final item in countriesResponse) {
        final countryName = item['countries']?['name'] as String?;
        if (countryName != null) {
          countryMap[countryName] = (countryMap[countryName] ?? 0) + 1;
        }
      }

      // Sort and take top 5
      final sortedCountries = countryMap.entries.toList()
        ..sort((a, b) => b.value.compareTo(a.value));

      return sortedCountries
          .take(5)
          .map((entry) => PreferenceModel(name: entry.key, count: entry.value))
          .toList();
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<MovieModel>> getSavedMovies(String userId) async {
    try {
      final response = await supabase
          .from('library')
          .select('movies ( * )')
          .eq('user_id', userId)
          .order('added_at', ascending: false);

      return response
          .map((item) => MovieModel.fromJson(item['movies'] as Map<String, dynamic>))
          .toList();
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  @override
  Future<List<WatchHistoryItemModel>> getWatchHistory(
    String userId,
    int limit,
  ) async {
    try {
      final response = await supabase
          .from('watch_history')
          .select('*, movies ( slug, name, thumb_url )')
          .eq('user_id', userId)
          .order('last_watched_at', ascending: false)
          .limit(limit);

      return response
          .map((item) => WatchHistoryItemModel.fromJson(item))
          .toList();
    } on PostgrestException catch (e) {
      throw ServerException(e.message);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }
}

2. File: profile_local_datasource.dart
---
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile_model.dart';
import '../models/user_stats_model.dart';

abstract class ProfileLocalDataSource {
  Future<void> cacheProfile(UserProfileModel profile);
  Future<UserProfileModel?> getCachedProfile(String userId);

  Future<void> cacheStats(String userId, UserStatsModel stats);
  Future<UserStatsModel?> getCachedStats(String userId);

  Future<void> clearCache();
}

class ProfileLocalDataSourceImpl implements ProfileLocalDataSource {
  final SharedPreferences sharedPreferences;

  static const String _profilePrefix = 'CACHED_PROFILE_';
  static const String _statsPrefix = 'CACHED_STATS_';

  ProfileLocalDataSourceImpl({required this.sharedPreferences});

  @override
  Future<void> cacheProfile(UserProfileModel profile) async {
    final key = '$_profilePrefix${profile.id}';
    final jsonString = jsonEncode(profile.toJson());
    await sharedPreferences.setString(key, jsonString);
  }

  @override
  Future<UserProfileModel?> getCachedProfile(String userId) async {
    final key = '$_profilePrefix$userId';
    final jsonString = sharedPreferences.getString(key);

    if (jsonString == null) return null;

    try {
      final json = jsonDecode(jsonString) as Map<String, dynamic>;
      return UserProfileModel.fromJson(json);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<void> cacheStats(String userId, UserStatsModel stats) async {
    final key = '$_statsPrefix$userId';
    final jsonString = jsonEncode(stats.toJson());
    await sharedPreferences.setString(key, jsonString);
  }

  @override
  Future<UserStatsModel?> getCachedStats(String userId) async {
    final key = '$_statsPrefix$userId';
    final jsonString = sharedPreferences.getString(key);

    if (jsonString == null) return null;

    try {
      final json = jsonDecode(jsonString) as Map<String, dynamic>;
      return UserStatsModel.fromJson(json);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<void> clearCache() async {
    final keys = sharedPreferences.getKeys();
    for (final key in keys) {
      if (key.startsWith(_profilePrefix) || key.startsWith(_statsPrefix)) {
        await sharedPreferences.remove(key);
      }
    }
  }
}
```

---

## Task 5: Implement Repository

### Prompt cho AI Agent:

```
Implement ProfileRepository trong lib/features/profile/data/repositories/:

File: profile_repository_impl.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../movie/domain/entities/movie_entity.dart';
import '../../domain/entities/preference.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/entities/user_stats.dart';
import '../../domain/entities/watch_history_item.dart';
import '../../domain/repositories/profile_repository.dart';
import '../datasources/profile_local_datasource.dart';
import '../datasources/profile_remote_datasource.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource remoteDataSource;
  final ProfileLocalDataSource localDataSource;

  ProfileRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<Either<Failure, UserProfile>> getUserProfile(String userId) async {
    try {
      // Try cache first
      final cachedProfile = await localDataSource.getCachedProfile(userId);
      if (cachedProfile != null) {
        return Right(cachedProfile.toEntity());
      }

      // Fetch from remote
      final profile = await remoteDataSource.getUserProfile(userId);

      // Cache result
      await localDataSource.cacheProfile(profile);

      return Right(profile.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserProfile>> updateUserProfile({
    required String userId,
    required String fullName,
    String? avatarUrl,
    String? bannerUrl,
  }) async {
    try {
      final updatedProfile = await remoteDataSource.updateUserProfile(
        userId: userId,
        fullName: fullName,
        avatarUrl: avatarUrl,
        bannerUrl: bannerUrl,
      );

      // Update cache
      await localDataSource.cacheProfile(updatedProfile);

      return Right(updatedProfile.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserStats>> getUserStats(String userId) async {
    try {
      // Try cache first
      final cachedStats = await localDataSource.getCachedStats(userId);
      if (cachedStats != null) {
        return Right(cachedStats.toEntity());
      }

      // Fetch from remote
      final stats = await remoteDataSource.getUserStats(userId);

      // Cache result
      await localDataSource.cacheStats(userId, stats);

      return Right(stats.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<Preference>>> getFavoriteGenres(
    String userId,
  ) async {
    try {
      final genres = await remoteDataSource.getFavoriteGenres(userId);
      return Right(genres.map((model) => model.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<Preference>>> getFavoriteCountries(
    String userId,
  ) async {
    try {
      final countries = await remoteDataSource.getFavoriteCountries(userId);
      return Right(countries.map((model) => model.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<MovieEntity>>> getSavedMovies(
    String userId,
  ) async {
    try {
      final movies = await remoteDataSource.getSavedMovies(userId);
      return Right(movies.map((model) => model.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<WatchHistoryItem>>> getWatchHistory(
    String userId, {
    int limit = 10,
  }) async {
    try {
      final history = await remoteDataSource.getWatchHistory(userId, limit);
      return Right(history.map((model) => model.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure(e.toString()));
    }
  }
}
```

---

## Task 6: Create Use Cases

### Prompt cho AI Agent:

```
Tạo use cases trong lib/features/profile/domain/usecases/:

1. File: get_user_profile.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_profile.dart';
import '../repositories/profile_repository.dart';

class GetUserProfile implements UseCase<UserProfile, String> {
  final ProfileRepository repository;

  GetUserProfile(this.repository);

  @override
  Future<Either<Failure, UserProfile>> call(String userId) async {
    return await repository.getUserProfile(userId);
  }
}

2. File: update_user_profile.dart
---
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_profile.dart';
import '../repositories/profile_repository.dart';

class UpdateUserProfile implements UseCase<UserProfile, UpdateProfileParams> {
  final ProfileRepository repository;

  UpdateUserProfile(this.repository);

  @override
  Future<Either<Failure, UserProfile>> call(UpdateProfileParams params) async {
    return await repository.updateUserProfile(
      userId: params.userId,
      fullName: params.fullName,
      avatarUrl: params.avatarUrl,
      bannerUrl: params.bannerUrl,
    );
  }
}

class UpdateProfileParams extends Equatable {
  final String userId;
  final String fullName;
  final String? avatarUrl;
  final String? bannerUrl;

  const UpdateProfileParams({
    required this.userId,
    required this.fullName,
    this.avatarUrl,
    this.bannerUrl,
  });

  @override
  List<Object?> get props => [userId, fullName, avatarUrl, bannerUrl];
}

3. File: get_user_stats.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_stats.dart';
import '../repositories/profile_repository.dart';

class GetUserStats implements UseCase<UserStats, String> {
  final ProfileRepository repository;

  GetUserStats(this.repository);

  @override
  Future<Either<Failure, UserStats>> call(String userId) async {
    return await repository.getUserStats(userId);
  }
}

4-7. Similar use cases for:
- get_favorite_genres.dart
- get_favorite_countries.dart
- get_saved_movies.dart
- get_watch_history.dart

(Follow same pattern as above)
```

---

## Task 7: Register in Dependency Injection

### Prompt cho AI Agent:

```
Add to lib/injection_container.dart:

// Profile Feature
  // Data sources
  sl.registerLazySingleton<ProfileRemoteDataSource>(
    () => ProfileRemoteDataSourceImpl(supabase: sl()),
  );
  sl.registerLazySingleton<ProfileLocalDataSource>(
    () => ProfileLocalDataSourceImpl(sharedPreferences: sl()),
  );

  // Repository
  sl.registerLazySingleton<ProfileRepository>(
    () => ProfileRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => GetUserProfile(sl()));
  sl.registerLazySingleton(() => UpdateUserProfile(sl()));
  sl.registerLazySingleton(() => GetUserStats(sl()));
  sl.registerLazySingleton(() => GetFavoriteGenres(sl()));
  sl.registerLazySingleton(() => GetFavoriteCountries(sl()));
  sl.registerLazySingleton(() => GetSavedMovies(sl()));
  sl.registerLazySingleton(() => GetWatchHistory(sl()));
```

---

## ✅ Checklist Task Data Layer

- [ ] UserProfile entity created
- [ ] UserStats entity created
- [ ] Preference entity created
- [ ] WatchHistoryItem entity created
- [ ] All models with fromJson/toJson
- [ ] ProfileRepository interface defined
- [ ] ProfileRemoteDataSource implemented
- [ ] ProfileLocalDataSource implemented (cache)
- [ ] ProfileRepositoryImpl với Either pattern
- [ ] All 7 use cases created
- [ ] Registered in DI container
- [ ] Unit tests written

---

**Tiếp theo:** [02-profile-bloc.md](./02-profile-bloc.md) - ProfileBloc implementation với events & states
