# 🧠 Phase 3: Business Logic (BLoC/Cubit)

## Mục Tiêu

- Tạo các BLoC/Cubit cho quản lý state
- Implement logic từ React hooks sang Dart
- Xử lý Authentication flow
- Xử lý Movie listing, detail, search
- Xử lý Library và Watch History

---

## Task 3.1: Tạo Base BLoC States

### Prompt cho AI Agent:

```
Tạo các base state classes trong lib/core/bloc/:

1. File: base_state.dart
---
import 'package:equatable/equatable.dart';

/// Base status for all async operations
enum StateStatus {
  initial,
  loading,
  success,
  failure,
}

/// Extension methods for StateStatus
extension StateStatusX on StateStatus {
  bool get isInitial => this == StateStatus.initial;
  bool get isLoading => this == StateStatus.loading;
  bool get isSuccess => this == StateStatus.success;
  bool get isFailure => this == StateStatus.failure;
}

/// Base state class with common properties
abstract class BaseState extends Equatable {
  final StateStatus status;
  final String? errorMessage;

  const BaseState({
    this.status = StateStatus.initial,
    this.errorMessage,
  });

  bool get isInitial => status.isInitial;
  bool get isLoading => status.isLoading;
  bool get isSuccess => status.isSuccess;
  bool get isFailure => status.isFailure;
}

2. File: base_cubit.dart
---
import 'package:flutter_bloc/flutter_bloc.dart';
import 'base_state.dart';

/// Base Cubit with common error handling
abstract class BaseCubit<T extends BaseState> extends Cubit<T> {
  BaseCubit(super.initialState);

  /// Emit loading state
  void emitLoading();

  /// Emit error state
  void emitError(String message);

  /// Safe emit that checks if cubit is not closed
  void safeEmit(T state) {
    if (!isClosed) {
      emit(state);
    }
  }
}
```

---

## Task 3.2: Tạo Auth BLoC

### Prompt cho AI Agent:

```
Tạo Authentication BLoC trong lib/features/auth/presentation/bloc/:

1. File: auth_event.dart
---
import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthCheckRequested extends AuthEvent {
  const AuthCheckRequested();
}

class AuthGoogleSignInRequested extends AuthEvent {
  const AuthGoogleSignInRequested();
}

class AuthEmailSignInRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthEmailSignInRequested({
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [email, password];
}

class AuthEmailSignUpRequested extends AuthEvent {
  final String email;
  final String password;
  final String fullName;

  const AuthEmailSignUpRequested({
    required this.email,
    required this.password,
    required this.fullName,
  });

  @override
  List<Object?> get props => [email, password, fullName];
}

class AuthSignOutRequested extends AuthEvent {
  const AuthSignOutRequested();
}

class AuthUserChanged extends AuthEvent {
  final dynamic user; // UserEntity or null

  const AuthUserChanged(this.user);

  @override
  List<Object?> get props => [user];
}

2. File: auth_state.dart
---
import 'package:equatable/equatable.dart';
import '../../domain/entities/user_entity.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthState extends Equatable {
  final AuthStatus status;
  final UserEntity? user;
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.errorMessage,
  });

  const AuthState.initial() : this();

  const AuthState.loading() : this(status: AuthStatus.loading);

  const AuthState.authenticated(UserEntity user)
      : this(status: AuthStatus.authenticated, user: user);

  const AuthState.unauthenticated()
      : this(status: AuthStatus.unauthenticated);

  const AuthState.error(String message)
      : this(status: AuthStatus.error, errorMessage: message);

  @override
  List<Object?> get props => [status, user, errorMessage];

  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isUnauthenticated => status == AuthStatus.unauthenticated;
  bool get isLoading => status == AuthStatus.loading;

  AuthState copyWith({
    AuthStatus? status,
    UserEntity? user,
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

3. File: auth_bloc.dart
---
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  StreamSubscription<dynamic>? _authSubscription;

  AuthBloc({required AuthRepository authRepository})
      : _authRepository = authRepository,
        super(const AuthState.initial()) {
    on<AuthCheckRequested>(_onCheckRequested);
    on<AuthGoogleSignInRequested>(_onGoogleSignIn);
    on<AuthEmailSignInRequested>(_onEmailSignIn);
    on<AuthEmailSignUpRequested>(_onEmailSignUp);
    on<AuthSignOutRequested>(_onSignOut);
    on<AuthUserChanged>(_onUserChanged);

    // Listen to auth state changes
    _authSubscription = _authRepository.authStateChanges.listen((user) {
      add(AuthUserChanged(user));
    });
  }

  Future<void> _onCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await _authRepository.getCurrentUser();

    result.fold(
      (failure) => emit(const AuthState.unauthenticated()),
      (user) {
        if (user != null) {
          emit(AuthState.authenticated(user));
        } else {
          emit(const AuthState.unauthenticated());
        }
      },
    );
  }

  Future<void> _onGoogleSignIn(
    AuthGoogleSignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await _authRepository.signInWithGoogle();

    result.fold(
      (failure) => emit(AuthState.error(failure.message)),
      (user) => emit(AuthState.authenticated(user)),
    );
  }

  Future<void> _onEmailSignIn(
    AuthEmailSignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await _authRepository.signInWithEmail(
      email: event.email,
      password: event.password,
    );

    result.fold(
      (failure) => emit(AuthState.error(failure.message)),
      (user) => emit(AuthState.authenticated(user)),
    );
  }

  Future<void> _onEmailSignUp(
    AuthEmailSignUpRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await _authRepository.signUpWithEmail(
      email: event.email,
      password: event.password,
      fullName: event.fullName,
    );

    result.fold(
      (failure) => emit(AuthState.error(failure.message)),
      (user) => emit(AuthState.authenticated(user)),
    );
  }

  Future<void> _onSignOut(
    AuthSignOutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await _authRepository.signOut();

    result.fold(
      (failure) => emit(AuthState.error(failure.message)),
      (_) => emit(const AuthState.unauthenticated()),
    );
  }

  void _onUserChanged(
    AuthUserChanged event,
    Emitter<AuthState> emit,
  ) {
    if (event.user != null) {
      emit(AuthState.authenticated(event.user));
    } else {
      emit(const AuthState.unauthenticated());
    }
  }

  @override
  Future<void> close() {
    _authSubscription?.cancel();
    return super.close();
  }
}
```

