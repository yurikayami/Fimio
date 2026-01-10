# 🚀 Phase 5: Optimization & Polish

## Mục Tiêu

- Tối ưu hiệu suất ứng dụng
- Xây dựng responsive design cho Web
- Setup testing framework
- Code review checklist
- Pre-launch polish

---

## Task 5.1: Image Caching và Optimization

### Prompt cho AI Agent:

```
Tạo cấu hình image caching tối ưu trong lib/core/widgets/:

1. File: cached_image.dart (enhanced)
---
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../constants/app_colors.dart';

class AppCachedImage extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final Widget? placeholder;
  final Widget? errorWidget;
  final Duration fadeInDuration;

  const AppCachedImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.placeholder,
    this.errorWidget,
    this.fadeInDuration = const Duration(milliseconds: 300),
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.isEmpty) {
      return _buildError();
    }

    Widget image = CachedNetworkImage(
      imageUrl: imageUrl!,
      width: width,
      height: height,
      fit: fit,
      fadeInDuration: fadeInDuration,
      // Optimize memory usage
      memCacheWidth: width != null ? (width! * 2).toInt() : null,
      memCacheHeight: height != null ? (height! * 2).toInt() : null,
      maxWidthDiskCache: 1000, // Limit disk cache size
      maxHeightDiskCache: 1500,
      placeholder: (context, url) => placeholder ?? _buildPlaceholder(),
      errorWidget: (context, url, error) => errorWidget ?? _buildError(),
      // HTTP headers for CORS
      httpHeaders: const {
        'User-Agent': 'Mozilla/5.0',
      },
    );

    if (borderRadius != null) {
      image = ClipRRect(
        borderRadius: borderRadius!,
        child: image,
      );
    }

    return image;
  }

  Widget _buildPlaceholder() {
    return Shimmer.fromColors(
      baseColor: AppColors.surfaceVariant,
      highlightColor: AppColors.surface,
      child: Container(
        width: width,
        height: height,
        color: AppColors.surfaceVariant,
      ),
    );
  }

  Widget _buildError() {
    return Container(
      width: width,
      height: height,
      color: AppColors.surfaceVariant,
      child: const Icon(
        Icons.broken_image_outlined,
        color: AppColors.textMuted,
        size: 32,
      ),
    );
  }
}

2. Cấu hình cache trong main.dart:
---
import 'package:flutter_cache_manager/flutter_cache_manager.dart';

class AppCacheManager {
  static const key = 'appImageCache';

  static CacheManager instance = CacheManager(
    Config(
      key,
      stalePeriod: const Duration(days: 7),
      maxNrOfCacheObjects: 200,
      repo: JsonCacheInfoRepository(databaseName: key),
      fileService: HttpFileService(),
    ),
  );

  /// Clear all cached images
  static Future<void> clearCache() async {
    await instance.emptyCache();
  }

  /// Get cache size info
  static Future<int> getCacheSize() async {
    final files = await instance.store.getFilesFromDb();
    int totalSize = 0;
    for (final file in files) {
      totalSize += file.length ?? 0;
    }
    return totalSize;
  }
}
```

---

## Task 5.2: List Performance Optimization

### Prompt cho AI Agent:

