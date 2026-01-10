# 🎨 Phase 4: UI Implementation (Presentation Layer)

## Mục Tiêu

- Xây dựng các Reusable Widgets
- Implement các màn hình chính
- Tích hợp BLoC với UI
- Xây dựng Video Player
- Responsive Design cho Web và Mobile

---

## Task 4.1: Tạo Reusable Movie Card Widget

### Prompt cho AI Agent:

```
Tạo Movie Card widget trong lib/features/movie/presentation/widgets/:

1. File: movie_card.dart
---
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/image_url_helper.dart';
import '../../../../core/widgets/cached_image.dart';
import '../../domain/entities/movie_entity.dart';

class MovieCard extends StatelessWidget {
  final MovieEntity movie;
  final double? width;
  final double? height;
  final bool showQuality;
  final bool showEpisode;
  final VoidCallback? onTap;

  const MovieCard({
    super.key,
    required this.movie,
    this.width,
    this.height,
    this.showQuality = true,
    this.showEpisode = true,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap ?? () => context.push('/movie/${movie.slug}'),
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Poster Image
              AppCachedImage(
                imageUrl: ImageUrlHelper.buildPosterUrl(
                  movie.posterUrl,
                  fallbackThumbUrl: movie.thumbUrl,
                ),
                fit: BoxFit.cover,
              ),

              // Gradient Overlay
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.transparent,
                        Colors.black.withOpacity(0.8),
                      ],
                      stops: const [0.0, 0.5, 1.0],
                    ),
                  ),
                ),
              ),

              // Badges (Quality & Episode)
              Positioned(
                top: 8,
                left: 8,
                right: 8,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (showQuality && movie.quality != null)
                      _QualityBadge(quality: movie.qualityBadge),
                    const Spacer(),
                    if (showEpisode && movie.episodeCurrent != null)
                      _EpisodeBadge(episode: movie.episodeInfo),
                  ],
                ),
              ),

              // Title & Info
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        movie.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          height: 1.2,
                        ),
                      ),
                      if (movie.year != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          movie.year.toString(),
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QualityBadge extends StatelessWidget {
  final String quality;

  const _QualityBadge({required this.quality});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.success,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        quality,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class _EpisodeBadge extends StatelessWidget {
  final String episode;

  const _EpisodeBadge({required this.episode});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        episode,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

2. File: movie_card_horizontal.dart
---
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/image_url_helper.dart';
import '../../../../core/widgets/cached_image.dart';
import '../../domain/entities/movie_entity.dart';

/// Horizontal movie card for lists/history
class MovieCardHorizontal extends StatelessWidget {
  final MovieEntity movie;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;

  const MovieCardHorizontal({
    super.key,
    required this.movie,
    this.subtitle,
    this.trailing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap ?? () => context.push('/movie/${movie.slug}'),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            // Poster
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: AppCachedImage(
                imageUrl: ImageUrlHelper.buildPosterUrl(
                  movie.posterUrl,
                  fallbackThumbUrl: movie.thumbUrl,
                ),
                width: 80,
                height: 120,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 12),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    movie.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (movie.originName != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      movie.originName!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      if (movie.year != null)
                        _InfoChip(text: movie.year.toString()),
                      if (movie.quality != null) ...[
                        const SizedBox(width: 8),
                        _InfoChip(
                          text: movie.qualityBadge,
                          color: AppColors.success,
                        ),
                      ],
                    ],
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      subtitle!,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Trailing widget
            if (trailing != null) ...[
              const SizedBox(width: 8),
              trailing!,
            ],
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String text;
  final Color? color;

  const _InfoChip({required this.text, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: (color ?? AppColors.surfaceVariant).withOpacity(0.5),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: AppColors.border),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w500,
          color: color ?? AppColors.textSecondary,
        ),
      ),
    );
  }
}

3. File: movie_card_top10.dart
---
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/image_url_helper.dart';
import '../../../../core/widgets/cached_image.dart';
import '../../domain/entities/movie_entity.dart';

/// Top 10 movie card with ranking number
class MovieCardTop10 extends StatelessWidget {
  final MovieEntity movie;
  final int rank;
  final VoidCallback? onTap;

  const MovieCardTop10({
    super.key,
    required this.movie,
    required this.rank,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap ?? () => context.push('/movie/${movie.slug}'),
      child: SizedBox(
        width: 160,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            // Rank number
            _RankNumber(rank: rank),

            // Card
            Expanded(
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      AppCachedImage(
                        imageUrl: ImageUrlHelper.buildPosterUrl(
                          movie.posterUrl,
                          fallbackThumbUrl: movie.thumbUrl,
                        ),
                        fit: BoxFit.cover,
                      ),
                      // Gradient
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withOpacity(0.7),
                              ],
                            ),
                          ),
                        ),
                      ),
                      // Title
                      Positioned(
                        bottom: 8,
                        left: 8,
                        right: 8,
                        child: Text(
                          movie.name,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RankNumber extends StatelessWidget {
  final int rank;

  const _RankNumber({required this.rank});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 50,
      child: Text(
        rank.toString(),
        style: TextStyle(
          fontSize: 80,
          fontWeight: FontWeight.w900,
          height: 0.8,
          foreground: Paint()
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2
            ..color = AppColors.textSecondary,
        ),
      ),
    );
  }
}
```

