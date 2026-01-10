# 🏗️ Phase 1: Foundation & Core Setup

## Mục Tiêu

- Khởi tạo dự án Flutter với cấu trúc Clean Architecture
- Thiết lập Dependency Injection (GetIt + Injectable)
- Cấu hình Routing (go_router)
- Thiết lập Theme System (Material 3)
- Kết nối Supabase

---

## Task 1.1: Khởi Tạo Dự Án Flutter

### Prompt cho AI Agent:

```
Tạo dự án Flutter mới với tên "fimio_flutter":
1. Sử dụng Flutter 3.x với Dart 3.x
2. Package name: com.fimio.app
3. Hỗ trợ platforms: Android, iOS, Web
4. Xóa code mẫu mặc định
5. Tạo cấu trúc thư mục theo Clean Architecture như sau:

lib/
├── main.dart
├── app.dart
├── injection_container.dart
├── core/
│   ├── constants/
│   ├── error/
│   ├── network/
│   ├── theme/
│   ├── utils/
│   └── widgets/
├── features/
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
│   ├── movie/
│   ├── home/
│   ├── explore/
│   ├── library/
│   ├── history/
│   └── profile/
└── routes/

Tạo file .gitkeep trong mỗi thư mục trống để Git track được.
```

---

## Task 1.2: Cài Đặt Dependencies

### Prompt cho AI Agent:

```
Cập nhật file pubspec.yaml với các dependencies sau:

name: fimio_flutter
description: Fimio - Nền tảng xem phim online miễn phí
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

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

  # Backend - Supabase
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
  google_fonts: ^6.1.0

  # Video Player
  video_player: ^2.8.2
  chewie: ^1.7.4

  # Utilities
  intl: ^0.19.0
  dartz: ^0.10.1
  url_launcher: ^6.2.2

  # Icons
  lucide_icons: ^0.257.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.8
  injectable_generator: ^2.4.1
  hive_generator: ^2.0.1
  mocktail: ^1.0.1
  bloc_test: ^9.1.5

flutter:
  uses-material-design: true

  assets:
    - assets/images/
    - assets/icons/

Sau đó chạy: flutter pub get
```

---

## Task 1.3: Thiết Lập Core Constants

### Prompt cho AI Agent:

```
Tạo các file constants trong lib/core/constants/:

1. File: api_constants.dart
---
class ApiConstants {
  ApiConstants._();

  static const String baseUrl = 'https://phimapi.com';
  static const String imageProxy = 'https://phimapi.com/image.php';
  static const String imageBaseUrl = 'https://phimimg.com';

  // Endpoints
  static const String latestMovies = '/danh-sach/phim-moi-cap-nhat';
  static const String search = '/v1/api/tim-kiem';
  static const String movieDetail = '/phim'; // + /{slug}
  static const String moviesByType = '/v1/api/danh-sach'; // + /{type}
  static const String categories = '/the-loai';
  static const String countries = '/quoc-gia';

  // Movie Types
  static const String typeSingle = 'phim-le';
  static const String typeSeries = 'phim-bo';
  static const String typeCartoon = 'hoat-hinh';
  static const String typeTvShows = 'tv-shows';

  // Pagination
  static const int defaultLimit = 24;
  static const int defaultPage = 1;
}

2. File: app_colors.dart
---
import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Colors
  static const Color primary = Color(0xFF6366F1); // Indigo
  static const Color primaryVariant = Color(0xFF4F46E5);
  static const Color accent = Color(0xFF23ADE5);

  // Background Colors (Dark Theme)
  static const Color background = Color(0xFF000000);
  static const Color surface = Color(0xFF0F0F0F);
  static const Color surfaceVariant = Color(0xFF1E1E1E);
  static const Color card = Color(0xFF1A1A2E);

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFA1A1AA);
  static const Color textMuted = Color(0xFF71717A);

  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);

  // Border Colors
  static const Color border = Color(0xFF334155);
  static const Color borderLight = Color(0xFF475569);

  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient overlayGradient = LinearGradient(
    colors: [Colors.transparent, Colors.black87],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}

3. File: app_strings.dart
---
class AppStrings {
  AppStrings._();

  // App Info
  static const String appName = 'Fimio';
  static const String appTagline = 'Xem phim online miễn phí';

  // Navigation
  static const String home = 'Trang chủ';
  static const String explore = 'Khám phá';
  static const String library = 'Kho phim';
  static const String history = 'Lịch sử';
  static const String profile = 'Hồ sơ';
  static const String search = 'Tìm kiếm';

  // Actions
  static const String save = 'Lưu phim';
  static const String saved = 'Đã lưu';
  static const String watchNow = 'Xem ngay';
  static const String trailer = 'Trailer';
  static const String retry = 'Thử lại';
  static const String cancel = 'Hủy';
  static const String confirm = 'Xác nhận';
  static const String delete = 'Xóa';

  // Auth
  static const String signIn = 'Đăng nhập';
  static const String signUp = 'Đăng ký';
  static const String signOut = 'Đăng xuất';
  static const String signInWithGoogle = 'Đăng nhập với Google';
  static const String email = 'Email';
  static const String password = 'Mật khẩu';
  static const String fullName = 'Họ và tên';

  // Filters
  static const String category = 'Thể loại';
  static const String country = 'Quốc gia';
  static const String year = 'Năm';
  static const String sort = 'Sắp xếp';
  static const String all = 'Tất cả';
  static const String newest = 'Mới nhất';
  static const String oldest = 'Cũ nhất';

  // Movie Types
  static const String singleMovie = 'Phim Lẻ';
  static const String seriesMovie = 'Phim Bộ';
  static const String cartoon = 'Hoạt Hình';
  static const String tvShows = 'TV Shows';

  // Sections
  static const String latestMovies = 'Phim Mới Cập Nhật';
  static const String top10 = 'Top 10 Phim Hot';
  static const String koreaMovies = 'Phim Hàn Quốc';
  static const String cinemaMovies = 'Phim Chiếu Rạp';
  static const String recommended = 'Đề Xuất';
  static const String trending = 'Thịnh Hành';

  // Errors
  static const String errorGeneric = 'Có lỗi xảy ra. Vui lòng thử lại.';
  static const String errorNetwork = 'Không có kết nối mạng.';
  static const String errorNotFound = 'Không tìm thấy dữ liệu.';
  static const String errorAuth = 'Vui lòng đăng nhập để tiếp tục.';

  // Empty States
  static const String emptyLibrary = 'Chưa có phim đã lưu';
  static const String emptyHistory = 'Chưa có lịch sử xem';
  static const String emptySearch = 'Không tìm thấy kết quả';
}
```

---

## Task 1.4: Thiết Lập Error Handling

### Prompt cho AI Agent:

```
Tạo các file xử lý lỗi trong lib/core/error/:

1. File: exceptions.dart
---
/// Base exception cho tất cả custom exceptions
abstract class AppException implements Exception {
  final String message;
  final String? code;

  const AppException(this.message, {this.code});

  @override
  String toString() => 'AppException: $message (code: $code)';
}

/// Server trả về response lỗi
class ServerException extends AppException {
  final int? statusCode;

  const ServerException(super.message, {super.code, this.statusCode});
}

/// Lỗi parse JSON
class ParsingException extends AppException {
  const ParsingException([String message = 'Failed to parse data'])
      : super(message);
}

/// Không có kết nối mạng
class NetworkException extends AppException {
  const NetworkException([String message = 'No internet connection'])
      : super(message);
}

/// Lỗi cache/local storage
class CacheException extends AppException {
  const CacheException([String message = 'Cache error'])
      : super(message);
}

/// Lỗi authentication
class AuthException extends AppException {
  const AuthException(super.message, {super.code});
}

/// Không tìm thấy resource
class NotFoundException extends AppException {
  const NotFoundException([String message = 'Resource not found'])
      : super(message);
}

2. File: failures.dart
---
import 'package:equatable/equatable.dart';

/// Base failure class cho Either pattern
abstract class Failure extends Equatable {
  final String message;
  final String? code;

  const Failure(this.message, {this.code});

  @override
  List<Object?> get props => [message, code];
}

class ServerFailure extends Failure {
  final int? statusCode;

  const ServerFailure(super.message, {super.code, this.statusCode});

  @override
  List<Object?> get props => [message, code, statusCode];
}

class NetworkFailure extends Failure {
  const NetworkFailure([String message = 'Không có kết nối mạng'])
      : super(message);
}

class CacheFailure extends Failure {
  const CacheFailure([String message = 'Lỗi bộ nhớ đệm'])
      : super(message);
}

class AuthFailure extends Failure {
  const AuthFailure(super.message, {super.code});
}

class NotFoundFailure extends Failure {
  const NotFoundFailure([String message = 'Không tìm thấy dữ liệu'])
      : super(message);
}

class ValidationFailure extends Failure {
  const ValidationFailure(super.message);
}

/// Helper để chuyển Exception sang Failure
Failure mapExceptionToFailure(Exception exception) {
  if (exception is ServerException) {
    return ServerFailure(exception.message, statusCode: exception.statusCode);
  } else if (exception is NetworkException) {
    return NetworkFailure(exception.message);
  } else if (exception is CacheException) {
    return CacheFailure(exception.message);
  } else if (exception is AuthException) {
    return AuthFailure(exception.message, code: exception.code);
  } else if (exception is NotFoundException) {
    return NotFoundFailure(exception.message);
  } else {
    return ServerFailure(exception.toString());
  }
}
```

---

## Task 1.5: Thiết Lập Network Layer

### Prompt cho AI Agent:

```
Tạo các file network trong lib/core/network/:

1. File: network_info.dart
---
import 'package:connectivity_plus/connectivity_plus.dart';

abstract class NetworkInfo {
  Future<bool> get isConnected;
}

class NetworkInfoImpl implements NetworkInfo {
  final Connectivity connectivity;

  NetworkInfoImpl(this.connectivity);

  @override
  Future<bool> get isConnected async {
    final result = await connectivity.checkConnectivity();
    return result != ConnectivityResult.none;
  }
}

2. File: api_client.dart
---
import 'package:dio/dio.dart';
import '../constants/api_constants.dart';
import '../error/exceptions.dart';

class ApiClient {
  late final Dio _dio;

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptors
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
  }

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  AppException _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkException('Connection timeout');
      case DioExceptionType.connectionError:
        return const NetworkException('No internet connection');
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.statusMessage ?? 'Server error';
        if (statusCode == 404) {
          return NotFoundException(message);
        }
        return ServerException(message, statusCode: statusCode);
      case DioExceptionType.cancel:
        return const ServerException('Request cancelled');
      default:
        return ServerException(error.message ?? 'Unknown error');
    }
  }
}
```

---

## Task 1.6: Thiết Lập Theme System (Material 3)

### Prompt cho AI Agent:

```
Tạo các file theme trong lib/core/theme/:

1. File: app_theme.dart
---
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

class AppTheme {
  AppTheme._();

  // Dark Theme (Default)
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.surface,
        background: AppColors.background,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
        onBackground: AppColors.textPrimary,
        onError: Colors.white,
        outline: AppColors.border,
      ),
      scaffoldBackgroundColor: AppColors.background,

      // AppBar Theme
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimary,
        ),
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),

      // Card Theme
      cardTheme: CardTheme(
        color: AppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppColors.border, width: 1),
        ),
      ),

      // Button Themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.textPrimary,
          side: const BorderSide(color: AppColors.border),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceVariant,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: GoogleFonts.inter(
          color: AppColors.textMuted,
          fontSize: 14,
        ),
      ),

      // Bottom Navigation Bar
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),

      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceVariant,
        selectedColor: AppColors.primary.withOpacity(0.2),
        labelStyle: GoogleFonts.inter(fontSize: 12),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppColors.border),
        ),
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),

      // Text Theme
      textTheme: _buildTextTheme(),
    );
  }

  // Light Theme (Optional)
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.accent,
      ),
      // ... customize for light mode if needed
    );
  }

  static TextTheme _buildTextTheme() {
    return TextTheme(
      // Display
      displayLarge: GoogleFonts.inter(
        fontSize: 57,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
      displayMedium: GoogleFonts.inter(
        fontSize: 45,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
      displaySmall: GoogleFonts.inter(
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),

      // Headline
      headlineLarge: GoogleFonts.inter(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
      headlineMedium: GoogleFonts.inter(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
      headlineSmall: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),

      // Title
      titleLarge: GoogleFonts.inter(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
      titleSmall: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),

      // Body
      bodyLarge: GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.normal,
        color: AppColors.textPrimary,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.normal,
        color: AppColors.textPrimary,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.normal,
        color: AppColors.textSecondary,
      ),

      // Label
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: AppColors.textPrimary,
      ),
      labelMedium: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: AppColors.textSecondary,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: AppColors.textMuted,
      ),
    );
  }
}
```

---

## Task 1.7: Thiết Lập Dependency Injection

### Prompt cho AI Agent:

```
Tạo file Dependency Injection trong lib/injection_container.dart:

---
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/network/api_client.dart';
import 'core/network/network_info.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // ==================== CORE ====================

  // Network
  sl.registerLazySingleton<Connectivity>(() => Connectivity());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton<ApiClient>(() => ApiClient());

  // Supabase Client (đã được khởi tạo trong main.dart)
  sl.registerLazySingleton<SupabaseClient>(() => Supabase.instance.client);

  // ==================== FEATURES ====================
  // Sẽ thêm trong Phase 2 & 3

  // Auth
  // - Data Sources
  // - Repositories
  // - Use Cases
  // - Blocs

  // Movie
  // - Data Sources
  // - Repositories
  // - Use Cases
  // - Blocs

  // Library (Saved Movies)
  // History (Watch History)
}

/// Đăng ký thêm các dependencies sau khi Supabase đã khởi tạo
void registerAuthDependencies() {
  // Sẽ implement trong Phase 2
}

void registerMovieDependencies() {
  // Sẽ implement trong Phase 2
}
```

---

## Task 1.8: Thiết Lập Routing (go_router)

### Prompt cho AI Agent:

```
Tạo file routing trong lib/routes/app_router.dart:

---
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Pages - will be created in Phase 4
// import '../features/home/presentation/pages/home_page.dart';
// import '../features/explore/presentation/pages/explore_page.dart';
// import '../features/movie/presentation/pages/movie_detail_page.dart';
// import '../features/library/presentation/pages/library_page.dart';
// import '../features/history/presentation/pages/history_page.dart';
// import '../features/profile/presentation/pages/profile_page.dart';
// import '../features/auth/presentation/pages/login_page.dart';

// Route names
class AppRoutes {
  static const String home = '/';
  static const String explore = '/explore';
  static const String movieDetail = '/movie/:slug';
  static const String library = '/library';
  static const String history = '/history';
  static const String profile = '/profile';
  static const String search = '/search';
  static const String login = '/login';
  static const String register = '/register';
}

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static GoRouter get router => _router;

  static final GoRouter _router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: AppRoutes.home,
    debugLogDiagnostics: true,

    routes: [
      // Shell Route for Bottom Navigation
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return MainShell(child: child);
        },
        routes: [
          // Home
          GoRoute(
            path: AppRoutes.home,
            name: 'home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderPage(title: 'Home'), // Replace with HomePage()
            ),
          ),

          // Explore
          GoRoute(
            path: AppRoutes.explore,
            name: 'explore',
            pageBuilder: (context, state) {
              final category = state.uri.queryParameters['category'];
              final country = state.uri.queryParameters['country'];
              return NoTransitionPage(
                child: PlaceholderPage(title: 'Explore - $category, $country'),
              );
            },
          ),

          // Library
          GoRoute(
            path: AppRoutes.library,
            name: 'library',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderPage(title: 'Library'),
            ),
          ),

          // History
          GoRoute(
            path: AppRoutes.history,
            name: 'history',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderPage(title: 'History'),
            ),
          ),

          // Profile
          GoRoute(
            path: AppRoutes.profile,
            name: 'profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderPage(title: 'Profile'),
            ),
          ),
        ],
      ),

      // Full-screen routes (outside ShellRoute)
      GoRoute(
        path: AppRoutes.movieDetail,
        name: 'movieDetail',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final slug = state.pathParameters['slug']!;
          return PlaceholderPage(title: 'Movie: $slug');
        },
      ),

      GoRoute(
        path: AppRoutes.search,
        name: 'search',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final query = state.uri.queryParameters['q'];
          return PlaceholderPage(title: 'Search: $query');
        },
      ),

      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const PlaceholderPage(title: 'Login'),
      ),

      GoRoute(
        path: AppRoutes.register,
        name: 'register',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const PlaceholderPage(title: 'Register'),
      ),
    ],

    // Error page
    errorPageBuilder: (context, state) => MaterialPage(
      child: Scaffold(
        body: Center(
          child: Text('Page not found: ${state.uri}'),
        ),
      ),
    ),
  );
}

// Temporary placeholder - will be replaced
class PlaceholderPage extends StatelessWidget {
  final String title;
  const PlaceholderPage({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text(title)),
    );
  }
}

// Main Shell with Bottom Navigation
class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: const _BottomNavBar(),
    );
  }
}

class _BottomNavBar extends StatelessWidget {
  const _BottomNavBar();

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;

    return NavigationBar(
      selectedIndex: _getSelectedIndex(location),
      onDestinationSelected: (index) => _onItemTapped(context, index),
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.home_outlined),
          selectedIcon: Icon(Icons.home),
          label: 'Trang chủ',
        ),
        NavigationDestination(
          icon: Icon(Icons.explore_outlined),
          selectedIcon: Icon(Icons.explore),
          label: 'Khám phá',
        ),
        NavigationDestination(
          icon: Icon(Icons.bookmark_outline),
          selectedIcon: Icon(Icons.bookmark),
          label: 'Kho phim',
        ),
        NavigationDestination(
          icon: Icon(Icons.history_outlined),
          selectedIcon: Icon(Icons.history),
          label: 'Lịch sử',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person),
          label: 'Hồ sơ',
        ),
      ],
    );
  }

  int _getSelectedIndex(String location) {
    if (location.startsWith('/explore')) return 1;
    if (location.startsWith('/library')) return 2;
    if (location.startsWith('/history')) return 3;
    if (location.startsWith('/profile')) return 4;
    return 0;
  }

  void _onItemTapped(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go(AppRoutes.home);
        break;
      case 1:
        context.go(AppRoutes.explore);
        break;
      case 2:
        context.go(AppRoutes.library);
        break;
      case 3:
        context.go(AppRoutes.history);
        break;
      case 4:
        context.go(AppRoutes.profile);
        break;
    }
  }
}
```

---

## Task 1.9: Thiết Lập Main Entry Point

### Prompt cho AI Agent:

```
Tạo file main.dart và app.dart:

1. File: lib/main.dart
---
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'app.dart';
import 'injection_container.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);

  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.black,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Initialize Supabase
  await Supabase.initialize(
    url: const String.fromEnvironment(
      'SUPABASE_URL',
      defaultValue: 'YOUR_SUPABASE_URL', // Replace with actual URL
    ),
    anonKey: const String.fromEnvironment(
      'SUPABASE_ANON_KEY',
      defaultValue: 'YOUR_SUPABASE_ANON_KEY', // Replace with actual key
    ),
  );

  // Initialize dependencies
  await initDependencies();

  runApp(const FimioApp());
}

2. File: lib/app.dart
---
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/theme/app_theme.dart';
import 'routes/app_router.dart';
// Import Blocs when created
// import 'features/auth/presentation/bloc/auth_bloc.dart';

class FimioApp extends StatelessWidget {
  const FimioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        // Add global BLoC providers here
        // BlocProvider<AuthBloc>(create: (_) => sl<AuthBloc>()..add(CheckAuthStatus())),
      ],
      child: MaterialApp.router(
        title: 'Fimio',
        debugShowCheckedModeBanner: false,

        // Theme
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.dark, // Default to dark

        // Router
        routerConfig: AppRouter.router,
      ),
    );
  }
}
```