---

## Task 3.3: Tạo Home Cubit

### Prompt cho AI Agent:

```
Tạo Home Cubit trong lib/features/home/presentation/cubit/:

1. File: home_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../../core/bloc/base_state.dart';
import '../../../movie/domain/entities/movie_entity.dart';

class HomeState extends Equatable {
  final StateStatus status;
  final String? errorMessage;

  // Hero section
  final List<MovieEntity> heroMovies;

  // Movie sections
  final List<MovieEntity> latestMovies;
  final List<MovieEntity> koreaMovies;
  final List<MovieEntity> seriesMovies;
  final List<MovieEntity> singleMovies;
  final List<MovieEntity> cartoonMovies;
  final List<MovieEntity> animeMovies;
  final List<MovieEntity> actionMovies;
  final List<MovieEntity> romanceMovies;
  final List<MovieEntity> top10Movies;

  const HomeState({
    this.status = StateStatus.initial,
    this.errorMessage,
    this.heroMovies = const [],
    this.latestMovies = const [],
    this.koreaMovies = const [],
    this.seriesMovies = const [],
    this.singleMovies = const [],
    this.cartoonMovies = const [],
    this.animeMovies = const [],
    this.actionMovies = const [],
    this.romanceMovies = const [],
    this.top10Movies = const [],
  });

  @override
  List<Object?> get props => [
        status,
        errorMessage,
        heroMovies,
        latestMovies,
        koreaMovies,
        seriesMovies,
        singleMovies,
        cartoonMovies,
        animeMovies,
        actionMovies,
        romanceMovies,
        top10Movies,
      ];

  bool get isLoading => status == StateStatus.loading;
  bool get isSuccess => status == StateStatus.success;
  bool get isFailure => status == StateStatus.failure;
  bool get hasData => latestMovies.isNotEmpty;

  HomeState copyWith({
    StateStatus? status,
    String? errorMessage,
    List<MovieEntity>? heroMovies,
    List<MovieEntity>? latestMovies,
    List<MovieEntity>? koreaMovies,
    List<MovieEntity>? seriesMovies,
    List<MovieEntity>? singleMovies,
    List<MovieEntity>? cartoonMovies,
    List<MovieEntity>? animeMovies,
    List<MovieEntity>? actionMovies,
    List<MovieEntity>? romanceMovies,
    List<MovieEntity>? top10Movies,
  }) {
    return HomeState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      heroMovies: heroMovies ?? this.heroMovies,
      latestMovies: latestMovies ?? this.latestMovies,
      koreaMovies: koreaMovies ?? this.koreaMovies,
      seriesMovies: seriesMovies ?? this.seriesMovies,
      singleMovies: singleMovies ?? this.singleMovies,
      cartoonMovies: cartoonMovies ?? this.cartoonMovies,
      animeMovies: animeMovies ?? this.animeMovies,
      actionMovies: actionMovies ?? this.actionMovies,
      romanceMovies: romanceMovies ?? this.romanceMovies,
      top10Movies: top10Movies ?? this.top10Movies,
    );
  }
}

2. File: home_cubit.dart
---
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/bloc/base_state.dart';
import '../../../movie/domain/usecases/get_latest_movies.dart';
import '../../../movie/domain/usecases/get_movies_by_type.dart';
import 'home_state.dart';

class HomeCubit extends Cubit<HomeState> {
  final GetLatestMovies _getLatestMovies;
  final GetMoviesByType _getMoviesByType;

  HomeCubit({
    required GetLatestMovies getLatestMovies,
    required GetMoviesByType getMoviesByType,
  })  : _getLatestMovies = getLatestMovies,
        _getMoviesByType = getMoviesByType,
        super(const HomeState());

  Future<void> loadHomeData() async {
    emit(state.copyWith(status: StateStatus.loading));

    try {
      // Fetch all sections in parallel
      final results = await Future.wait([
        _getLatestMovies(page: 1),
        _getMoviesByType(const MovieTypeParams(
          typeList: 'phim-bo',
          country: 'han-quoc',
          limit: 10,
        )),
        _getMoviesByType(const MovieTypeParams(
          typeList: 'hoat-hinh',
          country: 'nhat-ban',
          limit: 10,
        )),
        _getMoviesByType(const MovieTypeParams(
          typeList: 'phim-le',
          limit: 4,
        )),
        _getMoviesByType(const MovieTypeParams(
          typeList: 'hoat-hinh',
          limit: 12,
        )),
        _getMoviesByType(const MovieTypeParams(
          typeList: 'phim-bo',
          category: 'hanh-dong',
          limit: 10,
        )),
        _getMoviesByType(const MovieTypeParams(
          typeList: 'phim-bo',
          category: 'tinh-cam',
          limit: 10,
        )),
      ]);

      final latestResult = results[0];
      final koreaResult = results[1];
      final animeResult = results[2];
      final singleResult = results[3];
      final cartoonResult = results[4];
      final actionResult = results[5];
      final romanceResult = results[6];

      // Extract movies from results
      final latestMovies = latestResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      final koreaMovies = koreaResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      final animeMovies = animeResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      final singleMovies = singleResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      final cartoonMovies = cartoonResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      final actionMovies = actionResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      final romanceMovies = romanceResult.fold(
        (failure) => <dynamic>[],
        (movieList) => movieList.movies,
      );

      emit(state.copyWith(
        status: StateStatus.success,
        heroMovies: latestMovies.take(5).toList(),
        latestMovies: latestMovies,
        koreaMovies: koreaMovies,
        seriesMovies: animeMovies,
        singleMovies: singleMovies,
        cartoonMovies: cartoonMovies,
        animeMovies: animeMovies,
        actionMovies: actionMovies,
        romanceMovies: romanceMovies,
        top10Movies: latestMovies.take(10).toList(),
      ));
    } catch (e) {
      emit(state.copyWith(
        status: StateStatus.failure,
        errorMessage: 'Có lỗi xảy ra khi tải dữ liệu: $e',
      ));
    }
  }

  Future<void> refresh() async {
    await loadHomeData();
  }
}
```