---

## Task 4.2: Tạo Movie Grid và Row Widgets

### Prompt cho AI Agent:

```
Tạo Movie Grid và Row widgets trong lib/features/movie/presentation/widgets/:

1. File: movie_grid.dart
---
import 'package:flutter/material.dart';
import '../../domain/entities/movie_entity.dart';
import 'movie_card.dart';

class MovieGrid extends StatelessWidget {
  final List<MovieEntity> movies;
  final int crossAxisCount;
  final double childAspectRatio;
  final EdgeInsets? padding;
  final ScrollPhysics? physics;
  final bool shrinkWrap;

  const MovieGrid({
    super.key,
    required this.movies,
    this.crossAxisCount = 2,
    this.childAspectRatio = 0.65,
    this.padding,
    this.physics,
    this.shrinkWrap = false,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: padding ?? const EdgeInsets.all(16),
      physics: physics,
      shrinkWrap: shrinkWrap,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: childAspectRatio,
        crossAxisSpacing: 12,
        mainAxisSpacing: 16,
      ),
      itemCount: movies.length,
      itemBuilder: (context, index) {
        return MovieCard(movie: movies[index]);
      },
    );
  }
}

/// Responsive Movie Grid that adapts to screen size
class ResponsiveMovieGrid extends StatelessWidget {
  final List<MovieEntity> movies;
  final EdgeInsets? padding;
  final ScrollPhysics? physics;
  final bool shrinkWrap;

  const ResponsiveMovieGrid({
    super.key,
    required this.movies,
    this.padding,
    this.physics,
    this.shrinkWrap = false,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        int crossAxisCount;
        double childAspectRatio;

        if (width >= 1200) {
          crossAxisCount = 6;
          childAspectRatio = 0.65;
        } else if (width >= 900) {
          crossAxisCount = 5;
          childAspectRatio = 0.65;
        } else if (width >= 600) {
          crossAxisCount = 4;
          childAspectRatio = 0.65;
        } else if (width >= 400) {
          crossAxisCount = 3;
          childAspectRatio = 0.60;
        } else {
          crossAxisCount = 2;
          childAspectRatio = 0.60;
        }

        return MovieGrid(
          movies: movies,
          crossAxisCount: crossAxisCount,
          childAspectRatio: childAspectRatio,
          padding: padding,
          physics: physics,
          shrinkWrap: shrinkWrap,
        );
      },
    );
  }
}

2. File: movie_row.dart
---
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/movie_entity.dart';
import 'movie_card.dart';

class MovieRow extends StatelessWidget {
  final String title;
  final List<MovieEntity> movies;
  final VoidCallback? onSeeAllTap;
  final double itemWidth;
  final double itemHeight;
  final EdgeInsets? padding;

  const MovieRow({
    super.key,
    required this.title,
    required this.movies,
    this.onSeeAllTap,
    this.itemWidth = 140,
    this.itemHeight = 210,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    if (movies.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Padding(
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              if (onSeeAllTap != null)
                TextButton(
                  onPressed: onSeeAllTap,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Xem tất cả',
                        style: TextStyle(color: AppColors.primary),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.arrow_forward_ios,
                        size: 12,
                        color: AppColors.primary,
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Horizontal List
        SizedBox(
          height: itemHeight,
          child: ListView.builder(
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: movies.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only(
                  right: index < movies.length - 1 ? 12 : 0,
                ),
                child: MovieCard(
                  movie: movies[index],
                  width: itemWidth,
                  height: itemHeight,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

3. File: movie_row_top10.dart
---
import 'package:flutter/material.dart';
import '../../domain/entities/movie_entity.dart';
import 'movie_card_top10.dart';

class MovieRowTop10 extends StatelessWidget {
  final String title;
  final List<MovieEntity> movies;
  final EdgeInsets? padding;

  const MovieRowTop10({
    super.key,
    required this.title,
    required this.movies,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    if (movies.isEmpty) return const SizedBox.shrink();

    final displayMovies = movies.take(10).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 220,
          child: ListView.builder(
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: displayMovies.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: EdgeInsets.only(
                  right: index < displayMovies.length - 1 ? 16 : 0,
                ),
                child: MovieCardTop10(
                  movie: displayMovies[index],
                  rank: index + 1,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
```

