/**
 * Blog Card Skeleton Loader
 * Skeleton component inspired by BlogCard design for loading states
 */

const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .shimmer {
    animation: shimmer 2s infinite;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
  }
`;

export const BlogCardSkeleton = ({ variant = 'default' }: { variant?: 'default' | 'featured' | 'compact' | 'horizontal' }) => {
  // Featured Card Skeleton
  if (variant === 'featured') {
    return (
      <div className="block cursor-wait">
        <style>{shimmerStyles}</style>
        <article className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg">
          {/* Banner Image Skeleton */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-muted shimmer">
            <div className="w-full h-full" />
          </div>

          {/* Content Overlay Skeleton */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
            {/* Badges Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-20 h-8 rounded-full bg-muted shimmer" />
              <div className="w-24 h-8 rounded-full bg-muted shimmer" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-10 bg-muted shimmer rounded-lg w-4/5" />
              <div className="h-10 bg-muted shimmer rounded-lg w-3/5" />
            </div>

            {/* Subtitle Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-6 bg-muted shimmer rounded-lg w-full" />
              <div className="h-6 bg-muted shimmer rounded-lg w-4/5" />
            </div>

            {/* Author Section Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted shimmer flex-shrink-0" />
                <div>
                  <div className="h-5 w-32 bg-muted shimmer rounded mb-2" />
                  <div className="h-4 w-40 bg-muted shimmer rounded" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Compact Card Skeleton
  if (variant === 'compact') {
    return (
      <div className="block cursor-wait">
        <style>{shimmerStyles}</style>
        <article className="flex gap-4 p-3 rounded-xl">
          {/* Thumbnail Skeleton */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg bg-muted shimmer overflow-hidden">
            <div className="w-full h-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <div className="h-5 bg-muted shimmer rounded w-full" />
              <div className="h-4 bg-muted shimmer rounded w-4/5" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-4 w-20 bg-muted shimmer rounded" />
              <div className="h-4 w-16 bg-muted shimmer rounded" />
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Default Card Skeleton
  return (
    <div className="block cursor-wait">
      <style>{shimmerStyles}</style>
      <article className="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl shadow-lg flex flex-col h-full">
        {/* Image Section Skeleton */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted shimmer">
          <div className="w-full h-full" />
          
          {/* Premium Badge Skeleton */}
          <div className="absolute top-4 left-4">
            <div className="w-24 h-8 rounded-full bg-muted/70 shimmer" />
          </div>

          {/* Read Time Badge Skeleton - Mobile Only */}
          <div className="absolute bottom-4 right-4 sm:hidden">
            <div className="w-20 h-7 rounded-full bg-muted/70 shimmer" />
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="flex-1 p-5 sm:p-6 md:p-7 flex flex-col justify-between min-w-0">
          {/* Top Content */}
          <div>
            {/* Meta Row Skeleton */}
            <div className="flex gap-2 mb-3.5">
              <div className="h-7 w-24 rounded-full bg-muted shimmer" />
              <div className="h-7 w-20 rounded-full bg-muted shimmer hidden sm:block" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-7 bg-muted shimmer rounded w-full" />
              <div className="h-7 bg-muted shimmer rounded w-4/5" />
            </div>

            {/* Subtitle Skeleton */}
            <div className="space-y-2 mt-3">
              <div className="h-5 bg-muted shimmer rounded w-full" />
              <div className="h-5 bg-muted shimmer rounded w-4/5" />
            </div>

            {/* Content Preview Skeleton */}
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-muted shimmer rounded w-full" />
              <div className="h-4 bg-muted shimmer rounded w-full" />
            </div>
          </div>

          {/* Author Section Skeleton */}
          <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar Skeleton */}
              <div className="w-10 h-10 rounded-full bg-muted shimmer flex-shrink-0" />

              {/* Author Info Skeleton */}
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-muted shimmer rounded w-32 mb-1.5" />
                <div className="h-4 bg-muted shimmer rounded w-24" />
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="flex-shrink-0 w-16 h-9 rounded-full bg-muted shimmer" />
          </div>

          {/* Stats Row Skeleton */}
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-muted shimmer" />
                <div className="h-4 w-12 bg-muted shimmer rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-muted shimmer" />
                <div className="h-4 w-12 bg-muted shimmer rounded" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

/**
 * Skeleton Grid Component
 * Displays multiple skeleton cards in a grid layout
 */
export const BlogSkeletonGrid = ({ count = 6, variant = 'default' }: { count?: number; variant?: 'default' | 'featured' | 'compact' }) => {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-1 md:mb-2 text-center">
          <style>{shimmerStyles}</style>
          {/* <div className="inline-block mb-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="h-4 w-32 bg-muted shimmer rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-10 w-48 bg-muted shimmer rounded mx-auto" />
          </div>
          <div className="mt-4 space-y-2 max-w-2xl mx-auto">
            <div className="h-5 bg-muted shimmer rounded w-full" />
            <div className="h-5 bg-muted shimmer rounded w-5/6 mx-auto" />
          </div> */}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <BlogCardSkeleton key={i} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
};