---

## Task 3.4: Tạo Movie Detail Cubit

### Prompt cho AI Agent:

```
Tạo Movie Detail Cubit trong lib/features/movie/presentation/cubit/:

1. File: movie_detail_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/entities/movie_entity.dart';
import '../../domain/entities/episode_entity.dart';

class MovieDetailState extends Equatable {
  final StateStatus status;
  final String? errorMessage;
  final MovieEntity? movie;
  final EpisodeEntity? currentEpisode;
  final String? currentEpisodeUrl;
  final bool isSaved;
  final bool isSaving;

  const MovieDetailState({
    this.status = StateStatus.initial,
    this.errorMessage,
    this.movie,
    this.currentEpisode,
    this.currentEpisodeUrl,
    this.isSaved = false,
    this.isSaving = false,
  });

  @override
  List<Object?> get props => [
        status,
        errorMessage,
        movie,
        currentEpisode,
        currentEpisodeUrl,
        isSaved,
        isSaving,
      ];

  bool get isLoading => status == StateStatus.loading;
  bool get isSuccess => status == StateStatus.success;
  bool get isFailure => status == StateStatus.failure;
  bool get hasMovie => movie != null;
  bool get hasEpisodes => movie?.episodes?.isNotEmpty ?? false;

  /// Get all episodes flattened from all servers
  List<EpisodeEntity> get allEpisodes {
    if (movie?.episodes == null) return [];
    return movie!.episodes!
        .expand((server) => server.episodes)
        .toList();
  }

  MovieDetailState copyWith({
    StateStatus? status,
    String? errorMessage,
    MovieEntity? movie,
    EpisodeEntity? currentEpisode,
    String? currentEpisodeUrl,
    bool? isSaved,
    bool? isSaving,
  }) {
    return MovieDetailState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      movie: movie ?? this.movie,
      currentEpisode: currentEpisode ?? this.currentEpisode,
      currentEpisodeUrl: currentEpisodeUrl ?? this.currentEpisodeUrl,
      isSaved: isSaved ?? this.isSaved,
      isSaving: isSaving ?? this.isSaving,
    );
  }
}

2. File: movie_detail_cubit.dart
---
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/entities/episode_entity.dart';
import '../../domain/usecases/get_movie_details.dart';
import '../../../library/domain/repositories/library_repository.dart';
import '../../../history/domain/repositories/watch_history_repository.dart';
import 'movie_detail_state.dart';

class MovieDetailCubit extends Cubit<MovieDetailState> {
  final GetMovieDetails _getMovieDetails;
  final LibraryRepository _libraryRepository;
  final WatchHistoryRepository _historyRepository;
  final String? _userId;

  MovieDetailCubit({
    required GetMovieDetails getMovieDetails,
    required LibraryRepository libraryRepository,
    required WatchHistoryRepository historyRepository,
    String? userId,
  })  : _getMovieDetails = getMovieDetails,
        _libraryRepository = libraryRepository,
        _historyRepository = historyRepository,
        _userId = userId,
        super(const MovieDetailState());

  Future<void> loadMovie(String slug) async {
    emit(state.copyWith(status: StateStatus.loading));

    final result = await _getMovieDetails(slug);

    await result.fold(
      (failure) async {
        emit(state.copyWith(
          status: StateStatus.failure,
          errorMessage: failure.message,
        ));
      },
      (movie) async {
        // Auto-select first episode if available
        EpisodeEntity? firstEpisode;
        String? firstEpisodeUrl;

        if (movie.episodes != null && movie.episodes!.isNotEmpty) {
          final firstServer = movie.episodes!.first;
          if (firstServer.episodes.isNotEmpty) {
            firstEpisode = firstServer.episodes.first;
            firstEpisodeUrl = firstEpisode.playableUrl;
          }
        }

        emit(state.copyWith(
          status: StateStatus.success,
          movie: movie,
          currentEpisode: firstEpisode,
          currentEpisodeUrl: firstEpisodeUrl,
        ));

        // Check if movie is saved
        await _checkIfSaved(slug);

        // Add to history if user is logged in
        await _addToHistory();
      },
    );
  }

  Future<void> _checkIfSaved(String slug) async {
    if (_userId == null) return;

    final result = await _libraryRepository.isMovieSaved(
      userId: _userId!,
      movieSlug: slug,
    );

    result.fold(
      (_) {},
      (isSaved) => emit(state.copyWith(isSaved: isSaved)),
    );
  }

  Future<void> _addToHistory() async {
    if (_userId == null || state.movie == null) return;

    await _historyRepository.addToHistory(
      userId: _userId!,
      movie: state.movie!,
      episodeName: state.currentEpisode?.name,
    );
  }

  void selectEpisode(EpisodeEntity episode) {
    emit(state.copyWith(
      currentEpisode: episode,
      currentEpisodeUrl: episode.playableUrl,
    ));

    // Update history with new episode
    _addToHistory();
  }

  Future<void> toggleSave() async {
    if (_userId == null || state.movie == null) return;

    emit(state.copyWith(isSaving: true));

    if (state.isSaved) {
      // Remove from library
      final result = await _libraryRepository.removeFromLibrary(
        userId: _userId!,
        movieSlug: state.movie!.slug,
      );

      result.fold(
        (failure) => emit(state.copyWith(isSaving: false)),
        (_) => emit(state.copyWith(isSaved: false, isSaving: false)),
      );
    } else {
      // Add to library
      final result = await _libraryRepository.addToLibrary(
        userId: _userId!,
        movie: state.movie!,
      );

      result.fold(
        (failure) => emit(state.copyWith(isSaving: false)),
        (_) => emit(state.copyWith(isSaved: true, isSaving: false)),
      );
    }
  }
}
```