---

## Task 4.3: Tạo Hero Section Widget

### Prompt cho AI Agent:

```
Tạo Hero Section trong lib/features/home/presentation/widgets/:

1. File: hero_section.dart
---
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/image_url_helper.dart';
import '../../../../core/widgets/cached_image.dart';
import '../../../movie/domain/entities/movie_entity.dart';

class HeroSection extends StatefulWidget {
  final List<MovieEntity> movies;

  const HeroSection({super.key, required this.movies});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _startAutoPlay();
  }

  void _startAutoPlay() {
    Future.delayed(const Duration(seconds: 5), () {
      if (mounted && widget.movies.isNotEmpty) {
        final nextPage = (_currentPage + 1) % widget.movies.length;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
        _startAutoPlay();
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.movies.isEmpty) return const SizedBox.shrink();

    return SizedBox(
      height: 400,
      child: Stack(
        children: [
          // Page View
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) => setState(() => _currentPage = index),
            itemCount: widget.movies.length,
            itemBuilder: (context, index) {
              return _HeroSlide(movie: widget.movies[index]);
            },
          ),

          // Indicators
          Positioned(
            bottom: 16,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                widget.movies.length,
                (index) => _Indicator(isActive: index == _currentPage),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroSlide extends StatelessWidget {
  final MovieEntity movie;

  const _HeroSlide({required this.movie});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/movie/${movie.slug}'),
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
          AppCachedImage(
            imageUrl: ImageUrlHelper.buildThumbUrl(
              movie.thumbUrl,
              fallbackPosterUrl: movie.posterUrl,
            ),
            fit: BoxFit.cover,
          ),

          // Gradient Overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Colors.black.withOpacity(0.3),
                  Colors.black.withOpacity(0.8),
                  AppColors.background,
                ],
                stops: const [0.0, 0.3, 0.7, 1.0],
              ),
            ),
          ),

          // Content
          Positioned(
            bottom: 60,
            left: 16,
            right: 16,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Quality Badge
                if (movie.quality != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.success,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      movie.qualityBadge,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                const SizedBox(height: 12),

                // Title
                Text(
                  movie.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 8),

                // Meta Info
                Row(
                  children: [
                    if (movie.year != null) ...[
                      Text(
                        movie.year.toString(),
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(width: 16),
                    ],
                    if (movie.episodeCurrent != null)
                      Text(
                        movie.episodeInfo,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 14,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),

                // Watch Button
                ElevatedButton.icon(
                  onPressed: () => context.push('/movie/${movie.slug}'),
                  icon: const Icon(Icons.play_arrow),
                  label: const Text('Xem ngay'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Indicator extends StatelessWidget {
  final bool isActive;

  const _Indicator({required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4),
      width: isActive ? 24 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary : Colors.white.withOpacity(0.5),
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}
```

---

## Task 4.4: Tạo Video Player Widget

### Prompt cho AI Agent:

