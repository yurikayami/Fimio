import { Suspense } from 'react';

// Loading fallback component for route-level code splitting
export const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Đang tải...</p>
    </div>
  </div>
);

// Compact loading fallback for smaller components
export const ComponentLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

// Section loading fallback (for home page sections)
export const SectionLoadingFallback = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-48 bg-slate-800 rounded" />
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-[200px] h-[300px] bg-slate-800 rounded flex-shrink-0" />
      ))}
    </div>
  </div>
);
