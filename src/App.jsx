import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageLoadingFallback } from '@/components/common/LazyLoadHelpers';
import { UpdateDialog } from '@/components/common/UpdateDialog';

// Landing page loaded eagerly
import { Landing } from '@/pages/Landing';

// Code Splitting: Lazy load all route pages
// Home is loaded eagerly since it's the landing page (LCP critical)
import { Home } from '@/pages/Home';

// Lazy load non-critical routes to reduce initial bundle size
const Search = lazy(() => import('@/pages/Search').then(m => ({ default: m.Search })));
const Explore = lazy(() => import('@/pages/Explore').then(m => ({ default: m.Explore })));
const MovieDetail = lazy(() => import('@/pages/MovieDetail').then(m => ({ default: m.MovieDetail })));
const SavedMovies = lazy(() => import('@/pages/SavedMovies').then(m => ({ default: m.SavedMovies })));
const WatchHistory = lazy(() => import('@/pages/WatchHistory').then(m => ({ default: m.WatchHistory })));
const UserProfile = lazy(() => import('@/pages/UserProfile').then(m => ({ default: m.UserProfile })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const FAQ = lazy(() => import('@/pages/FAQ').then(m => ({ default: m.FAQ })));
const Terms = lazy(() => import('@/pages/Terms').then(m => ({ default: m.Terms })));

import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Automatic pageview tracking for SPA route changes */}
        <RouteChangeTracker />
        {/* Update dialog for OTA updates on mobile */}
        <UpdateDialog />
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Landing page without Layout (no header/footer) */}
            <Route path="/" element={<Landing />} />

            {/* Main app routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route path="home" element={<Home />} />
              {/* All other routes are lazy loaded */}
              <Route path="search" element={<Search />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore/:page" element={<Explore />} />
              <Route path="movie/:slug" element={<MovieDetail />} />
              <Route path="saved" element={<SavedMovies />} />
              <Route path="history" element={<WatchHistory />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="about" element={<About />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

// SPA Route change tracker - sends page view events when the active route changes
function RouteChangeTracker() {
  const location = useLocation();
  useEffect(() => {
    // defer import to avoid bundling window related code on SSR or when gtag not present
    import('@/lib/tracker').then(({ pageview }) => {
      pageview(location.pathname + location.search);
    }).catch(() => { });
  }, [location]);
  return null;
}

export default App;