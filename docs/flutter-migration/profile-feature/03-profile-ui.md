# 🎨 Profile Feature - UI Implementation (AniYomi Style)

## Mục đích

Xây dựng UI Profile với **AniYomi/Tachiyomi style**: Material You design, collapsing toolbar, bottom sheets, modern animations.

---

## 🎨 AniYomi Design Principles

### Key Characteristics

- **Material You** dynamic colors
- **Collapsing SliverAppBar** with parallax banner
- **Bottom Sheet** for editing (not Dialog)
- **Rounded cards** with elevation
- **Chip-based** tags for genres/countries
- **Adaptive grid** for movies
- **Smooth animations** and transitions
- **FAB** for primary actions

---

## Task 1: Create UserProfilePage (Main Screen)

### Prompt cho AI Agent:

```
Tạo main page trong lib/features/profile/presentation/pages/:

File: user_profile_page.dart
---
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/error_widget.dart';
import '../../../../core/widgets/loading_widget.dart';
import '../../../../injection_container.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../bloc/profile_bloc.dart';
import '../bloc/profile_event.dart';
import '../bloc/profile_state.dart';
import '../widgets/profile_header.dart';
import '../widgets/stats_cards.dart';
import '../widgets/preference_section.dart';
import '../widgets/saved_movies_section.dart';
import '../widgets/watch_history_section.dart';

class UserProfilePage extends StatelessWidget {
  const UserProfilePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get current user from AuthBloc
    final authState = context.watch<AuthBloc>().state;
    final user = authState is AuthAuthenticated ? authState.user : null;

    if (user == null) {
      // Show guest state or redirect to login
      return _GuestProfileView();
    }

    return BlocProvider(
      create: (_) => sl<ProfileBloc>()
        ..add(LoadProfileEvent(userId: user.id)),
      child: _AuthenticatedProfileView(userId: user.id),
    );
  }
}

class _AuthenticatedProfileView extends StatelessWidget {
  final String userId;

  const _AuthenticatedProfileView({required this.userId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<ProfileBloc, ProfileState>(
        builder: (context, state) {
          if (state is ProfileLoading) {
            return const Center(child: LoadingIndicator());
          }

          if (state is ProfileError) {
            return AppErrorWidget(
              message: state.message,
              onRetry: () => context.read<ProfileBloc>().add(
                    LoadProfileEvent(userId: userId),
                  ),
            );
          }

          if (state is ProfileLoaded) {
            return _ProfileContent(state: state, userId: userId);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}

class _ProfileContent extends StatelessWidget {
  final ProfileLoaded state;
  final String userId;

  const _ProfileContent({
    required this.state,
    required this.userId,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        context.read<ProfileBloc>().add(RefreshProfileEvent(userId: userId));

        // Wait for refresh to complete
        await context.read<ProfileBloc>().stream.firstWhere(
              (state) => state is! ProfileLoading,
            );
      },
      child: CustomScrollView(
        slivers: [
          // === COLLAPSING APP BAR WITH BANNER ===
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            stretch: true,
            backgroundColor: AppColors.surface,
            flexibleSpace: FlexibleSpaceBar(
              stretchModes: const [
                StretchMode.zoomBackground,
                StretchMode.blurBackground,
              ],
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Banner image
                  Image.network(
                    state.profile.displayBanner,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: AppColors.surfaceVariant,
                    ),
                  ),

                  // Gradient overlay
                  DecoratedBox(
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
                ],
              ),
            ),
          ),

          // === PROFILE HEADER (Pinned below AppBar) ===
          SliverToBoxAdapter(
            child: ProfileHeader(
              profile: state.profile,
              onEditPressed: () => _showEditBottomSheet(context),
            ),
          ),

          // === STATS CARDS ===
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: StatsCards(stats: state.stats),
            ),
          ),

          // === PREFERENCES (Genres & Countries) ===
          if (state.favoriteGenres.isNotEmpty || state.favoriteCountries.isNotEmpty)
            SliverToBoxAdapter(
              child: PreferenceSection(
                genres: state.favoriteGenres,
                countries: state.favoriteCountries,
              ),
            ),

          // === SAVED MOVIES ===
          if (state.savedMovies.isNotEmpty)
            SavedMoviesSection(movies: state.savedMovies),

          // === WATCH HISTORY ===
          WatchHistorySection(history: state.watchHistory),

          // Bottom padding
          const SliverToBoxAdapter(
            child: SizedBox(height: 80),
          ),
        ],
      ),
    );
  }

  void _showEditBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BlocProvider.value(
        value: context.read<ProfileBloc>(),
        child: ProfileEditSheet(
          profile: state.profile,
          userId: userId,
        ),
      ),
    );
  }
}

/// Guest profile view
class _GuestProfileView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_outline,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              'Bạn chưa đăng nhập',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Đăng nhập để lưu phim yêu thích',
              style: TextStyle(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => context.push('/auth'),
              icon: const Icon(Icons.login),
              label: const Text('Đăng nhập'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## Task 2: Create ProfileHeader Widget

### Prompt cho AI Agent:

```
Tạo header trong lib/features/profile/presentation/widgets/:

File: profile_header.dart
---
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/user_profile.dart';

class ProfileHeader extends StatelessWidget {
  final UserProfile profile;
  final VoidCallback onEditPressed;

  const ProfileHeader({
    Key? key,
    required this.profile,
    required this.onEditPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(
          bottom: BorderSide(color: AppColors.border, width: 0.5),
        ),
      ),
      child: Row(
        children: [
          // === AVATAR ===
          CircleAvatar(
            radius: 40,
            backgroundColor: AppColors.surfaceVariant,
            backgroundImage: NetworkImage(profile.displayAvatar),
          ),
          const SizedBox(width: 16),

          // === USER INFO ===
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        profile.displayName,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (profile.isVip) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Colors.amber, Colors.orange],
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'VIP',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  profile.email,
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),

          // === EDIT BUTTON ===
          IconButton.filled(
            onPressed: onEditPressed,
            icon: const Icon(LucideIcons.settings, size: 20),
            style: IconButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
```

---

## Task 3: Create StatsCards Widget

### Prompt cho AI Agent:

```
Tạo stats cards trong lib/features/profile/presentation/widgets/:

File: stats_cards.dart
---
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/user_stats.dart';

class StatsCards extends StatelessWidget {
  final UserStats stats;

  const StatsCards({Key? key, required this.stats}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Movies Watched
        Expanded(
          child: _StatCard(
            icon: LucideIcons.film,
            iconColor: Colors.red,
            backgroundColor: Colors.red.withOpacity(0.1),
            borderColor: Colors.red.withOpacity(0.3),
            value: stats.totalMoviesWatched.toString(),
            label: 'Phim',
          ),
        ),
        const SizedBox(width: 12),

        // Watch Time
        Expanded(
          child: _StatCard(
            icon: LucideIcons.clock,
            iconColor: Colors.blue,
            backgroundColor: Colors.blue.withOpacity(0.1),
            borderColor: Colors.blue.withOpacity(0.3),
            value: '${stats.watchTimeHours}h',
            label: 'Thời lượng',
          ),
        ),
        const SizedBox(width: 12),

        // Favorites
        Expanded(
          child: _StatCard(
            icon: LucideIcons.heart,
            iconColor: Colors.pink,
            backgroundColor: Colors.pink.withOpacity(0.1),
            borderColor: Colors.pink.withOpacity(0.3),
            value: stats.favoritesCount.toString(),
            label: 'Yêu thích',
          ),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color backgroundColor;
  final Color borderColor;
  final String value;
  final String label;

  const _StatCard({
    required this.icon,
    required this.iconColor,
    required this.backgroundColor,
    required this.borderColor,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        children: [
          Icon(icon, color: iconColor, size: 32),
          const SizedBox(height: 8),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
```

---

## Task 4: Create PreferenceSection Widget

### Prompt cho AI Agent:

```
Tạo preferences trong lib/features/profile/presentation/widgets/:

File: preference_section.dart
---
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/preference.dart';

class PreferenceSection extends StatelessWidget {
  final List<Preference> genres;
  final List<Preference> countries;

  const PreferenceSection({
    Key? key,
    required this.genres,
    required this.countries,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Genres
          if (genres.isNotEmpty) ...[
            _PreferenceCard(
              icon: LucideIcons.barChart3,
              iconColor: Colors.purple,
              backgroundColor: Colors.purple.withOpacity(0.1),
              borderColor: Colors.purple.withOpacity(0.3),
              title: 'Thể loại yêu thích',
              subtitle: '${genres.length} thể loại',
              preferences: genres,
              chipColor: Colors.purple,
            ),
            const SizedBox(height: 16),
          ],

          // Countries
          if (countries.isNotEmpty)
            _PreferenceCard(
              icon: LucideIcons.globe,
              iconColor: Colors.cyan,
              backgroundColor: Colors.cyan.withOpacity(0.1),
              borderColor: Colors.cyan.withOpacity(0.3),
              title: 'Quốc gia yêu thích',
              subtitle: '${countries.length} quốc gia',
              preferences: countries,
              chipColor: Colors.cyan,
            ),
        ],
      ),
    );
  }
}

class _PreferenceCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color backgroundColor;
  final Color borderColor;
  final String title;
  final String subtitle;
  final List<Preference> preferences;
  final Color chipColor;

  const _PreferenceCard({
    required this.icon,
    required this.iconColor,
    required this.backgroundColor,
    required this.borderColor,
    required this.title,
    required this.subtitle,
    required this.preferences,
    required this.chipColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Chips
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: preferences.map((pref) {
              return Chip(
                label: Text(
                  pref.name,
                  style: TextStyle(
                    fontSize: 12,
                    color: chipColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                backgroundColor: chipColor.withOpacity(0.1),
                side: BorderSide(color: chipColor.withOpacity(0.5)),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
```

---

## Task 5: Create SavedMoviesSection Widget

### Prompt cho AI Agent:

```
Tạo saved movies trong lib/features/profile/presentation/widgets/:

File: saved_movies_section.dart
---
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/image_url_helper.dart';
import '../../../../core/widgets/cached_image.dart';
import '../../../movie/domain/entities/movie_entity.dart';

class SavedMoviesSection extends StatelessWidget {
  final List<MovieEntity> movies;

  const SavedMoviesSection({
    Key? key,
    required this.movies,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.pink.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    LucideIcons.bookmark,
                    color: Colors.pink,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Phim đã lưu',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${movies.length} phim',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () => context.push('/saved-movies'),
                  child: const Text('Xem tất cả'),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Movies Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                childAspectRatio: 0.65,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: movies.take(6).length,
              itemBuilder: (context, index) {
                final movie = movies[index];
                return _MoviePosterCard(movie: movie);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _MoviePosterCard extends StatelessWidget {
  final MovieEntity movie;

  const _MoviePosterCard({required this.movie});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/movie/${movie.slug}'),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        clipBehavior: Clip.hardEdge,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Poster
            AppCachedImage(
              imageUrl: ImageUrlHelper.buildPosterUrl(
                movie.posterUrl,
                fallbackThumbUrl: movie.thumbUrl,
              ),
              fit: BoxFit.cover,
            ),

            // Gradient overlay
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.8),
                  ],
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
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),

            // Quality badge
            if (movie.quality != null)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    movie.qualityBadge,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
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
```

---

## Task 6: Create WatchHistorySection Widget

### Prompt cho AI Agent:

```
Similar pattern as SavedMoviesSection but using WatchHistoryItem.
Show thumbnails in horizontal scroll, display episodeDisplay text.
```

---

## Task 7: Create ProfileEditSheet (Bottom Sheet)

### Prompt cho AI Agent:

```
Tạo edit sheet trong lib/features/profile/presentation/widgets/:

File: profile_edit_sheet.dart
---
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../domain/entities/user_profile.dart';
import '../bloc/profile_bloc.dart';
import '../bloc/profile_event.dart';
import '../bloc/profile_state.dart';

class ProfileEditSheet extends StatefulWidget {
  final UserProfile profile;
  final String userId;

  const ProfileEditSheet({
    Key? key,
    required this.profile,
    required this.userId,
  }) : super(key: key);

  @override
  State<ProfileEditSheet> createState() => _ProfileEditSheetState();
}

class _ProfileEditSheetState extends State<ProfileEditSheet> {
  late TextEditingController _nameController;
  late TextEditingController _avatarController;
  late TextEditingController _bannerController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.profile.fullName);
    _avatarController = TextEditingController(text: widget.profile.avatarUrl);
    _bannerController = TextEditingController(text: widget.profile.bannerUrl);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _avatarController.dispose();
    _bannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.textMuted,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Title
              Row(
                children: [
                  const Icon(LucideIcons.settings, size: 24),
                  const SizedBox(width: 12),
                  const Text(
                    'Cài đặt hồ sơ',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(LucideIcons.x),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Form fields
              _TextField(
                controller: _nameController,
                label: 'Tên hiển thị',
                icon: LucideIcons.user,
              ),
              const SizedBox(height: 16),
              _TextField(
                controller: _avatarController,
                label: 'Avatar URL',
                icon: LucideIcons.image,
              ),
              const SizedBox(height: 16),
              _TextField(
                controller: _bannerController,
                label: 'Banner URL',
                icon: LucideIcons.layout,
              ),
              const SizedBox(height: 24),

              // Buttons
              Row(
                children: [
                  // Logout button
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _handleLogout(context),
                      icon: const Icon(LucideIcons.logOut),
                      label: const Text('Đăng xuất'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: const BorderSide(color: Colors.red),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Save button
                  Expanded(
                    child: BlocConsumer<ProfileBloc, ProfileState>(
                      listener: (context, state) {
                        if (state is ProfileLoaded) {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Đã cập nhật hồ sơ'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        } else if (state is ProfileError) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(state.message),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      builder: (context, state) {
                        final isUpdating = state is ProfileUpdating;

                        return ElevatedButton.icon(
                          onPressed: isUpdating ? null : () => _handleSave(context),
                          icon: isUpdating
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Icon(LucideIcons.save),
                          label: Text(isUpdating ? 'Đang lưu...' : 'Lưu'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleSave(BuildContext context) {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Tên hiển thị không được để trống')),
      );
      return;
    }

    context.read<ProfileBloc>().add(UpdateProfileEvent(
          userId: widget.userId,
          fullName: name,
          avatarUrl: _avatarController.text.trim(),
          bannerUrl: _bannerController.text.trim(),
        ));
  }

  void _handleLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Đăng xuất'),
        content: const Text('Bạn có chắc muốn đăng xuất?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              Navigator.pop(context);
              context.read<AuthBloc>().add(SignOutEvent());
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Đăng xuất'),
          ),
        ],
      ),
    );
  }
}

class _TextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final IconData icon;

  const _TextField({
    required this.controller,
    required this.label,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, size: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: AppColors.surfaceVariant,
      ),
    );
  }
}
```

---

## Task 8: Add Route to app_router.dart

### Prompt cho AI Agent:

```
Add to lib/routes/app_router.dart:

GoRoute(
  path: '/profile',
  name: 'profile',
  builder: (context, state) => const UserProfilePage(),
),
```

---

## ✅ Complete Checklist

- [ ] UserProfilePage với CustomScrollView
- [ ] SliverAppBar với parallax banner
- [ ] ProfileHeader với avatar & edit button
- [ ] StatsCards responsive
- [ ] PreferenceSection với chips
- [ ] SavedMoviesSection với grid
- [ ] WatchHistorySection
- [ ] ProfileEditSheet (Bottom Sheet)
- [ ] Logout confirmation dialog
- [ ] Guest profile view
- [ ] Pull-to-refresh
- [ ] Loading states với skeleton
- [ ] Error states với retry
- [ ] Route registered

---

## 🎨 Final Styling Tips

### Animations

```dart
// Fade in animation for cards
TweenAnimationBuilder(
  tween: Tween<double>(begin: 0, end: 1),
  duration: const Duration(milliseconds: 500),
  builder: (context, value, child) {
    return Opacity(
      opacity: value,
      child: Transform.translate(
        offset: Offset(0, 20 * (1 - value)),
        child: child,
      ),
    );
  },
  child: StatsCards(...),
);
```

### Responsive Layout

```dart
LayoutBuilder(
  builder: (context, constraints) {
    final crossAxisCount = constraints.maxWidth > 600 ? 5 : 3;
    return GridView.builder(...);
  },
);
```

---

**Hoàn thành!** Bạn đã có đầy đủ Profile feature theo style AniYomi. 🎉
