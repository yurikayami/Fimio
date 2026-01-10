# 📊 Phase 2: Data & Domain Layer

## Mục Tiêu

- Tạo Dart Models từ Supabase Schema và API Response
- Định nghĩa Entities (Domain Layer)
- Tạo Repository Interfaces (Abstract Classes)
- Implement Repository với Data Sources
- Viết Unit Tests cơ bản

---

## Task 2.1: Tạo Domain Entities

### Prompt cho AI Agent:

```
Tạo các Entity classes trong lib/features/movie/domain/entities/:
Entities là các class thuần Dart, không có dependency nào, đại diện cho business objects.

1. File: movie_entity.dart
---
import 'package:equatable/equatable.dart';

class MovieEntity extends Equatable {
  final int? id;
  final String slug;
  final String name;
  final String? originName;
  final String? posterUrl;
  final String? thumbUrl;
  final int? year;
  final String? time;
  final String? episodeCurrent;
  final String? episodeTotal;
  final String? quality;
  final String? lang;
  final String? type;
  final String? status;
  final String? content;
  final String? trailerUrl;
  final int? view;
  final List<CategoryEntity>? categories;
  final List<CountryEntity>? countries;
  final List<EpisodeServerEntity>? episodes;
  final TmdbInfoEntity? tmdb;
  final DateTime? updatedAt;

  const MovieEntity({
    this.id,
    required this.slug,
    required this.name,
    this.originName,
    this.posterUrl,
    this.thumbUrl,
    this.year,
    this.time,
    this.episodeCurrent,
    this.episodeTotal,
    this.quality,
    this.lang,
    this.type,
    this.status,
    this.content,
    this.trailerUrl,
    this.view,
    this.categories,
    this.countries,
    this.episodes,
    this.tmdb,
    this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        slug,
        name,
        originName,
        posterUrl,
        thumbUrl,
        year,
        type,
      ];

  /// Check if movie is a series (phim bộ)
  bool get isSeries => type == 'series' || (episodeTotal != null && episodeTotal != '1');

  /// Get display quality badge
  String get qualityBadge => quality ?? 'HD';

  /// Get formatted episode info
  String get episodeInfo {
    if (episodeCurrent == null) return '';
    if (episodeTotal != null) {
      return '$episodeCurrent/$episodeTotal';
    }
    return episodeCurrent!;
  }
}

2. File: category_entity.dart
---
import 'package:equatable/equatable.dart';

class CategoryEntity extends Equatable {
  final int? id;
  final String name;
  final String slug;

  const CategoryEntity({
    this.id,
    required this.name,
    required this.slug,
  });

  @override
  List<Object?> get props => [id, name, slug];
}

3. File: country_entity.dart
---
import 'package:equatable/equatable.dart';

class CountryEntity extends Equatable {
  final int? id;
  final String name;
  final String slug;

  const CountryEntity({
    this.id,
    required this.name,
    required this.slug,
  });

  @override
  List<Object?> get props => [id, name, slug];
}

4. File: episode_entity.dart
---
import 'package:equatable/equatable.dart';

/// Represents a single episode
class EpisodeEntity extends Equatable {
  final int? id;
  final String name;
  final String slug;
  final String? filename;
  final String? linkEmbed;
  final String? linkM3u8;

  const EpisodeEntity({
    this.id,
    required this.name,
    required this.slug,
    this.filename,
    this.linkEmbed,
    this.linkM3u8,
  });

  @override
  List<Object?> get props => [id, name, slug, linkEmbed, linkM3u8];

  /// Get playable URL (prefer m3u8 over embed)
  String? get playableUrl => linkM3u8 ?? linkEmbed;

  /// Check if episode has valid playback URL
  bool get isPlayable => linkM3u8 != null || linkEmbed != null;
}

/// Represents a server containing multiple episodes
class EpisodeServerEntity extends Equatable {
  final String serverName;
  final List<EpisodeEntity> episodes;

  const EpisodeServerEntity({
    required this.serverName,
    required this.episodes,
  });

  @override
  List<Object?> get props => [serverName, episodes];
}

5. File: tmdb_info_entity.dart
---
import 'package:equatable/equatable.dart';

class TmdbInfoEntity extends Equatable {
  final String? tmdbId;
  final String? type;
  final int? season;
  final double? voteAverage;
  final int? voteCount;

  const TmdbInfoEntity({
    this.tmdbId,
    this.type,
    this.season,
    this.voteAverage,
    this.voteCount,
  });

  @override
  List<Object?> get props => [tmdbId, type, season, voteAverage, voteCount];

  /// Formatted rating string
  String get ratingText => voteAverage?.toStringAsFixed(1) ?? 'N/A';
}

6. File: pagination_entity.dart
---
import 'package:equatable/equatable.dart';

class PaginationEntity extends Equatable {
  final int currentPage;
  final int totalPages;
  final int totalItems;
  final int itemsPerPage;

  const PaginationEntity({
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
    required this.itemsPerPage,
  });

  @override
  List<Object?> get props => [currentPage, totalPages, totalItems, itemsPerPage];

  bool get hasNextPage => currentPage < totalPages;
  bool get hasPrevPage => currentPage > 1;
}

7. File: movie_list_entity.dart
---
import 'package:equatable/equatable.dart';
import 'movie_entity.dart';
import 'pagination_entity.dart';

class MovieListEntity extends Equatable {
  final List<MovieEntity> movies;
  final PaginationEntity? pagination;

  const MovieListEntity({
    required this.movies,
    this.pagination,
  });

  @override
  List<Object?> get props => [movies, pagination];

  bool get isEmpty => movies.isEmpty;
  bool get isNotEmpty => movies.isNotEmpty;
  int get length => movies.length;
}
```