```
Tạo Video Player widget trong lib/features/movie/presentation/widgets/:

1. File: video_player_widget.dart
---
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';
import '../../../../core/constants/app_colors.dart';

class VideoPlayerWidget extends StatefulWidget {
  final String videoUrl;
  final String? episodeName;
  final bool autoPlay;
  final VoidCallback? onFullscreenChange;

  const VideoPlayerWidget({
    super.key,
    required this.videoUrl,
    this.episodeName,
    this.autoPlay = false,
    this.onFullscreenChange,
  });

  @override
  State<VideoPlayerWidget> createState() => _VideoPlayerWidgetState();
}

class _VideoPlayerWidgetState extends State<VideoPlayerWidget> {
  late VideoPlayerController _videoController;
  ChewieController? _chewieController;
  bool _isInitialized = false;
  bool _hasError = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  @override
  void didUpdateWidget(VideoPlayerWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.videoUrl != widget.videoUrl) {
      _disposeControllers();
      _initializePlayer();
    }
  }

  Future<void> _initializePlayer() async {
    if (widget.videoUrl.isEmpty) {
      setState(() {
        _hasError = true;
        _errorMessage = 'URL video không hợp lệ';
      });
      return;
    }

    setState(() {
      _isInitialized = false;
      _hasError = false;
      _errorMessage = null;
    });

    try {
      _videoController = VideoPlayerController.networkUrl(
        Uri.parse(widget.videoUrl),
        httpHeaders: const {
          'User-Agent': 'Mozilla/5.0',
        },
      );

      await _videoController.initialize();

      _chewieController = ChewieController(
        videoPlayerController: _videoController,
        autoPlay: widget.autoPlay,
        looping: false,
        aspectRatio: _videoController.value.aspectRatio,
        allowFullScreen: true,
        allowMuting: true,
        showControls: true,
        placeholder: _buildPlaceholder(),
        errorBuilder: (context, errorMessage) => _buildError(errorMessage),
        materialProgressColors: ChewieProgressColors(
          playedColor: AppColors.primary,
          handleColor: AppColors.primary,
          backgroundColor: AppColors.surfaceVariant,
          bufferedColor: AppColors.primary.withOpacity(0.3),
        ),
        // Fullscreen handling
        deviceOrientationsAfterFullScreen: [
          DeviceOrientation.portraitUp,
          DeviceOrientation.portraitDown,
        ],
        deviceOrientationsOnEnterFullScreen: [
          DeviceOrientation.landscapeLeft,
          DeviceOrientation.landscapeRight,
        ],
      );

      if (mounted) {
        setState(() => _isInitialized = true);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _hasError = true;
          _errorMessage = 'Không thể tải video: $e';
        });
      }
    }
  }

  Widget _buildPlaceholder() {
    return Container(
      color: Colors.black,
      child: const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      ),
    );
  }

  Widget _buildError(String message) {
    return Container(
      color: Colors.black,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: AppColors.error, size: 48),
            const SizedBox(height: 16),
            Text(
              message,
              style: const TextStyle(color: Colors.white),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _initializePlayer,
              child: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }

  void _disposeControllers() {
    _chewieController?.dispose();
    _videoController.dispose();
  }

  @override
  void dispose() {
    _disposeControllers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Container(
        color: Colors.black,
        child: _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    if (_hasError) {
      return _buildError(_errorMessage ?? 'Có lỗi xảy ra');
    }

    if (!_isInitialized || _chewieController == null) {
      return _buildPlaceholder();
    }

    return Chewie(controller: _chewieController!);
  }
}

2. File: episode_selector.dart
---
import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/episode_entity.dart';

class EpisodeSelector extends StatefulWidget {
  final List<EpisodeServerEntity> servers;
  final EpisodeEntity? currentEpisode;
  final Function(EpisodeEntity) onEpisodeSelected;

  const EpisodeSelector({
    super.key,
    required this.servers,
    this.currentEpisode,
    required this.onEpisodeSelected,
  });

  @override
  State<EpisodeSelector> createState() => _EpisodeSelectorState();
}

class _EpisodeSelectorState extends State<EpisodeSelector>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: widget.servers.length,
      vsync: this,
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.servers.isEmpty) return const SizedBox.shrink();

    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Server Tabs (if multiple servers)
          if (widget.servers.length > 1)
            TabBar(
              controller: _tabController,
              isScrollable: true,
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.textSecondary,
              indicatorColor: AppColors.primary,
              tabs: widget.servers
                  .map((server) => Tab(text: server.serverName))
                  .toList(),
            ),

          // Episodes Grid
          SizedBox(
            height: 200, // Adjust based on content
            child: TabBarView(
              controller: _tabController,
              children: widget.servers.map((server) {
                return _EpisodeGrid(
                  episodes: server.episodes,
                  currentEpisode: widget.currentEpisode,
                  onEpisodeSelected: widget.onEpisodeSelected,
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _EpisodeGrid extends StatelessWidget {
  final List<EpisodeEntity> episodes;
  final EpisodeEntity? currentEpisode;
  final Function(EpisodeEntity) onEpisodeSelected;

  const _EpisodeGrid({
    required this.episodes,
    this.currentEpisode,
    required this.onEpisodeSelected,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 6,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        childAspectRatio: 2,
      ),
      itemCount: episodes.length,
      itemBuilder: (context, index) {
        final episode = episodes[index];
        final isSelected = currentEpisode?.slug == episode.slug;

        return Material(
          color: isSelected ? AppColors.primary : AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(8),
          child: InkWell(
            onTap: episode.isPlayable
                ? () => onEpisodeSelected(episode)
                : null,
            borderRadius: BorderRadius.circular(8),
            child: Container(
              alignment: Alignment.center,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.border,
                ),
              ),
              child: Text(
                episode.name,
                style: TextStyle(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        );
      },
    );
  }
}
```

