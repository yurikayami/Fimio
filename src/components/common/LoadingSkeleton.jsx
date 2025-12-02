export const LoadingSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-secondary rounded-lg overflow-hidden border border-slate-700 animate-pulse"
        >
          <div className="pb-[150%] bg-slate-700 relative">
            <div className="absolute top-2 left-2 h-6 w-16 bg-slate-600 rounded" />
            <div className="absolute top-2 right-2 h-6 w-20 bg-slate-600 rounded" />
            <div className="absolute bottom-4 left-3 right-3">
              <div className="h-4 bg-slate-600 rounded mb-2" />
              <div className="h-3 bg-slate-600 rounded w-3/4 mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-secondary rounded-lg overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-slate-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <div className="h-8 bg-slate-600 rounded w-2/3 mb-4" />
        <div className="h-4 bg-slate-600 rounded w-1/2 mb-6" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-slate-600 rounded" />
          <div className="h-10 w-32 bg-slate-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster skeleton */}
        <div className="w-full md:w-1/3">
          <div className="pb-[150%] bg-slate-700 rounded-lg" />
        </div>

        {/* Details skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-10 bg-slate-700 rounded w-3/4" />
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-slate-700 rounded" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
          </div>

          <div className="flex gap-2 pt-4">
            <div className="h-12 w-40 bg-slate-700 rounded" />
            <div className="h-12 w-40 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