---

## Task 2.2: Tạo Auth Entities

### Prompt cho AI Agent:

```
Tạo các Entity cho Auth trong lib/features/auth/domain/entities/:

1. File: user_entity.dart
---
import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String? email;
  final String? fullName;
  final String? avatarUrl;
  final String? bannerUrl;
  final bool isVip;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const UserEntity({
    required this.id,
    this.email,
    this.fullName,
    this.avatarUrl,
    this.bannerUrl,
    this.isVip = false,
    this.createdAt,
    this.updatedAt,
  });

  @override
  List<Object?> get props => [id, email, fullName, avatarUrl, isVip];

  /// Get display name (fallback to email if no name)
  String get displayName => fullName ?? email?.split('@').first ?? 'User';

  /// Get initials for avatar placeholder
  String get initials {
    if (fullName != null && fullName!.isNotEmpty) {
      final parts = fullName!.trim().split(' ');
      if (parts.length >= 2) {
        return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
      }
      return fullName![0].toUpperCase();
    }
    return email?[0].toUpperCase() ?? 'U';
  }

  /// Check if user has custom avatar
  bool get hasAvatar => avatarUrl != null && avatarUrl!.isNotEmpty;
}

2. File: auth_state_entity.dart
---
import 'package:equatable/equatable.dart';
import 'user_entity.dart';

enum AuthStatus {
  initial,
  authenticated,
  unauthenticated,
}

class AuthStateEntity extends Equatable {
  final AuthStatus status;
  final UserEntity? user;

  const AuthStateEntity({
    this.status = AuthStatus.initial,
    this.user,
  });

  const AuthStateEntity.initial() : this(status: AuthStatus.initial);

  const AuthStateEntity.authenticated(UserEntity user)
      : this(status: AuthStatus.authenticated, user: user);

  const AuthStateEntity.unauthenticated()
      : this(status: AuthStatus.unauthenticated);

  @override
  List<Object?> get props => [status, user];

  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isUnauthenticated => status == AuthStatus.unauthenticated;
}
```

---

## Task 2.3: Tạo Library & History Entities

### Prompt cho AI Agent:

```
Tạo Entities cho Library và History:

1. File: lib/features/library/domain/entities/library_item_entity.dart
---
import 'package:equatable/equatable.dart';
import '../../../movie/domain/entities/movie_entity.dart';

class LibraryItemEntity extends Equatable {
  final int id;
  final String odId;
  final MovieEntity movie;
  final DateTime createdAt;

  const LibraryItemEntity({
    required this.id,
    required this.userId,
    required this.movie,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, odId, movie, createdAt];
}

2. File: lib/features/history/domain/entities/watch_history_entity.dart
---
import 'package:equatable/equatable.dart';
import '../../../movie/domain/entities/movie_entity.dart';

class WatchHistoryEntity extends Equatable {
  final int id;
  final String odId;
  final MovieEntity movie;
  final String? episodeName;
  final int lastPosition; // in seconds
  final DateTime watchedAt;

  const WatchHistoryEntity({
    required this.id,
    required this.userId,
    required this.movie,
    this.episodeName,
    this.lastPosition = 0,
    required this.watchedAt,
  });

  @override
  List<Object?> get props => [id, odId, movie, episodeName, watchedAt];

  /// Get relative time string (e.g., "2 giờ trước")
  String get relativeTime {
    final now = DateTime.now();
    final diff = now.difference(watchedAt);

    if (diff.inMinutes < 60) {
      return '${diff.inMinutes} phút trước';
    } else if (diff.inHours < 24) {
      return '${diff.inHours} giờ trước';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} ngày trước';
    } else {
      return '${watchedAt.day}/${watchedAt.month}/${watchedAt.year}';
    }
  }

  /// Get formatted position (e.g., "15:30")
  String get formattedPosition {
    final minutes = lastPosition ~/ 60;
    final seconds = lastPosition % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}
```

---

## Task 2.4: Tạo Data Models (với fromJson/toJson)

### Prompt cho AI Agent:

```
Tạo các Data Models trong lib/features/movie/data/models/:
Models extend từ Entities và thêm serialization logic.

1. File: movie_model.dart
---
import '../../domain/entities/movie_entity.dart';
import 'category_model.dart';
import 'country_model.dart';
import 'episode_model.dart';
import 'tmdb_info_model.dart';

class MovieModel extends MovieEntity {
  const MovieModel({
    super.id,
    required super.slug,
    required super.name,
    super.originName,
    super.posterUrl,
    super.thumbUrl,
    super.year,
    super.time,
    super.episodeCurrent,
    super.episodeTotal,
    super.quality,
    super.lang,
    super.type,
    super.status,
    super.content,
    super.trailerUrl,
    super.view,
    super.categories,
    super.countries,
    super.episodes,
    super.tmdb,
    super.updatedAt,
  });

  /// Parse from PhimAPI response (list item - simplified)
  factory MovieModel.fromApiListItem(Map<String, dynamic> json) {
    return MovieModel(
      slug: json['slug'] ?? '',
      name: json['name'] ?? '',
      originName: json['origin_name'],
      posterUrl: json['poster_url'],
      thumbUrl: json['thumb_url'],
      year: json['year'],
      time: json['time'],
      episodeCurrent: json['episode_current'],
      episodeTotal: json['episode_total'],
      quality: json['quality'] ?? 'HD',
      lang: json['lang'],
      type: json['type'],
    );
  }

  /// Parse from PhimAPI detail response (full data)
  factory MovieModel.fromApiDetail(Map<String, dynamic> json, {List<dynamic>? episodesJson}) {
    // Parse categories
    List<CategoryModel>? categories;
    if (json['category'] != null) {
      categories = (json['category'] as List)
          .map((e) => CategoryModel.fromJson(e))
          .toList();
    }

    // Parse countries
    List<CountryModel>? countries;
    if (json['country'] != null) {
      countries = (json['country'] as List)
          .map((e) => CountryModel.fromJson(e))
          .toList();
    }

    // Parse episodes
    List<EpisodeServerModel>? episodes;
    if (episodesJson != null) {
      episodes = episodesJson
          .map((e) => EpisodeServerModel.fromJson(e))
          .toList();
    }

    // Parse TMDB info
    TmdbInfoModel? tmdb;
    if (json['tmdb'] != null) {
      tmdb = TmdbInfoModel.fromJson(json['tmdb']);
    }

    return MovieModel(
      id: json['_id'] is int ? json['_id'] : null,
      slug: json['slug'] ?? '',
      name: json['name'] ?? '',
      originName: json['origin_name'],
      posterUrl: json['poster_url'],
      thumbUrl: json['thumb_url'],
      year: json['year'],
      time: json['time'],
      episodeCurrent: json['episode_current'],
      episodeTotal: json['episode_total'],
      quality: json['quality'] ?? 'HD',
      lang: json['lang'],
      type: json['type'],
      status: json['status'],
      content: json['content'],
      trailerUrl: json['trailer_url'],
      view: json['view'],
      categories: categories,
      countries: countries,
      episodes: episodes,
      tmdb: tmdb,
    );
  }

  /// Parse from Supabase (database format)
  factory MovieModel.fromSupabase(Map<String, dynamic> json) {
    return MovieModel(
      id: json['id'],
      slug: json['slug'] ?? '',
      name: json['name'] ?? '',
      originName: json['origin_name'],
      posterUrl: json['poster_url'],
      thumbUrl: json['thumb_url'],
      year: json['year'],
      time: json['time'],
      episodeCurrent: json['episode_current'],
      episodeTotal: json['episode_total'],
      quality: json['quality'],
      lang: json['lang'],
      type: json['type'],
      status: json['status'],
      content: json['content'],
      trailerUrl: json['trailer_url'],
      view: json['view'],
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
    );
  }

  /// Convert to JSON for Supabase sync
  Map<String, dynamic> toJson() {
    return {
      'slug': slug,
      'name': name,
      'origin_name': originName,
      'poster_url': posterUrl,
      'thumb_url': thumbUrl,
      'year': year,
      'time': time,
      'episode_current': episodeCurrent,
      'episode_total': episodeTotal,
      'quality': quality,
      'lang': lang,
      'type': type,
      'status': status,
      'content': content,
      'trailer_url': trailerUrl,
      'view': view,
    };
  }

  /// Convert to format expected by sync_movie_data RPC
  Map<String, dynamic> toSyncFormat() {
    return {
      'movie': {
        'slug': slug,
        'name': name,
        'origin_name': originName,
        'poster_url': posterUrl,
        'thumb_url': thumbUrl,
        'year': year,
        'time': time,
        'episode_current': episodeCurrent,
        'episode_total': episodeTotal,
        'quality': quality,
        'lang': lang,
        'type': type,
        'status': status,
        'content': content,
        'trailer_url': trailerUrl,
        'view': view,
        'category': categories?.map((c) => {'name': c.name, 'slug': c.slug}).toList(),
        'country': countries?.map((c) => {'name': c.name, 'slug': c.slug}).toList(),
        'tmdb': tmdb != null ? {
          'id': tmdb!.tmdbId,
          'type': tmdb!.type,
          'season': tmdb!.season,
          'vote_average': tmdb!.voteAverage,
          'vote_count': tmdb!.voteCount,
        } : null,
      },
      'episodes': episodes?.map((server) => {
        return {
          'server_name': server.serverName,
          'server_data': server.episodes.map((ep) => {
            return {
              'name': ep.name,
              'slug': ep.slug,
              'filename': ep.filename,
              'link_embed': ep.linkEmbed,
              'link_m3u8': ep.linkM3u8,
            };
          }).toList(),
        };
      }).toList(),
    };
  }
}

2. File: category_model.dart
---
import '../../domain/entities/category_entity.dart';

class CategoryModel extends CategoryEntity {
  const CategoryModel({
    super.id,
    required super.name,
    required super.slug,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'],
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
    };
  }
}

3. File: country_model.dart
---
import '../../domain/entities/country_entity.dart';

class CountryModel extends CountryEntity {
  const CountryModel({
    super.id,
    required super.name,
    required super.slug,
  });

  factory CountryModel.fromJson(Map<String, dynamic> json) {
    return CountryModel(
      id: json['id'],
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
    };
  }
}

4. File: episode_model.dart
---
import '../../domain/entities/episode_entity.dart';

class EpisodeModel extends EpisodeEntity {
  const EpisodeModel({
    super.id,
    required super.name,
    required super.slug,
    super.filename,
    super.linkEmbed,
    super.linkM3u8,
  });

  factory EpisodeModel.fromJson(Map<String, dynamic> json) {
    return EpisodeModel(
      id: json['id'],
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      filename: json['filename'],
      linkEmbed: json['link_embed'],
      linkM3u8: json['link_m3u8'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'slug': slug,
      'filename': filename,
      'link_embed': linkEmbed,
      'link_m3u8': linkM3u8,
    };
  }
}

class EpisodeServerModel extends EpisodeServerEntity {
  const EpisodeServerModel({
    required super.serverName,
    required super.episodes,
  });

  factory EpisodeServerModel.fromJson(Map<String, dynamic> json) {
    final serverData = json['server_data'] as List? ?? [];
    return EpisodeServerModel(
      serverName: json['server_name'] ?? 'Server',
      episodes: serverData.map((e) => EpisodeModel.fromJson(e)).toList(),
    );
  }
}

5. File: tmdb_info_model.dart
---
import '../../domain/entities/tmdb_info_entity.dart';

class TmdbInfoModel extends TmdbInfoEntity {
  const TmdbInfoModel({
    super.tmdbId,
    super.type,
    super.season,
    super.voteAverage,
    super.voteCount,
  });

  factory TmdbInfoModel.fromJson(Map<String, dynamic> json) {
    return TmdbInfoModel(
      tmdbId: json['id']?.toString(),
      type: json['type'],
      season: json['season'],
      voteAverage: (json['vote_average'] as num?)?.toDouble(),
      voteCount: json['vote_count'],
    );
  }
}

6. File: pagination_model.dart
---
import '../../domain/entities/pagination_entity.dart';

class PaginationModel extends PaginationEntity {
  const PaginationModel({
    required super.currentPage,
    required super.totalPages,
    required super.totalItems,
    required super.itemsPerPage,
  });

  factory PaginationModel.fromJson(Map<String, dynamic> json) {
    return PaginationModel(
      currentPage: json['currentPage'] ?? 1,
      totalPages: json['totalPages'] ?? 1,
      totalItems: json['totalItems'] ?? 0,
      itemsPerPage: json['totalItemsPerPage'] ?? 24,
    );
  }
}

7. File: api_response_model.dart
---
import 'movie_model.dart';
import 'pagination_model.dart';

/// Generic API response wrapper
class ApiResponseModel<T> {
  final bool status;
  final String? message;
  final T? data;

  const ApiResponseModel({
    required this.status,
    this.message,
    this.data,
  });
}

/// Movie list API response
class MovieListResponseModel {
  final bool status;
  final String? message;
  final List<MovieModel> items;
  final PaginationModel? pagination;

  const MovieListResponseModel({
    required this.status,
    this.message,
    required this.items,
    this.pagination,
  });

  factory MovieListResponseModel.fromJson(Map<String, dynamic> json) {
    // Handle different API response structures
    final itemsRaw = json['items'] ?? json['data']?['items'] ?? [];
    final paginationRaw = json['pagination'] ??
                          json['data']?['pagination'] ??
                          json['data']?['params']?['pagination'];

    return MovieListResponseModel(
      status: json['status'] == true || json['status'] == 'success',
      message: json['msg'] ?? json['message'],
      items: (itemsRaw as List).map((e) => MovieModel.fromApiListItem(e)).toList(),
      pagination: paginationRaw != null ? PaginationModel.fromJson(paginationRaw) : null,
    );
  }
}

/// Movie detail API response
class MovieDetailResponseModel {
  final bool status;
  final String? message;
  final MovieModel? movie;

  const MovieDetailResponseModel({
    required this.status,
    this.message,
    this.movie,
  });

  factory MovieDetailResponseModel.fromJson(Map<String, dynamic> json) {
    final movieRaw = json['movie'] ?? json['data']?['movie'];
    final episodesRaw = json['episodes'] ?? json['data']?['episodes'];

    return MovieDetailResponseModel(
      status: json['status'] == true || json['status'] == 'success',
      message: json['msg'] ?? json['message'],
      movie: movieRaw != null
          ? MovieModel.fromApiDetail(movieRaw, episodesJson: episodesRaw)
          : null,
    );
  }
}
```