```
Tối ưu list rendering trong lib/core/widgets/:

1. File: optimized_list.dart
---
import 'package:flutter/material.dart';

/// Optimized ListView with memory management
class OptimizedListView<T> extends StatelessWidget {
  final List<T> items;
  final Widget Function(BuildContext, T, int) itemBuilder;
  final ScrollController? controller;
  final EdgeInsets? padding;
  final bool shrinkWrap;
  final ScrollPhysics? physics;
  final Axis scrollDirection;
  final double? cacheExtent;
  final Widget? separator;

  const OptimizedListView({
    super.key,
    required this.items,
    required this.itemBuilder,
    this.controller,
    this.padding,
    this.shrinkWrap = false,
    this.physics,
    this.scrollDirection = Axis.vertical,
    this.cacheExtent,
    this.separator,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: controller,
      padding: padding,
      shrinkWrap: shrinkWrap,
      physics: physics,
      scrollDirection: scrollDirection,
      cacheExtent: cacheExtent ?? 500, // Pre-render items
      // Performance optimizations
      addAutomaticKeepAlives: false,
      addRepaintBoundaries: true,
      itemCount: separator != null ? items.length * 2 - 1 : items.length,
      itemBuilder: (context, index) {
        if (separator != null) {
          if (index.isOdd) return separator!;
          final itemIndex = index ~/ 2;
          return itemBuilder(context, items[itemIndex], itemIndex);
        }
        return itemBuilder(context, items[index], index);
      },
    );
  }
}

2. File: infinite_scroll_mixin.dart
---
import 'package:flutter/material.dart';

mixin InfiniteScrollMixin<T extends StatefulWidget> on State<T> {
  late ScrollController scrollController;
  double _scrollThreshold = 200;
  bool _isLoadingMore = false;

  @protected
  void initInfiniteScroll({double threshold = 200}) {
    _scrollThreshold = threshold;
    scrollController = ScrollController();
    scrollController.addListener(_onScroll);
  }

  @protected
  void disposeInfiniteScroll() {
    scrollController.dispose();
  }

  void _onScroll() {
    if (_isLoadingMore) return;

    final maxScroll = scrollController.position.maxScrollExtent;
    final currentScroll = scrollController.position.pixels;

    if (maxScroll - currentScroll <= _scrollThreshold) {
      _loadMore();
    }
  }

  Future<void> _loadMore() async {
    if (_isLoadingMore) return;
    _isLoadingMore = true;

    await onLoadMore();

    _isLoadingMore = false;
  }

  /// Override this method to implement load more logic
  Future<void> onLoadMore();
}

3. File: sliver_grid_delegate.dart
---
import 'package:flutter/material.dart';

/// Responsive grid delegate that adapts to screen width
class ResponsiveSliverGridDelegate extends SliverGridDelegate {
  final double minItemWidth;
  final double maxItemWidth;
  final double aspectRatio;
  final double mainAxisSpacing;
  final double crossAxisSpacing;

  const ResponsiveSliverGridDelegate({
    this.minItemWidth = 140,
    this.maxItemWidth = 200,
    this.aspectRatio = 0.65,
    this.mainAxisSpacing = 16,
    this.crossAxisSpacing = 12,
  });

  @override
  SliverGridLayout getLayout(SliverConstraints constraints) {
    final width = constraints.crossAxisExtent;

    // Calculate cross axis count based on available width
    int crossAxisCount = (width / minItemWidth).floor();
    crossAxisCount = crossAxisCount.clamp(2, 6);

    final itemWidth = (width - (crossAxisCount - 1) * crossAxisSpacing) / crossAxisCount;
    final itemHeight = itemWidth / aspectRatio;

    return SliverGridRegularTileLayout(
      crossAxisCount: crossAxisCount,
      mainAxisStride: itemHeight + mainAxisSpacing,
      crossAxisStride: itemWidth + crossAxisSpacing,
      childMainAxisExtent: itemHeight,
      childCrossAxisExtent: itemWidth,
      reverseCrossAxis: false,
    );
  }

  @override
  bool shouldRelayout(ResponsiveSliverGridDelegate oldDelegate) {
    return oldDelegate.minItemWidth != minItemWidth ||
        oldDelegate.aspectRatio != aspectRatio;
  }
}
```

---

## Task 5.3: Web Platform Optimization

### Prompt cho AI Agent:

```
Tối ưu cho Flutter Web trong lib/core/:

1. File: platform_utils.dart
---
import 'package:flutter/foundation.dart';

class PlatformUtils {
  static bool get isWeb => kIsWeb;
  static bool get isMobile => !kIsWeb;
  static bool get isDesktop => !kIsWeb && !isMobile;

  /// Check if running on mobile web
  static bool get isMobileWeb {
    if (!kIsWeb) return false;
    // Use user agent detection for web
    return false; // Will be handled by web-specific code
  }

  /// Get appropriate image quality for platform
  static int get imageQuality {
    if (isWeb) return 80;
    return 100;
  }

  /// Check if should use HLS player
  static bool get useHlsPlayer {
    return true; // Both web and mobile support HLS
  }
}

2. File: web_video_player.dart (Web-specific player)
---
import 'package:flutter/material.dart';
import 'platform_utils.dart';

/// Video player that adapts to platform
class AdaptiveVideoPlayer extends StatelessWidget {
  final String videoUrl;
  final bool autoPlay;

  const AdaptiveVideoPlayer({
    super.key,
    required this.videoUrl,
    this.autoPlay = false,
  });

  @override
  Widget build(BuildContext context) {
    // For HLS streams on web, might need iframe fallback
    if (PlatformUtils.isWeb && _isHlsUrl(videoUrl)) {
      return _WebHlsPlayer(url: videoUrl, autoPlay: autoPlay);
    }

    // Use native player for mobile and non-HLS
    return _NativeVideoPlayer(url: videoUrl, autoPlay: autoPlay);
  }

  bool _isHlsUrl(String url) {
    return url.contains('.m3u8') || url.contains('hls');
  }
}

class _WebHlsPlayer extends StatelessWidget {
  final String url;
  final bool autoPlay;

  const _WebHlsPlayer({required this.url, required this.autoPlay});

  @override
  Widget build(BuildContext context) {
    // Use HtmlElementView for web iframe
    // For simplicity, using a container with message
    // Real implementation would use dart:html and HtmlElementView
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Container(
        color: Colors.black,
        child: const Center(
          child: Text(
            'Loading video...',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }
}

class _NativeVideoPlayer extends StatelessWidget {
  final String url;
  final bool autoPlay;

  const _NativeVideoPlayer({required this.url, required this.autoPlay});

  @override
  Widget build(BuildContext context) {
    // Use Chewie/video_player implementation
    // This is a placeholder - use actual VideoPlayerWidget
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Container(
        color: Colors.black,
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
    );
  }
}

3. Cấu hình web trong web/index.html:
---
<!-- Add to <head> section -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<style>
  /* Smooth loading */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #000;
  }
</style>
```

---

## Task 5.4: Testing Setup

### Prompt cho AI Agent:

```
Setup testing framework:

1. File: test/helpers/test_helpers.dart
---
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

// Mock classes
class MockNavigatorObserver extends Mock implements NavigatorObserver {}

// Test wrapper widget
Widget createTestWidget({
  required Widget child,
  List<BlocProvider>? providers,
  NavigatorObserver? navigatorObserver,
}) {
  Widget widget = MaterialApp(
    home: child,
    navigatorObservers: [
      if (navigatorObserver != null) navigatorObserver,
    ],
  );

  if (providers != null && providers.isNotEmpty) {
    widget = MultiBlocProvider(
      providers: providers,
      child: widget,
    );
  }

  return widget;
}

// Common test fixtures
class TestFixtures {
  static Map<String, dynamic> get movieJson => {
    'slug': 'test-movie',
    'name': 'Test Movie',
    'origin_name': 'Test Movie Original',
    'year': 2024,
    'quality': 'HD',
    'poster_url': 'https://example.com/poster.jpg',
    'thumb_url': 'https://example.com/thumb.jpg',
  };

  static Map<String, dynamic> get episodeJson => {
    'slug': 'tap-1',
    'name': 'Tập 1',
    'filename': 'tap-1.m3u8',
    'link_embed': 'https://example.com/embed/1',
    'link_m3u8': 'https://example.com/stream/1.m3u8',
  };
}

2. File: test/features/movie/domain/entities/movie_entity_test.dart
---
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/features/movie/domain/entities/movie_entity.dart';

void main() {
  group('MovieEntity', () {
    test('should have correct qualityBadge for HD', () {
      const movie = MovieEntity(
        slug: 'test',
        name: 'Test',
        quality: 'HD',
      );
      expect(movie.qualityBadge, 'HD');
    });

    test('should have correct qualityBadge for FHD', () {
      const movie = MovieEntity(
        slug: 'test',
        name: 'Test',
        quality: 'FHD',
      );
      expect(movie.qualityBadge, 'Full HD');
    });

    test('episodeInfo should return Full when episodeTotal equals', () {
      const movie = MovieEntity(
        slug: 'test',
        name: 'Test',
        episodeCurrent: '16',
        episodeTotal: '16',
      );
      expect(movie.episodeInfo, 'Hoàn tất');
    });
  });
}

3. File: test/features/movie/data/models/movie_model_test.dart
---
import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/features/movie/data/models/movie_model.dart';

void main() {
  group('MovieModel', () {
    test('should correctly parse from JSON', () {
      final json = {
        'slug': 'test-movie',
        'name': 'Test Movie',
        'origin_name': 'Test Movie Original',
        'year': 2024,
        'quality': 'HD',
      };

      final movie = MovieModel.fromJson(json);

      expect(movie.slug, 'test-movie');
      expect(movie.name, 'Test Movie');
      expect(movie.year, 2024);
    });

    test('should handle null optional fields', () {
      final json = {
        'slug': 'test-movie',
        'name': 'Test Movie',
      };

      final movie = MovieModel.fromJson(json);

      expect(movie.slug, 'test-movie');
      expect(movie.originName, isNull);
      expect(movie.year, isNull);
    });
  });
}

4. File: test/features/movie/presentation/cubit/movie_detail_cubit_test.dart
---
import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:your_app/core/error/failures.dart';
import 'package:your_app/features/movie/domain/usecases/get_movie_detail.dart';
import 'package:your_app/features/movie/presentation/cubit/movie_detail_cubit.dart';

class MockGetMovieDetail extends Mock implements GetMovieDetail {}

void main() {
  late MovieDetailCubit cubit;
  late MockGetMovieDetail mockGetMovieDetail;

  setUp(() {
    mockGetMovieDetail = MockGetMovieDetail();
    cubit = MovieDetailCubit(
      getMovieDetail: mockGetMovieDetail,
      // ... other dependencies
    );
  });

  tearDown(() => cubit.close());

  group('MovieDetailCubit', () {
    blocTest<MovieDetailCubit, MovieDetailState>(
      'emits [loading, loaded] when loadMovie succeeds',
      build: () {
        when(() => mockGetMovieDetail(any()))
            .thenAnswer((_) async => Right(/* mock movie */));
        return cubit;
      },
      act: (cubit) => cubit.loadMovie('test-slug'),
      expect: () => [
        // isLoading state
        // loaded state with movie
      ],
    );

    blocTest<MovieDetailCubit, MovieDetailState>(
      'emits [loading, failure] when loadMovie fails',
      build: () {
        when(() => mockGetMovieDetail(any()))
            .thenAnswer((_) async => Left(ServerFailure('Error')));
        return cubit;
      },
      act: (cubit) => cubit.loadMovie('test-slug'),
      expect: () => [
        // isLoading state
        // failure state with error
      ],
    );
  });
}
```

---

## Task 5.5: Error Handling Enhancement

### Prompt cho AI Agent:

```
Cải thiện error handling trong lib/core/:

1. File: error/error_handler.dart
---
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'failures.dart';

class ErrorHandler {
  static Failure handleException(dynamic error) {
    if (error is DioException) {
      return _handleDioError(error);
    }

    if (error is Failure) {
      return error;
    }

    return UnknownFailure(error.toString());
  }

  static Failure _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkFailure('Kết nối quá chậm, vui lòng thử lại');

      case DioExceptionType.badResponse:
        return _handleBadResponse(error.response?.statusCode);

      case DioExceptionType.cancel:
        return NetworkFailure('Yêu cầu đã bị hủy');

      case DioExceptionType.connectionError:
        return NetworkFailure('Không thể kết nối đến server');

      default:
        return NetworkFailure('Đã xảy ra lỗi mạng');
    }
  }

  static Failure _handleBadResponse(int? statusCode) {
    switch (statusCode) {
      case 400:
        return ServerFailure('Yêu cầu không hợp lệ');
      case 401:
        return AuthFailure('Phiên đăng nhập hết hạn');
      case 403:
        return ServerFailure('Không có quyền truy cập');
      case 404:
        return ServerFailure('Không tìm thấy dữ liệu');
      case 500:
      case 502:
      case 503:
        return ServerFailure('Lỗi server, vui lòng thử lại sau');
      default:
        return ServerFailure('Lỗi không xác định ($statusCode)');
    }
  }
}

2. File: widgets/error_widget.dart (enhanced)
---
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../constants/app_colors.dart';
import '../error/failures.dart';

class AppErrorWidget extends StatelessWidget {
  final String? message;
  final Failure? failure;
  final VoidCallback? onRetry;
  final bool fullScreen;

  const AppErrorWidget({
    super.key,
    this.message,
    this.failure,
    this.onRetry,
    this.fullScreen = false,
  });

  @override
  Widget build(BuildContext context) {
    final errorMessage = message ?? failure?.message ?? 'Đã xảy ra lỗi';
    final icon = _getIconForFailure(failure);

    final content = Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          icon,
          size: 64,
          color: AppColors.error.withOpacity(0.7),
        ),
        const SizedBox(height: 16),
        Text(
          errorMessage,
          style: TextStyle(
            fontSize: 16,
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
        if (onRetry != null) ...[
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh),
            label: const Text('Thử lại'),
          ),
        ],
      ],
    );

    if (fullScreen) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: content,
          ),
        ),
      );
    }

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: content,
      ),
    );
  }

  IconData _getIconForFailure(Failure? failure) {
    if (failure is NetworkFailure) {
      return LucideIcons.wifiOff;
    }
    if (failure is AuthFailure) {
      return LucideIcons.userX;
    }
    if (failure is CacheFailure) {
      return LucideIcons.database;
    }
    return LucideIcons.alertTriangle;
  }
}

3. File: widgets/empty_state_widget.dart
---
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../constants/app_colors.dart';

class EmptyStateWidget extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? action;

  const EmptyStateWidget({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.action,
  });

  // Factory constructors for common states
  factory EmptyStateWidget.noMovies() => const EmptyStateWidget(
        icon: LucideIcons.film,
        title: 'Không có phim nào',
        subtitle: 'Hãy thử tìm kiếm hoặc khám phá thêm',
      );

  factory EmptyStateWidget.noResults() => const EmptyStateWidget(
        icon: LucideIcons.search,
        title: 'Không tìm thấy kết quả',
        subtitle: 'Thử tìm với từ khóa khác',
      );

  factory EmptyStateWidget.noSavedMovies({VoidCallback? onExplore}) =>
      EmptyStateWidget(
        icon: LucideIcons.bookmark,
        title: 'Chưa có phim đã lưu',
        subtitle: 'Lưu phim yêu thích để xem sau',
        action: onExplore != null
            ? TextButton(
                onPressed: onExplore,
                child: const Text('Khám phá ngay'),
              )
            : null,
      );

  factory EmptyStateWidget.noHistory({VoidCallback? onExplore}) =>
      EmptyStateWidget(
        icon: LucideIcons.history,
        title: 'Chưa có lịch sử xem',
        subtitle: 'Bắt đầu xem phim để có lịch sử',
        action: onExplore != null
            ? TextButton(
                onPressed: onExplore,
                child: const Text('Xem phim ngay'),
              )
            : null,
      );

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 8),
              Text(
                subtitle!,
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (action != null) ...[
              const SizedBox(height: 24),
              action!,
            ],
          ],
        ),
      ),
    );
  }
}
```

---

## Task 5.6: Analytics Setup (Optional)

### Prompt cho AI Agent:

```
Setup analytics (nếu cần):

1. File: lib/core/analytics/analytics_service.dart
---
abstract class AnalyticsService {
  Future<void> logEvent(String name, [Map<String, dynamic>? parameters]);
  Future<void> logScreenView(String screenName);
  Future<void> setUserId(String? userId);
  Future<void> logMovieView(String slug, String name);
  Future<void> logSearch(String query, int resultCount);
}

class AnalyticsServiceImpl implements AnalyticsService {
  // Implement with Firebase Analytics or your preferred service

  @override
  Future<void> logEvent(String name, [Map<String, dynamic>? parameters]) async {
    // TODO: Implement
  }

  @override
  Future<void> logScreenView(String screenName) async {
    // TODO: Implement
  }

  @override
  Future<void> setUserId(String? userId) async {
    // TODO: Implement
  }

  @override
  Future<void> logMovieView(String slug, String name) async {
    await logEvent('movie_view', {'slug': slug, 'name': name});
  }

  @override
  Future<void> logSearch(String query, int resultCount) async {
    await logEvent('search', {'query': query, 'result_count': resultCount});
  }
}
```