---

## Task 4.5: Tạo Home Page

### Prompt cho AI Agent:

```
Tạo Home Page trong lib/features/home/presentation/pages/:

1. File: home_page.dart
---
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/widgets/error_widget.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../injection_container.dart';
import '../../../movie/presentation/widgets/movie_row.dart';
import '../../../movie/presentation/widgets/movie_row_top10.dart';
import '../cubit/home_cubit.dart';
import '../cubit/home_state.dart';
import '../widgets/hero_section.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => sl<HomeCubit>()..loadHomeData(),
      child: const _HomePageContent(),
    );
  }
}

class _HomePageContent extends StatelessWidget {
  const _HomePageContent();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<HomeCubit, HomeState>(
        builder: (context, state) {
          if (state.isLoading && !state.hasData) {
            return const Center(child: LoadingIndicator());
          }

          if (state.isFailure && !state.hasData) {
            return AppErrorWidget(
              message: state.errorMessage,
              onRetry: () => context.read<HomeCubit>().refresh(),
            );
          }

          return RefreshIndicator(
            onRefresh: () => context.read<HomeCubit>().refresh(),
            child: CustomScrollView(
              slivers: [
                // Hero Section
                SliverToBoxAdapter(
                  child: HeroSection(movies: state.heroMovies),
                ),

                // Category Quick Links
                const SliverToBoxAdapter(
                  child: _CategoryRail(),
                ),

                // Movie Sections
                SliverToBoxAdapter(
                  child: Column(
                    children: [
                      const SizedBox(height: 24),

                      // Top 10
                      MovieRowTop10(
                        title: AppStrings.top10,
                        movies: state.top10Movies,
                      ),
                      const SizedBox(height: 24),

                      // Latest Movies
                      MovieRow(
                        title: AppStrings.latestMovies,
                        movies: state.latestMovies,
                        onSeeAllTap: () => context.push('/explore'),
                      ),
                      const SizedBox(height: 24),

                      // Korea Movies
                      MovieRow(
                        title: AppStrings.koreaMovies,
                        movies: state.koreaMovies,
                        onSeeAllTap: () => context.push('/explore?country=han-quoc'),
                      ),
                      const SizedBox(height: 24),

                      // Series
                      MovieRow(
                        title: 'Phim Bộ Hay',
                        movies: state.seriesMovies,
                        onSeeAllTap: () => context.push('/explore?type=phim-bo'),
                      ),
                      const SizedBox(height: 24),

                      // Anime
                      MovieRow(
                        title: 'Anime Nhật Bản',
                        movies: state.animeMovies,
                        onSeeAllTap: () => context.push('/explore?type=hoat-hinh&country=nhat-ban'),
                      ),
                      const SizedBox(height: 24),

                      // Action
                      MovieRow(
                        title: 'Phim Hành Động',
                        movies: state.actionMovies,
                        onSeeAllTap: () => context.push('/explore?category=hanh-dong'),
                      ),
                      const SizedBox(height: 24),

                      // Romance
                      MovieRow(
                        title: 'Phim Tình Cảm',
                        movies: state.romanceMovies,
                        onSeeAllTap: () => context.push('/explore?category=tinh-cam'),
                      ),
                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _CategoryRail extends StatelessWidget {
  const _CategoryRail();

  @override
  Widget build(BuildContext context) {
    final categories = [
      ('Phim Lẻ', '/explore?type=phim-le'),
      ('Phim Bộ', '/explore?type=phim-bo'),
      ('Hoạt Hình', '/explore?type=hoat-hinh'),
      ('TV Shows', '/explore?type=tv-shows'),
      ('Hàn Quốc', '/explore?country=han-quoc'),
      ('Trung Quốc', '/explore?country=trung-quoc'),
      ('Âu Mỹ', '/explore?country=au-my'),
    ];

    return Container(
      height: 50,
      margin: const EdgeInsets.symmetric(vertical: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final (name, route) = categories[index];
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ActionChip(
              label: Text(name),
              onPressed: () => context.push(route),
            ),
          );
        },
      ),
    );
  }
}
```