---

## Task 2.5: Tạo Auth Models

### Prompt cho AI Agent:

```
Tạo Auth Models trong lib/features/auth/data/models/:

1. File: user_model.dart
---
import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    super.email,
    super.fullName,
    super.avatarUrl,
    super.bannerUrl,
    super.isVip,
    super.createdAt,
    super.updatedAt,
  });

  /// Parse from Supabase auth.users
  factory UserModel.fromSupabaseAuth(Map<String, dynamic> json) {
    final metadata = json['user_metadata'] ?? {};
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'],
      fullName: metadata['full_name'],
      avatarUrl: metadata['avatar_url'],
    );
  }

  /// Parse from Supabase profiles table
  factory UserModel.fromSupabaseProfile(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'],
      fullName: json['full_name'],
      avatarUrl: json['avatar_url'],
      bannerUrl: json['banner_url'],
      isVip: json['is_vip'] ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'banner_url': bannerUrl,
      'is_vip': isVip,
    };
  }

  /// Create a copy with updated fields
  UserModel copyWith({
    String? id,
    String? email,
    String? fullName,
    String? avatarUrl,
    String? bannerUrl,
    bool? isVip,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bannerUrl: bannerUrl ?? this.bannerUrl,
      isVip: isVip ?? this.isVip,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }
}
```