---

## Task 3.5: Tạo Explore Cubit

### Prompt cho AI Agent:

```
Tạo Explore Cubit trong lib/features/explore/presentation/cubit/:

1. File: explore_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../../core/bloc/base_state.dart';
import '../../../movie/domain/entities/movie_entity.dart';
import '../../../movie/domain/entities/pagination_entity.dart';
import '../../../movie/domain/entities/category_entity.dart';
import '../../../movie/domain/entities/country_entity.dart';

class ExploreFilters extends Equatable {
  final String typeList;
  final String? category;
  final String? country;
  final String? year;
  final String sortType;

  const ExploreFilters({
    this.typeList = 'phim-le',
    this.category,
    this.country,
    this.year,
    this.sortType = 'desc',
  });

  @override
  List<Object?> get props => [typeList, category, country, year, sortType];

  ExploreFilters copyWith({
    String? typeList,
    String? category,
    String? country,
    String? year,
    String? sortType,
  }) {
    return ExploreFilters(
      typeList: typeList ?? this.typeList,
      category: category ?? this.category,
      country: country ?? this.country,
      year: year ?? this.year,
      sortType: sortType ?? this.sortType,
    );
  }

  ExploreFilters clearFilters() {
    return ExploreFilters(typeList: typeList);
  }
}

class ExploreState extends Equatable {
  final StateStatus status;
  final String? errorMessage;
  final List<MovieEntity> movies;
  final PaginationEntity? pagination;
  final int currentPage;
  final ExploreFilters filters;

  // Filter options
  final List<CategoryEntity> categories;
  final List<CountryEntity> countries;

  const ExploreState({
    this.status = StateStatus.initial,
    this.errorMessage,
    this.movies = const [],
    this.pagination,
    this.currentPage = 1,
    this.filters = const ExploreFilters(),
    this.categories = const [],
    this.countries = const [],
  });

  @override
  List<Object?> get props => [
        status,
        errorMessage,
        movies,
        pagination,
        currentPage,
        filters,
        categories,
        countries,
      ];

  bool get isLoading => status == StateStatus.loading;
  bool get isSuccess => status == StateStatus.success;
  bool get isFailure => status == StateStatus.failure;
  bool get hasMovies => movies.isNotEmpty;
  bool get hasFilters =>
      filters.category != null ||
      filters.country != null ||
      filters.year != null;

  int get totalPages => pagination?.totalPages ?? 1;

  ExploreState copyWith({
    StateStatus? status,
    String? errorMessage,
    List<MovieEntity>? movies,
    PaginationEntity? pagination,
    int? currentPage,
    ExploreFilters? filters,
    List<CategoryEntity>? categories,
    List<CountryEntity>? countries,
  }) {
    return ExploreState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      movies: movies ?? this.movies,
      pagination: pagination ?? this.pagination,
      currentPage: currentPage ?? this.currentPage,
      filters: filters ?? this.filters,
      categories: categories ?? this.categories,
      countries: countries ?? this.countries,
    );
  }
}

2. File: explore_cubit.dart
---
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/bloc/base_state.dart';
import '../../../movie/domain/usecases/get_movies_by_type.dart';
import '../../../movie/domain/usecases/get_categories.dart';
import '../../../movie/domain/usecases/get_countries.dart';
import 'explore_state.dart';

class ExploreCubit extends Cubit<ExploreState> {
  final GetMoviesByType _getMoviesByType;
  final GetCategories _getCategories;
  final GetCountries _getCountries;

  ExploreCubit({
    required GetMoviesByType getMoviesByType,
    required GetCategories getCategories,
    required GetCountries getCountries,
  })  : _getMoviesByType = getMoviesByType,
        _getCategories = getCategories,
        _getCountries = getCountries,
        super(const ExploreState());

  Future<void> initialize({String? category, String? country}) async {
    // Load filter options
    await _loadFilterOptions();

    // Set initial filters from URL params
    if (category != null || country != null) {
      emit(state.copyWith(
        filters: state.filters.copyWith(
          category: category,
          country: country,
        ),
      ));
    }

    // Load movies
    await loadMovies();
  }

  Future<void> _loadFilterOptions() async {
    final categoriesResult = await _getCategories();
    final countriesResult = await _getCountries();

    final categories = categoriesResult.fold(
      (_) => <dynamic>[],
      (list) => list,
    );

    final countries = countriesResult.fold(
      (_) => <dynamic>[],
      (list) => list,
    );

    emit(state.copyWith(
      categories: categories,
      countries: countries,
    ));
  }

  Future<void> loadMovies({bool resetPage = true}) async {
    if (resetPage) {
      emit(state.copyWith(currentPage: 1, status: StateStatus.loading));
    } else {
      emit(state.copyWith(status: StateStatus.loading));
    }

    final result = await _getMoviesByType(MovieTypeParams(
      typeList: state.filters.typeList,
      page: state.currentPage,
      limit: 30,
      category: state.filters.category,
      country: state.filters.country,
      year: state.filters.year,
      sortField: 'modified.time',
      sortType: state.filters.sortType,
    ));

    result.fold(
      (failure) {
        emit(state.copyWith(
          status: StateStatus.failure,
          errorMessage: failure.message,
        ));
      },
      (movieList) {
        emit(state.copyWith(
          status: StateStatus.success,
          movies: movieList.movies,
          pagination: movieList.pagination,
        ));
      },
    );
  }

  void updateFilters(ExploreFilters filters) {
    emit(state.copyWith(filters: filters));
    loadMovies(resetPage: true);
  }

  void setTypeList(String typeList) {
    emit(state.copyWith(
      filters: state.filters.copyWith(typeList: typeList),
    ));
    loadMovies(resetPage: true);
  }

  void setCategory(String? category) {
    emit(state.copyWith(
      filters: state.filters.copyWith(category: category),
    ));
    loadMovies(resetPage: true);
  }

  void setCountry(String? country) {
    emit(state.copyWith(
      filters: state.filters.copyWith(country: country),
    ));
    loadMovies(resetPage: true);
  }

  void setYear(String? year) {
    emit(state.copyWith(
      filters: state.filters.copyWith(year: year),
    ));
    loadMovies(resetPage: true);
  }

  void setSortType(String sortType) {
    emit(state.copyWith(
      filters: state.filters.copyWith(sortType: sortType),
    ));
    loadMovies(resetPage: true);
  }

  void clearFilters() {
    emit(state.copyWith(
      filters: state.filters.clearFilters(),
    ));
    loadMovies(resetPage: true);
  }

  void goToPage(int page) {
    emit(state.copyWith(currentPage: page));
    loadMovies(resetPage: false);
  }

  void nextPage() {
    if (state.currentPage < state.totalPages) {
      goToPage(state.currentPage + 1);
    }
  }

  void previousPage() {
    if (state.currentPage > 1) {
      goToPage(state.currentPage - 1);
    }
  }
}
```