---

## Task 5.7: App Polish

### Prompt cho AI Agent:

```
Polish final:

1. Splash Screen (lib/features/splash/):
---
- Logo animation
- Load initial data
- Check auth state
- Navigate to appropriate screen

2. Onboarding (lib/features/onboarding/):
---
- First-time user experience
- Feature highlights
- Skip option

3. Settings Page (lib/features/settings/):
---
- Theme toggle (if supporting light mode)
- Clear cache option
- About app
- Privacy policy link
- App version

4. Pull-to-refresh everywhere

5. Skeleton loading states for all lists

6. Smooth transitions and animations
```

---

## Task 5.8: Pre-Launch Checklist

### Code Review Checklist:

```markdown
## 📋 Code Quality Checklist

### Architecture

- [ ] Clean Architecture layers properly separated
- [ ] No direct dependencies between features
- [ ] All dependencies go through DI (get_it)
- [ ] Either pattern used for error handling

### State Management

- [ ] BLoC/Cubit for all features
- [ ] No business logic in UI
- [ ] Proper state classes with copyWith
- [ ] Loading/Error/Success states handled

### Performance

- [ ] ListView.builder for all lists
- [ ] const constructors where possible
- [ ] Image caching implemented
- [ ] No memory leaks (dispose controllers)
- [ ] Debounce for search input

### UI/UX

- [ ] Responsive design works on all sizes
- [ ] Dark mode implemented
- [ ] Loading states with skeleton
- [ ] Error states with retry
- [ ] Empty states with CTAs
- [ ] Smooth animations

### Code Style

- [ ] Consistent naming conventions
- [ ] Proper file organization
- [ ] No unused imports/variables
- [ ] Comments for complex logic
- [ ] README updated

### Testing

- [ ] Unit tests for models
- [ ] Unit tests for entities
- [ ] Widget tests for key components
- [ ] BLoC tests for state changes

### Security

- [ ] No hardcoded secrets
- [ ] API keys in environment
- [ ] Secure storage for tokens
- [ ] Input validation

### Build

- [ ] Release build works
- [ ] Web build works
- [ ] No console errors/warnings
- [ ] Proper app icons
- [ ] Proper splash screen
```

---

## Task 5.9: Build & Deploy

### Prompt cho AI Agent:

```
Hướng dẫn build và deploy:

1. Android:
---
flutter build apk --release
flutter build appbundle --release

2. iOS:
---
flutter build ios --release

3. Web:
---
flutter build web --release --web-renderer canvaskit

4. Deploy Web to Vercel:
---
# vercel.json
{
  "buildCommand": "flutter build web --release",
  "outputDirectory": "build/web",
  "framework": null
}

5. Environment variables:
---
- SUPABASE_URL
- SUPABASE_ANON_KEY
- API_BASE_URL (phimapi.com)
```

---

## ✅ Final Checklist Phase 5

- [ ] Image caching với cache manager
- [ ] List performance với ListView.builder
- [ ] Web platform optimizations
- [ ] Testing setup với mocktail và bloc_test
- [ ] Enhanced error handling
- [ ] Empty states cho tất cả screens
- [ ] Analytics setup (optional)
- [ ] Splash screen và onboarding
- [ ] Settings page
- [ ] Code review completed
- [ ] All builds successful
- [ ] Deployed to test environment

---

## 🎉 Migration Complete!

Sau khi hoàn thành Phase 5, bạn sẽ có một ứng dụng Flutter hoàn chỉnh với:

- ✅ Clean Architecture
- ✅ BLoC State Management
- ✅ Supabase Backend Integration
- ✅ PhimAPI Data Source
- ✅ Material 3 Dark Theme
- ✅ Responsive Design
- ✅ Video Player với HLS support
- ✅ User Authentication
- ✅ Library & Watch History
- ✅ Search với debounce
- ✅ Offline caching
- ✅ Error handling
- ✅ Testing foundation

---

**Tham khảo thêm:**

- [Flutter Documentation](https://docs.flutter.dev)
- [BLoC Library](https://bloclibrary.dev)
- [Supabase Flutter](https://supabase.com/docs/guides/getting-started/quickstarts/flutter)