---

## Task 1.10: Tạo Core Widgets Cơ Bản

### Prompt cho AI Agent:

```
Tạo các widget dùng chung trong lib/core/widgets/:

1. File: loading_widget.dart
---
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../constants/app_colors.dart';

class LoadingIndicator extends StatelessWidget {
  final double size;
  final Color? color;

  const LoadingIndicator({
    super.key,
    this.size = 40,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        strokeWidth: 3,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? AppColors.primary,
        ),
      ),
    );
  }
}

class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: Colors.black54,
            child: const Center(child: LoadingIndicator()),
          ),
      ],
    );
  }
}

class ShimmerLoading extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ShimmerLoading({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.surfaceVariant,
      highlightColor: AppColors.border,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}

class MovieCardSkeleton extends StatelessWidget {
  const MovieCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ShimmerLoading(
          width: double.infinity,
          height: 200,
          borderRadius: 12,
        ),
        SizedBox(height: 8),
        ShimmerLoading(width: 120, height: 16),
        SizedBox(height: 4),
        ShimmerLoading(width: 80, height: 12),
      ],
    );
  }
}

2. File: error_widget.dart
---
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';

class AppErrorWidget extends StatelessWidget {
  final String? message;
  final VoidCallback? onRetry;
  final IconData icon;

  const AppErrorWidget({
    super.key,
    this.message,
    this.onRetry,
    this.icon = Icons.error_outline,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 64, color: AppColors.error),
            const SizedBox(height: 16),
            Text(
              message ?? AppStrings.errorGeneric,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text(AppStrings.retry),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class EmptyStateWidget extends StatelessWidget {
  final String message;
  final IconData icon;
  final Widget? action;

  const EmptyStateWidget({
    super.key,
    required this.message,
    this.icon = Icons.inbox_outlined,
    this.action,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 64, color: AppColors.primary),
            ),
            const SizedBox(height: 24),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
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

3. File: cached_image.dart
---
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class AppCachedImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final double borderRadius;
  final Widget? placeholder;
  final Widget? errorWidget;

  const AppCachedImage({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius = 0,
    this.placeholder,
    this.errorWidget,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        width: width,
        height: height,
        fit: fit,
        placeholder: (context, url) => placeholder ?? _buildPlaceholder(),
        errorWidget: (context, url, error) => errorWidget ?? _buildError(),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: width,
      height: height,
      color: AppColors.surfaceVariant,
      child: const Center(
        child: CircularProgressIndicator(strokeWidth: 2),
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
```

---

## ✅ Checklist Phase 1

- [ ] Dự án Flutter được tạo với cấu trúc thư mục đúng
- [ ] Tất cả dependencies được cài đặt
- [ ] Constants (API, Colors, Strings) được định nghĩa
- [ ] Error handling (Exceptions, Failures) được thiết lập
- [ ] Network layer (ApiClient, NetworkInfo) hoạt động
- [ ] Theme system (Material 3 Dark) được cấu hình
- [ ] Dependency Injection (GetIt) được thiết lập
- [ ] Routing (go_router) với Bottom Navigation hoạt động
- [ ] Main entry point (main.dart, app.dart) hoàn chỉnh
- [ ] Core widgets (Loading, Error, CachedImage) sẵn sàng
- [ ] App chạy được và hiển thị placeholder pages

---

**Tiếp theo:** [Phase 2: Data & Domain Layer](./02-phase-data-domain.md)