---

## Task 3.6: Tạo Search Cubit

### Prompt cho AI Agent:

```
Tạo Search Cubit trong lib/features/movie/presentation/cubit/:

1. File: search_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/entities/movie_entity.dart';
import '../../domain/entities/pagination_entity.dart';

class SearchState extends Equatable {
  final StateStatus status;
  final String? errorMessage;
  final String query;
  final List<MovieEntity> results;
  final PaginationEntity? pagination;
  final int currentPage;
  final List<String> searchHistory;

  const SearchState({
    this.status = StateStatus.initial,
    this.errorMessage,
    this.query = '',
    this.results = const [],
    this.pagination,
    this.currentPage = 1,
    this.searchHistory = const [],
  });

  @override
  List<Object?> get props => [
        status,
        errorMessage,
        query,
        results,
        pagination,
        currentPage,
        searchHistory,
      ];

  bool get isLoading => status == StateStatus.loading;
  bool get isSuccess => status == StateStatus.success;
  bool get isFailure => status == StateStatus.failure;
  bool get hasResults => results.isNotEmpty;
  bool get hasQuery => query.isNotEmpty;
  bool get showEmptyState => isSuccess && !hasResults && hasQuery;

  SearchState copyWith({
    StateStatus? status,
    String? errorMessage,
    String? query,
    List<MovieEntity>? results,
    PaginationEntity? pagination,
    int? currentPage,
    List<String>? searchHistory,
  }) {
    return SearchState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      query: query ?? this.query,
      results: results ?? this.results,
      pagination: pagination ?? this.pagination,
      currentPage: currentPage ?? this.currentPage,
      searchHistory: searchHistory ?? this.searchHistory,
    );
  }
}

2. File: search_cubit.dart
---
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/usecases/search_movies.dart';
import 'search_state.dart';

class SearchCubit extends Cubit<SearchState> {
  final SearchMovies _searchMovies;
  Timer? _debounceTimer;

  static const _debounceDuration = Duration(milliseconds: 500);

  SearchCubit({required SearchMovies searchMovies})
      : _searchMovies = searchMovies,
        super(const SearchState());

  void onQueryChanged(String query) {
    // Cancel previous timer
    _debounceTimer?.cancel();

    // Update query immediately for UI
    emit(state.copyWith(query: query));

    if (query.isEmpty) {
      emit(state.copyWith(
        status: StateStatus.initial,
        results: [],
      ));
      return;
    }

    // Debounce search
    _debounceTimer = Timer(_debounceDuration, () {
      search(query);
    });
  }

  Future<void> search(String query, {int page = 1}) async {
    if (query.isEmpty) return;

    emit(state.copyWith(
      status: StateStatus.loading,
      query: query,
      currentPage: page,
    ));

    final result = await _searchMovies(SearchParams(
      keyword: query,
      page: page,
      limit: 24,
    ));

    result.fold(
      (failure) {
        emit(state.copyWith(
          status: StateStatus.failure,
          errorMessage: failure.message,
        ));
      },
      (movieList) {
        // Add to search history
        final updatedHistory = _addToHistory(query);

        emit(state.copyWith(
          status: StateStatus.success,
          results: movieList.movies,
          pagination: movieList.pagination,
          searchHistory: updatedHistory,
        ));
      },
    );
  }

  List<String> _addToHistory(String query) {
    final history = List<String>.from(state.searchHistory);

    // Remove if already exists
    history.remove(query);

    // Add to beginning
    history.insert(0, query);

    // Keep only last 10 searches
    if (history.length > 10) {
      history.removeLast();
    }

    return history;
  }

  void clearSearch() {
    _debounceTimer?.cancel();
    emit(state.copyWith(
      status: StateStatus.initial,
      query: '',
      results: [],
    ));
  }

  void clearHistory() {
    emit(state.copyWith(searchHistory: []));
  }

  void removeFromHistory(String query) {
    final history = List<String>.from(state.searchHistory);
    history.remove(query);
    emit(state.copyWith(searchHistory: history));
  }

  void selectFromHistory(String query) {
    search(query);
  }

  void loadMoreResults() {
    if (state.pagination != null &&
        state.currentPage < (state.pagination!.totalPages)) {
      search(state.query, page: state.currentPage + 1);
    }
  }

  @override
  Future<void> close() {
    _debounceTimer?.cancel();
    return super.close();
  }
}
```