---

## Task 2.6: Tạo Repository Interfaces (Domain Layer)

### Prompt cho AI Agent:

```
Tạo Repository Interfaces (abstract classes) trong Domain layer:

1. File: lib/features/movie/domain/repositories/movie_repository.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/movie_entity.dart';
import '../entities/movie_list_entity.dart';
import '../entities/category_entity.dart';
import '../entities/country_entity.dart';

abstract class MovieRepository {
  /// Get latest movies with pagination
  Future<Either<Failure, MovieListEntity>> getLatestMovies({int page = 1});

  /// Search movies by keyword
  Future<Either<Failure, MovieListEntity>> searchMovies({
    required String keyword,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  });

  /// Get movie details by slug
  Future<Either<Failure, MovieEntity>> getMovieDetails(String slug);

  /// Get movies by type (phim-le, phim-bo, hoat-hinh, tv-shows)
  Future<Either<Failure, MovieListEntity>> getMoviesByType({
    required String typeList,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  });

  /// Get all categories
  Future<Either<Failure, List<CategoryEntity>>> getCategories();

  /// Get all countries
  Future<Either<Failure, List<CountryEntity>>> getCountries();

  /// Sync movie data to Supabase (for saving to library/history)
  Future<Either<Failure, int>> syncMovieToDatabase(MovieEntity movie);
}

2. File: lib/features/auth/domain/repositories/auth_repository.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user_entity.dart';

abstract class AuthRepository {
  /// Get current authenticated user
  Future<Either<Failure, UserEntity?>> getCurrentUser();

  /// Stream of auth state changes
  Stream<UserEntity?> get authStateChanges;

  /// Sign in with Google OAuth
  Future<Either<Failure, UserEntity>> signInWithGoogle();

  /// Sign in with email and password
  Future<Either<Failure, UserEntity>> signInWithEmail({
    required String email,
    required String password,
  });

  /// Sign up with email, password, and name
  Future<Either<Failure, UserEntity>> signUpWithEmail({
    required String email,
    required String password,
    required String fullName,
  });

  /// Sign out
  Future<Either<Failure, void>> signOut();

  /// Get user profile from database
  Future<Either<Failure, UserEntity>> getUserProfile(String userId);

  /// Update user profile
  Future<Either<Failure, UserEntity>> updateUserProfile({
    required String odId,
    String? fullName,
    String? avatarUrl,
    String? bannerUrl,
  });
}

3. File: lib/features/library/domain/repositories/library_repository.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../movie/domain/entities/movie_entity.dart';
import '../entities/library_item_entity.dart';

abstract class LibraryRepository {
  /// Get all saved movies for user
  Future<Either<Failure, List<LibraryItemEntity>>> getSavedMovies(String userId);

  /// Add movie to library
  Future<Either<Failure, void>> addToLibrary({
    required String userId,
    required MovieEntity movie,
  });

  /// Remove movie from library
  Future<Either<Failure, void>> removeFromLibrary({
    required String userId,
    required String movieSlug,
  });

  /// Check if movie is saved
  Future<Either<Failure, bool>> isMovieSaved({
    required String userId,
    required String movieSlug,
  });
}

4. File: lib/features/history/domain/repositories/watch_history_repository.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../movie/domain/entities/movie_entity.dart';
import '../entities/watch_history_entity.dart';

abstract class WatchHistoryRepository {
  /// Get watch history for user
  Future<Either<Failure, List<WatchHistoryEntity>>> getWatchHistory(String userId);

  /// Add or update watch history entry
  Future<Either<Failure, void>> addToHistory({
    required String userId,
    required MovieEntity movie,
    String? episodeName,
    int? lastPosition,
  });

  /// Remove from watch history
  Future<Either<Failure, void>> removeFromHistory({
    required String userId,
    required int historyId,
  });

  /// Clear all watch history
  Future<Either<Failure, void>> clearHistory(String userId);
}
```

---

## Task 2.7: Tạo Data Sources

### Prompt cho AI Agent:

```
Tạo Data Sources trong lib/features/movie/data/datasources/:

1. File: movie_remote_datasource.dart
---
import '../../../../core/network/api_client.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../models/movie_model.dart';
import '../models/category_model.dart';
import '../models/country_model.dart';
import '../models/api_response_model.dart';

abstract class MovieRemoteDataSource {
  Future<MovieListResponseModel> getLatestMovies({int page = 1});
  Future<MovieListResponseModel> searchMovies({
    required String keyword,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  });
  Future<MovieDetailResponseModel> getMovieDetails(String slug);
  Future<MovieListResponseModel> getMoviesByType({
    required String typeList,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  });
  Future<List<CategoryModel>> getCategories();
  Future<List<CountryModel>> getCountries();
}

class MovieRemoteDataSourceImpl implements MovieRemoteDataSource {
  final ApiClient apiClient;

  MovieRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<MovieListResponseModel> getLatestMovies({int page = 1}) async {
    try {
      final response = await apiClient.get(
        '${ApiConstants.latestMovies}',
        queryParameters: {'page': page},
      );
      return MovieListResponseModel.fromJson(response.data);
    } catch (e) {
      throw ServerException('Failed to fetch latest movies: $e');
    }
  }

  @override
  Future<MovieListResponseModel> searchMovies({
    required String keyword,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'keyword': keyword,
        'page': page,
        'limit': limit,
      };

      if (category != null && category.isNotEmpty) queryParams['category'] = category;
      if (country != null && country.isNotEmpty) queryParams['country'] = country;
      if (year != null && year.isNotEmpty) queryParams['year'] = year;
      if (sortField != null) queryParams['sort_field'] = sortField;
      if (sortType != null) queryParams['sort_type'] = sortType;

      final response = await apiClient.get(
        ApiConstants.search,
        queryParameters: queryParams,
      );
      return MovieListResponseModel.fromJson(response.data);
    } catch (e) {
      throw ServerException('Failed to search movies: $e');
    }
  }

  @override
  Future<MovieDetailResponseModel> getMovieDetails(String slug) async {
    try {
      final response = await apiClient.get('${ApiConstants.movieDetail}/$slug');
      return MovieDetailResponseModel.fromJson(response.data);
    } catch (e) {
      throw ServerException('Failed to fetch movie details: $e');
    }
  }

  @override
  Future<MovieListResponseModel> getMoviesByType({
    required String typeList,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  }) async {
    try {
      // Special handling for 'phim-moi-cap-nhat'
      if (typeList == 'phim-moi-cap-nhat') {
        return getLatestMovies(page: page);
      }

      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (category != null && category.isNotEmpty) queryParams['category'] = category;
      if (country != null && country.isNotEmpty) queryParams['country'] = country;
      if (year != null && year.isNotEmpty) queryParams['year'] = year;
      if (sortField != null) queryParams['sort_field'] = sortField;
      if (sortType != null) queryParams['sort_type'] = sortType;

      final response = await apiClient.get(
        '${ApiConstants.moviesByType}/$typeList',
        queryParameters: queryParams,
      );
      return MovieListResponseModel.fromJson(response.data);
    } catch (e) {
      throw ServerException('Failed to fetch movies by type: $e');
    }
  }

  @override
  Future<List<CategoryModel>> getCategories() async {
    try {
      final response = await apiClient.get(ApiConstants.categories);
      final items = response.data['items'] ?? response.data ?? [];
      return (items as List).map((e) => CategoryModel.fromJson(e)).toList();
    } catch (e) {
      throw ServerException('Failed to fetch categories: $e');
    }
  }

  @override
  Future<List<CountryModel>> getCountries() async {
    try {
      final response = await apiClient.get(ApiConstants.countries);
      final items = response.data['items'] ?? response.data ?? [];
      return (items as List).map((e) => CountryModel.fromJson(e)).toList();
    } catch (e) {
      throw ServerException('Failed to fetch countries: $e');
    }
  }
}

2. File: movie_supabase_datasource.dart
---
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/error/exceptions.dart';
import '../models/movie_model.dart';

abstract class MovieSupabaseDataSource {
  Future<int> syncMovieData(Map<String, dynamic> movieData);
  Future<MovieModel?> getMovieBySlug(String slug);
  Future<int?> getMovieIdBySlug(String slug);
}

class MovieSupabaseDataSourceImpl implements MovieSupabaseDataSource {
  final SupabaseClient supabaseClient;

  MovieSupabaseDataSourceImpl({required this.supabaseClient});

  @override
  Future<int> syncMovieData(Map<String, dynamic> movieData) async {
    try {
      final response = await supabaseClient
          .rpc('sync_movie_data', params: {'p_movie_data': movieData});
      return response as int;
    } on PostgrestException catch (e) {
      throw ServerException('Failed to sync movie: ${e.message}');
    }
  }

  @override
  Future<MovieModel?> getMovieBySlug(String slug) async {
    try {
      final response = await supabaseClient
          .from('movies')
          .select()
          .eq('slug', slug)
          .maybeSingle();

      if (response == null) return null;
      return MovieModel.fromSupabase(response);
    } on PostgrestException catch (e) {
      throw ServerException('Failed to get movie: ${e.message}');
    }
  }

  @override
  Future<int?> getMovieIdBySlug(String slug) async {
    try {
      final response = await supabaseClient
          .from('movies')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

      return response?['id'] as int?;
    } on PostgrestException catch (e) {
      throw ServerException('Failed to get movie ID: ${e.message}');
    }
  }
}
```

---

## Task 2.8: Implement Repositories

### Prompt cho AI Agent:

```
Tạo Repository Implementations trong lib/features/movie/data/repositories/:

1. File: movie_repository_impl.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/movie_entity.dart';
import '../../domain/entities/movie_list_entity.dart';
import '../../domain/entities/category_entity.dart';
import '../../domain/entities/country_entity.dart';
import '../../domain/repositories/movie_repository.dart';
import '../datasources/movie_remote_datasource.dart';
import '../datasources/movie_supabase_datasource.dart';
import '../models/movie_model.dart';

class MovieRepositoryImpl implements MovieRepository {
  final MovieRemoteDataSource remoteDataSource;
  final MovieSupabaseDataSource supabaseDataSource;
  final NetworkInfo networkInfo;

  MovieRepositoryImpl({
    required this.remoteDataSource,
    required this.supabaseDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, MovieListEntity>> getLatestMovies({int page = 1}) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }

    try {
      final response = await remoteDataSource.getLatestMovies(page: page);
      return Right(MovieListEntity(
        movies: response.items,
        pagination: response.pagination,
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, MovieListEntity>> searchMovies({
    required String keyword,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  }) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }

    try {
      final response = await remoteDataSource.searchMovies(
        keyword: keyword,
        page: page,
        limit: limit,
        category: category,
        country: country,
        year: year,
        sortField: sortField,
        sortType: sortType,
      );
      return Right(MovieListEntity(
        movies: response.items,
        pagination: response.pagination,
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, MovieEntity>> getMovieDetails(String slug) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }

    try {
      final response = await remoteDataSource.getMovieDetails(slug);
      if (response.movie == null) {
        return const Left(NotFoundFailure('Không tìm thấy phim'));
      }
      return Right(response.movie!);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, MovieListEntity>> getMoviesByType({
    required String typeList,
    int page = 1,
    int limit = 24,
    String? category,
    String? country,
    String? year,
    String? sortField,
    String? sortType,
  }) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }

    try {
      final response = await remoteDataSource.getMoviesByType(
        typeList: typeList,
        page: page,
        limit: limit,
        category: category,
        country: country,
        year: year,
        sortField: sortField,
        sortType: sortType,
      );
      return Right(MovieListEntity(
        movies: response.items,
        pagination: response.pagination,
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<CategoryEntity>>> getCategories() async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }

    try {
      final categories = await remoteDataSource.getCategories();
      return Right(categories);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<CountryEntity>>> getCountries() async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }

    try {
      final countries = await remoteDataSource.getCountries();
      return Right(countries);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, int>> syncMovieToDatabase(MovieEntity movie) async {
    try {
      // Convert entity to model for serialization
      final movieModel = movie as MovieModel;
      final syncData = movieModel.toSyncFormat();
      final movieId = await supabaseDataSource.syncMovieData(syncData);
      return Right(movieId);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
```

---

## Task 2.9: Tạo Use Cases

### Prompt cho AI Agent:

```
Tạo Use Cases trong lib/features/movie/domain/usecases/:

1. File: get_latest_movies.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/movie_list_entity.dart';
import '../repositories/movie_repository.dart';

class GetLatestMovies {
  final MovieRepository repository;

  GetLatestMovies(this.repository);

  Future<Either<Failure, MovieListEntity>> call({int page = 1}) {
    return repository.getLatestMovies(page: page);
  }
}

2. File: get_movie_details.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/movie_entity.dart';
import '../repositories/movie_repository.dart';

class GetMovieDetails {
  final MovieRepository repository;

  GetMovieDetails(this.repository);

  Future<Either<Failure, MovieEntity>> call(String slug) {
    return repository.getMovieDetails(slug);
  }
}

3. File: search_movies.dart
---
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../entities/movie_list_entity.dart';
import '../repositories/movie_repository.dart';

class SearchMovies {
  final MovieRepository repository;

  SearchMovies(this.repository);

  Future<Either<Failure, MovieListEntity>> call(SearchParams params) {
    return repository.searchMovies(
      keyword: params.keyword,
      page: params.page,
      limit: params.limit,
      category: params.category,
      country: params.country,
      year: params.year,
      sortField: params.sortField,
      sortType: params.sortType,
    );
  }
}

class SearchParams extends Equatable {
  final String keyword;
  final int page;
  final int limit;
  final String? category;
  final String? country;
  final String? year;
  final String? sortField;
  final String? sortType;

  const SearchParams({
    required this.keyword,
    this.page = 1,
    this.limit = 24,
    this.category,
    this.country,
    this.year,
    this.sortField,
    this.sortType,
  });

  @override
  List<Object?> get props => [keyword, page, limit, category, country, year];
}

4. File: get_movies_by_type.dart
---
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../entities/movie_list_entity.dart';
import '../repositories/movie_repository.dart';

class GetMoviesByType {
  final MovieRepository repository;

  GetMoviesByType(this.repository);

  Future<Either<Failure, MovieListEntity>> call(MovieTypeParams params) {
    return repository.getMoviesByType(
      typeList: params.typeList,
      page: params.page,
      limit: params.limit,
      category: params.category,
      country: params.country,
      year: params.year,
      sortField: params.sortField,
      sortType: params.sortType,
    );
  }
}

class MovieTypeParams extends Equatable {
  final String typeList;
  final int page;
  final int limit;
  final String? category;
  final String? country;
  final String? year;
  final String? sortField;
  final String? sortType;

  const MovieTypeParams({
    required this.typeList,
    this.page = 1,
    this.limit = 24,
    this.category,
    this.country,
    this.year,
    this.sortField,
    this.sortType,
  });

  @override
  List<Object?> get props => [typeList, page, limit, category, country, year];
}

5. File: get_categories.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/category_entity.dart';
import '../repositories/movie_repository.dart';

class GetCategories {
  final MovieRepository repository;

  GetCategories(this.repository);

  Future<Either<Failure, List<CategoryEntity>>> call() {
    return repository.getCategories();
  }
}

6. File: get_countries.dart
---
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/country_entity.dart';
import '../repositories/movie_repository.dart';

class GetCountries {
  final MovieRepository repository;

  GetCountries(this.repository);

  Future<Either<Failure, List<CountryEntity>>> call() {
    return repository.getCountries();
  }
}
```

---

## Task 2.10: Cập Nhật Dependency Injection

### Prompt cho AI Agent:

```
Cập nhật file lib/injection_container.dart để đăng ký các dependencies mới:

---
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/network/api_client.dart';
import 'core/network/network_info.dart';

// Movie Feature
import 'features/movie/data/datasources/movie_remote_datasource.dart';
import 'features/movie/data/datasources/movie_supabase_datasource.dart';
import 'features/movie/data/repositories/movie_repository_impl.dart';
import 'features/movie/domain/repositories/movie_repository.dart';
import 'features/movie/domain/usecases/get_latest_movies.dart';
import 'features/movie/domain/usecases/get_movie_details.dart';
import 'features/movie/domain/usecases/search_movies.dart';
import 'features/movie/domain/usecases/get_movies_by_type.dart';
import 'features/movie/domain/usecases/get_categories.dart';
import 'features/movie/domain/usecases/get_countries.dart';

// Auth Feature (will add in Phase 3)
// Library Feature (will add in Phase 3)
// History Feature (will add in Phase 3)

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // ==================== CORE ====================

  // Network
  sl.registerLazySingleton<Connectivity>(() => Connectivity());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton<ApiClient>(() => ApiClient());

  // Supabase Client
  sl.registerLazySingleton<SupabaseClient>(() => Supabase.instance.client);

  // ==================== MOVIE FEATURE ====================

  // Data Sources
  sl.registerLazySingleton<MovieRemoteDataSource>(
    () => MovieRemoteDataSourceImpl(apiClient: sl()),
  );
  sl.registerLazySingleton<MovieSupabaseDataSource>(
    () => MovieSupabaseDataSourceImpl(supabaseClient: sl()),
  );

  // Repository
  sl.registerLazySingleton<MovieRepository>(
    () => MovieRepositoryImpl(
      remoteDataSource: sl(),
      supabaseDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Use Cases
  sl.registerLazySingleton(() => GetLatestMovies(sl()));
  sl.registerLazySingleton(() => GetMovieDetails(sl()));
  sl.registerLazySingleton(() => SearchMovies(sl()));
  sl.registerLazySingleton(() => GetMoviesByType(sl()));
  sl.registerLazySingleton(() => GetCategories(sl()));
  sl.registerLazySingleton(() => GetCountries(sl()));

  // BLoCs - will add in Phase 3

  // ==================== AUTH FEATURE ====================
  // Will implement in Phase 3

  // ==================== LIBRARY FEATURE ====================
  // Will implement in Phase 3

  // ==================== HISTORY FEATURE ====================
  // Will implement in Phase 3
}
```

---

## Task 2.11: Tạo Image URL Helper

### Prompt cho AI Agent:

```
Tạo helper cho image URL trong lib/core/utils/image_url_helper.dart:

---
import '../constants/api_constants.dart';

class ImageUrlHelper {
  ImageUrlHelper._();

  /// Build optimized image URL using PhimAPI's WebP conversion proxy
  static String buildOptimizedUrl(String? url) {
    if (url == null || url.isEmpty) {
      return ''; // Return empty, let UI handle placeholder
    }

    // Already a blob or data URL
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }

    String fullUrl = url;

    // Ensure full URL
    if (!url.startsWith('http')) {
      fullUrl = '${ApiConstants.imageBaseUrl}/${url.replaceFirst(RegExp(r'^/'), '')}';
    }

    // Use image proxy for WebP conversion
    return '${ApiConstants.imageProxy}?url=${Uri.encodeComponent(fullUrl)}';
  }

  /// Build poster URL (usually higher quality)
  static String buildPosterUrl(String? posterUrl, {String? fallbackThumbUrl}) {
    if (posterUrl != null && posterUrl.isNotEmpty) {
      return buildOptimizedUrl(posterUrl);
    }
    if (fallbackThumbUrl != null && fallbackThumbUrl.isNotEmpty) {
      return buildOptimizedUrl(fallbackThumbUrl);
    }
    return '';
  }

  /// Build thumbnail URL
  static String buildThumbUrl(String? thumbUrl, {String? fallbackPosterUrl}) {
    if (thumbUrl != null && thumbUrl.isNotEmpty) {
      return buildOptimizedUrl(thumbUrl);
    }
    if (fallbackPosterUrl != null && fallbackPosterUrl.isNotEmpty) {
      return buildOptimizedUrl(fallbackPosterUrl);
    }
    return '';
  }

  /// Extract slug from URL
  static String extractSlug(String url) {
    if (url.isEmpty) return '';
    if (!url.startsWith('http')) return url;

    try {
      final uri = Uri.parse(url);
      final pathSegments = uri.pathSegments.where((s) => s.isNotEmpty).toList();
      return pathSegments.isNotEmpty ? pathSegments.last : '';
    } catch (e) {
      return url;
    }
  }
}
```

---

## ✅ Checklist Phase 2

- [ ] Domain Entities được tạo (Movie, Category, Country, Episode, User, etc.)
- [ ] Data Models với fromJson/toJson hoàn chỉnh
- [ ] Repository Interfaces (Abstract classes) định nghĩa rõ ràng
- [ ] Data Sources (Remote + Supabase) được implement
- [ ] Repository Implementations hoạt động với Either pattern
- [ ] Use Cases được tạo cho tất cả operations
- [ ] Dependency Injection được cập nhật
- [ ] Image URL Helper utility sẵn sàng
- [ ] Unit tests cơ bản cho Models và Repositories

---

**Tiếp theo:** [Phase 3: Business Logic (BLoC)](./03-phase-business-logic.md)