---

## Task 4.6: Tạo Movie Detail Page

### Prompt cho AI Agent:

```
Tạo Movie Detail Page trong lib/features/movie/presentation/pages/:

1. File: movie_detail_page.dart
---
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/image_url_helper.dart';
import '../../../../core/widgets/cached_image.dart';
import '../../../../core/widgets/error_widget.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../injection_container.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../cubit/movie_detail_cubit.dart';
import '../cubit/movie_detail_state.dart';
import '../widgets/video_player_widget.dart';
import '../widgets/episode_selector.dart';

class MovieDetailPage extends StatelessWidget {
  final String slug;

  const MovieDetailPage({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    // Get user ID from auth state
    final authState = context.read<AuthBloc>().state;
    final userId = authState.isAuthenticated ? authState.user?.id : null;

    return BlocProvider(
      create: (_) => sl<MovieDetailCubit>(param1: userId)..loadMovie(slug),
      child: const _MovieDetailContent(),
    );
  }
}

class _MovieDetailContent extends StatelessWidget {
  const _MovieDetailContent();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<MovieDetailCubit, MovieDetailState>(
        builder: (context, state) {
          if (state.isLoading && !state.hasMovie) {
            return const Center(child: LoadingIndicator());
          }

          if (state.isFailure && !state.hasMovie) {
            return AppErrorWidget(
              message: state.errorMessage,
              onRetry: () => context.read<MovieDetailCubit>().loadMovie(
                    state.movie?.slug ?? '',
                  ),
            );
          }

          if (!state.hasMovie) {
            return const AppErrorWidget(message: 'Không tìm thấy phim');
          }

          final movie = state.movie!;

          return CustomScrollView(
            slivers: [
              // App Bar with back button
              SliverAppBar(
                floating: true,
                backgroundColor: AppColors.background.withOpacity(0.9),
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => Navigator.of(context).pop(),
                ),
                actions: [
                  // Save Button
                  BlocBuilder<MovieDetailCubit, MovieDetailState>(
                    buildWhen: (prev, curr) =>
                        prev.isSaved != curr.isSaved ||
                        prev.isSaving != curr.isSaving,
                    builder: (context, state) {
                      return IconButton(
                        icon: state.isSaving
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : Icon(
                                state.isSaved
                                    ? LucideIcons.bookmarkCheck
                                    : LucideIcons.bookmark,
                                color: state.isSaved
                                    ? AppColors.primary
                                    : null,
                              ),
                        onPressed: () =>
                            context.read<MovieDetailCubit>().toggleSave(),
                      );
                    },
                  ),
                ],
              ),

              // Video Player
              if (state.currentEpisodeUrl != null)
                SliverToBoxAdapter(
                  child: VideoPlayerWidget(
                    videoUrl: state.currentEpisodeUrl!,
                    episodeName: state.currentEpisode?.name,
                  ),
                ),

              // Episode Selector
              if (state.hasEpisodes)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Danh sách tập',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 12),
                        EpisodeSelector(
                          servers: movie.episodes!,
                          currentEpisode: state.currentEpisode,
                          onEpisodeSelected: (episode) {
                            context
                                .read<MovieDetailCubit>()
                                .selectEpisode(episode);
                          },
                        ),
                      ],
                    ),
                  ),
                ),

              // Movie Info
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Poster
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: AppCachedImage(
                          imageUrl: ImageUrlHelper.buildPosterUrl(
                            movie.posterUrl,
                            fallbackThumbUrl: movie.thumbUrl,
                          ),
                          width: 120,
                          height: 180,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(width: 16),

                      // Info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              movie.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            if (movie.originName != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                movie.originName!,
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                            const SizedBox(height: 12),
                            _InfoRow(movie: movie),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Categories
              if (movie.categories != null && movie.categories!.isNotEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: movie.categories!.map((cat) {
                        return Chip(
                          label: Text(cat.name),
                          labelStyle: const TextStyle(fontSize: 12),
                        );
                      }).toList(),
                    ),
                  ),
                ),

              // Description
              if (movie.content != null && movie.content!.isNotEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Nội dung',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _stripHtml(movie.content!),
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Bottom padding
              const SliverToBoxAdapter(
                child: SizedBox(height: 32),
              ),
            ],
          );
        },
      ),
    );
  }

  String _stripHtml(String html) {
    return html
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .trim();
  }
}

class _InfoRow extends StatelessWidget {
  final dynamic movie;

  const _InfoRow({required this.movie});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        if (movie.year != null)
          _InfoChip(
            icon: LucideIcons.calendar,
            text: movie.year.toString(),
          ),
        if (movie.quality != null)
          _InfoChip(
            icon: LucideIcons.film,
            text: movie.qualityBadge,
            color: AppColors.success,
          ),
        if (movie.time != null)
          _InfoChip(
            icon: LucideIcons.clock,
            text: movie.time!,
          ),
        if (movie.lang != null)
          _InfoChip(
            icon: LucideIcons.globe,
            text: movie.lang!,
          ),
        if (movie.tmdb?.voteAverage != null)
          _InfoChip(
            icon: LucideIcons.star,
            text: movie.tmdb!.ratingText,
            color: Colors.amber,
          ),
      ],
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color? color;

  const _InfoChip({
    required this.icon,
    required this.text,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color ?? AppColors.textSecondary),
          const SizedBox(width: 6),
          Text(
            text,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: color ?? AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
```