---

## Task 3.7: Tạo Library Cubit

### Prompt cho AI Agent:

```
Tạo Library Cubit trong lib/features/library/presentation/cubit/:

1. File: library_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/entities/library_item_entity.dart';

class LibraryState extends Equatable {
  final StateStatus status;
  final String? errorMessage;
  final List<LibraryItemEntity> items;
  final bool isRemoving;
  final String? removingSlug;

  const LibraryState({
    this.status = StateStatus.initial,
    this.errorMessage,
    this.items = const [],
    this.isRemoving = false,
    this.removingSlug,
  });

  @override
  List<Object?> get props => [status, errorMessage, items, isRemoving, removingSlug];

  bool get isLoading => status == StateStatus.loading;
  bool get isSuccess => status == StateStatus.success;
  bool get isFailure => status == StateStatus.failure;
  bool get isEmpty => items.isEmpty;
  int get count => items.length;

  LibraryState copyWith({
    StateStatus? status,
    String? errorMessage,
    List<LibraryItemEntity>? items,
    bool? isRemoving,
    String? removingSlug,
  }) {
    return LibraryState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      items: items ?? this.items,
      isRemoving: isRemoving ?? this.isRemoving,
      removingSlug: removingSlug,
    );
  }
}

2. File: library_cubit.dart
---
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/repositories/library_repository.dart';
import 'library_state.dart';

class LibraryCubit extends Cubit<LibraryState> {
  final LibraryRepository _repository;
  final String _userId;

  LibraryCubit({
    required LibraryRepository repository,
    required String userId,
  })  : _repository = repository,
        _userId = userId,
        super(const LibraryState());

  Future<void> loadLibrary() async {
    emit(state.copyWith(status: StateStatus.loading));

    final result = await _repository.getSavedMovies(_userId);

    result.fold(
      (failure) {
        emit(state.copyWith(
          status: StateStatus.failure,
          errorMessage: failure.message,
        ));
      },
      (items) {
        emit(state.copyWith(
          status: StateStatus.success,
          items: items,
        ));
      },
    );
  }

  Future<void> removeMovie(String movieSlug) async {
    emit(state.copyWith(isRemoving: true, removingSlug: movieSlug));

    final result = await _repository.removeFromLibrary(
      userId: _userId,
      movieSlug: movieSlug,
    );

    result.fold(
      (failure) {
        emit(state.copyWith(
          isRemoving: false,
          removingSlug: null,
          errorMessage: failure.message,
        ));
      },
      (_) {
        final updatedItems = state.items
            .where((item) => item.movie.slug != movieSlug)
            .toList();

        emit(state.copyWith(
          isRemoving: false,
          removingSlug: null,
          items: updatedItems,
        ));
      },
    );
  }

  void refresh() {
    loadLibrary();
  }
}
```

---

## Task 3.8: Tạo Watch History Cubit

### Prompt cho AI Agent:

```
Tạo Watch History Cubit trong lib/features/history/presentation/cubit/:

1. File: history_state.dart
---
import 'package:equatable/equatable.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/entities/watch_history_entity.dart';

class HistoryState extends Equatable {
  final StateStatus status;
  final String? errorMessage;
  final List<WatchHistoryEntity> items;
  final bool isRemoving;
  final int? removingId;

  const HistoryState({
    this.status = StateStatus.initial,
    this.errorMessage,
    this.items = const [],
    this.isRemoving = false,
    this.removingId,
  });

  @override
  List<Object?> get props => [status, errorMessage, items, isRemoving, removingId];

  bool get isLoading => status == StateStatus.loading;
  bool get isSuccess => status == StateStatus.success;
  bool get isFailure => status == StateStatus.failure;
  bool get isEmpty => items.isEmpty;
  int get count => items.length;

  HistoryState copyWith({
    StateStatus? status,
    String? errorMessage,
    List<WatchHistoryEntity>? items,
    bool? isRemoving,
    int? removingId,
  }) {
    return HistoryState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      items: items ?? this.items,
      isRemoving: isRemoving ?? this.isRemoving,
      removingId: removingId,
    );
  }
}

2. File: history_cubit.dart
---
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/bloc/base_state.dart';
import '../../domain/repositories/watch_history_repository.dart';
import 'history_state.dart';

class HistoryCubit extends Cubit<HistoryState> {
  final WatchHistoryRepository _repository;
  final String _userId;

  HistoryCubit({
    required WatchHistoryRepository repository,
    required String userId,
  })  : _repository = repository,
        _userId = userId,
        super(const HistoryState());

  Future<void> loadHistory() async {
    emit(state.copyWith(status: StateStatus.loading));

    final result = await _repository.getWatchHistory(_userId);

    result.fold(
      (failure) {
        emit(state.copyWith(
          status: StateStatus.failure,
          errorMessage: failure.message,
        ));
      },
      (items) {
        emit(state.copyWith(
          status: StateStatus.success,
          items: items,
        ));
      },
    );
  }

  Future<void> removeEntry(int historyId) async {
    emit(state.copyWith(isRemoving: true, removingId: historyId));

    final result = await _repository.removeFromHistory(
      userId: _userId,
      historyId: historyId,
    );

    result.fold(
      (failure) {
        emit(state.copyWith(
          isRemoving: false,
          removingId: null,
          errorMessage: failure.message,
        ));
      },
      (_) {
        final updatedItems = state.items
            .where((item) => item.id != historyId)
            .toList();

        emit(state.copyWith(
          isRemoving: false,
          removingId: null,
          items: updatedItems,
        ));
      },
    );
  }

  Future<void> clearAllHistory() async {
    emit(state.copyWith(status: StateStatus.loading));

    final result = await _repository.clearHistory(_userId);

    result.fold(
      (failure) {
        emit(state.copyWith(
          status: StateStatus.failure,
          errorMessage: failure.message,
        ));
      },
      (_) {
        emit(state.copyWith(
          status: StateStatus.success,
          items: [],
        ));
      },
    );
  }

  void refresh() {
    loadHistory();
  }
}
```