---

## Task 4.7: Tạo Explore Page

### Prompt cho AI Agent:

```
Tạo Explore Page trong lib/features/explore/presentation/pages/:

File: explore_page.dart
---
(Tương tự pattern Home Page, sử dụng ExploreCubit với filters UI và ResponsiveMovieGrid)

Bao gồm:
- Filter bar với dropdowns cho: Type, Category, Country, Year, Sort
- Clear filters button
- Responsive grid hiển thị movies
- Pagination controls
- Loading và error states
```

---

## Task 4.8: Tạo Library và History Pages

### Prompt cho AI Agent:

```
Tạo Library Page trong lib/features/library/presentation/pages/:

File: library_page.dart
---
(Sử dụng LibraryCubit, hiển thị saved movies với option xóa)

Tạo History Page trong lib/features/history/presentation/pages/:

File: history_page.dart
---
(Sử dụng HistoryCubit, hiển thị watch history với relative time và option xóa)
```

---

## Task 4.9: Tạo Search Page

### Prompt cho AI Agent:

```
Tạo Search Page trong lib/features/movie/presentation/pages/:

File: search_page.dart
---
(Sử dụng SearchCubit với:
- Search bar với debounce
- Recent searches list
- Search results grid
- Empty state khi không có kết quả
)
```

---

## Task 4.10: Cập Nhật Router với Pages thực

### Prompt cho AI Agent:

```
Cập nhật lib/routes/app_router.dart để sử dụng các pages đã tạo:

- Replace PlaceholderPage với actual pages
- Import tất cả pages
- Đảm bảo routes hoạt động đúng
```

---

## ✅ Checklist Phase 4

- [ ] MovieCard widget (vertical, horizontal, top10) hoàn chỉnh
- [ ] MovieGrid và MovieRow widgets responsive
- [ ] HeroSection với auto-play slider
- [ ] VideoPlayerWidget với Chewie/video_player
- [ ] EpisodeSelector với tabs cho multiple servers
- [ ] HomePage với tất cả sections
- [ ] MovieDetailPage với player và episode selection
- [ ] ExplorePage với filters và pagination
- [ ] LibraryPage và HistoryPage
- [ ] SearchPage với debounce
- [ ] Router được cập nhật với actual pages
- [ ] Responsive design hoạt động trên Mobile và Web

---

**Tiếp theo:** [Phase 5: Optimization & Polish](./05-phase-optimization.md)