---

## Task 3.9: Cập Nhật Dependency Injection cho BLoCs

### Prompt cho AI Agent:

```
Cập nhật lib/injection_container.dart để đăng ký tất cả BLoCs/Cubits:

---
// Thêm imports cho BLoCs
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/home/presentation/cubit/home_cubit.dart';
import 'features/movie/presentation/cubit/movie_detail_cubit.dart';
import 'features/movie/presentation/cubit/search_cubit.dart';
import 'features/explore/presentation/cubit/explore_cubit.dart';
import 'features/library/presentation/cubit/library_cubit.dart';
import 'features/history/presentation/cubit/history_cubit.dart';

// Trong initDependencies(), thêm:

// ==================== BLOCS/CUBITS ====================

// Auth BLoC (global - singleton)
sl.registerLazySingleton<AuthBloc>(
  () => AuthBloc(authRepository: sl()),
);

// Home Cubit (can be recreated)
sl.registerFactory<HomeCubit>(
  () => HomeCubit(
    getLatestMovies: sl(),
    getMoviesByType: sl(),
  ),
);

// Movie Detail Cubit (factory - new instance per screen)
sl.registerFactoryParam<MovieDetailCubit, String?, void>(
  (userId, _) => MovieDetailCubit(
    getMovieDetails: sl(),
    libraryRepository: sl(),
    historyRepository: sl(),
    userId: userId,
  ),
);

// Search Cubit
sl.registerFactory<SearchCubit>(
  () => SearchCubit(searchMovies: sl()),
);

// Explore Cubit
sl.registerFactory<ExploreCubit>(
  () => ExploreCubit(
    getMoviesByType: sl(),
    getCategories: sl(),
    getCountries: sl(),
  ),
);

// Library Cubit (factory param for userId)
sl.registerFactoryParam<LibraryCubit, String, void>(
  (userId, _) => LibraryCubit(
    repository: sl(),
    userId: userId,
  ),
);

// History Cubit (factory param for userId)
sl.registerFactoryParam<HistoryCubit, String, void>(
  (userId, _) => HistoryCubit(
    repository: sl(),
    userId: userId,
  ),
);
```

---

## ✅ Checklist Phase 3

- [ ] Base BLoC states và utilities được tạo
- [ ] AuthBloc với full authentication flow
- [ ] HomeCubit load multiple movie sections
- [ ] MovieDetailCubit với episode selection và save/history
- [ ] ExploreCubit với filters và pagination
- [ ] SearchCubit với debounce và search history
- [ ] LibraryCubit quản lý saved movies
- [ ] HistoryCubit quản lý watch history
- [ ] Dependency Injection đăng ký tất cả BLoCs
- [ ] BLoC tests cơ bản (optional)

---

**Tiếp theo:** [Phase 4: UI Implementation](./04-phase-ui.md)
