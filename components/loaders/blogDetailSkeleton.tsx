/**
 * Blog Detail Page Skeleton Loader
 * Skeleton component for blog/[id] page loading state
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

export const BlogDetailSkeleton = () => {
  return (
    <main className="min-h-screen bg-background">
      <style>{shimmerStyles}</style>

      {/* ── Banner Image Skeleton ── */}
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <div className="w-full h-[38vh] sm:h-[46vh] md:h-[52vh] overflow-hidden rounded-xl bg-muted shimmer" />
      </div>

      {/* ── Article wrapper ── */}
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">

        {/* ── Header ── */}
        <header className="pt-8 sm:pt-10">

          {/* Premium badge skeleton */}
          <div className="mb-5">
            <div className="inline-flex w-24 h-8 rounded-full bg-muted shimmer" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-10 bg-muted shimmer rounded-lg w-4/5" />
            <div className="h-10 bg-muted shimmer rounded-lg w-full" />
            <div className="h-10 bg-muted shimmer rounded-lg w-3/4" />
          </div>

          {/* Subtitle skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-6 bg-muted shimmer rounded-lg w-full" />
            <div className="h-6 bg-muted shimmer rounded-lg w-5/6" />
          </div>

          {/* ── Author row skeleton ── */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Avatar + name skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted shimmer flex-shrink-0" />
              <div>
                <div className="h-4 w-32 bg-muted shimmer rounded mb-2" />
                <div className="h-3 w-24 bg-muted shimmer rounded" />
              </div>
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-7 bg-border/60" />

            {/* Meta skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-3 w-32 bg-muted shimmer rounded" />
              <div className="h-3 w-24 bg-muted shimmer rounded" />
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 h-px bg-border/60" />
        </header>

        {/* ── Body skeleton with mixed content ── */}
        <div className="mt-10 space-y-8">
          {/* H2 + paragraph block */}
          <div className="space-y-4">
            <div className="h-8 w-3/5 bg-muted shimmer rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-4/5" />
            </div>
          </div>

          {/* Code block skeleton */}
          <div className="rounded-xl overflow-hidden border border-border/60">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 border-b border-border/60">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/70" />
                <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                <span className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="ml-2 h-3 w-20 bg-muted shimmer rounded" />
            </div>
            <div className="bg-muted/50 p-5 space-y-2">
              <div className="h-4 bg-muted shimmer rounded-lg w-5/6" />
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-4/5" />
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
            </div>
          </div>

          {/* H3 + paragraph block */}
          <div className="space-y-4">
            <div className="h-7 w-2/5 bg-muted shimmer rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-3/5" />
            </div>
          </div>

          {/* Image skeleton */}
          <div className="space-y-3">
            <div className="w-full h-64 rounded-2xl border border-border/40 bg-muted shimmer overflow-hidden" />
            <div className="h-3 w-2/5 bg-muted shimmer rounded-lg mx-auto" />
          </div>

          {/* Blockquote skeleton */}
          <div className="relative pl-6 pr-4 py-1">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-foreground/20" />
            <div className="space-y-2">
              <div className="h-5 bg-muted shimmer rounded-lg w-full" />
              <div className="h-5 bg-muted shimmer rounded-lg w-5/6" />
            </div>
          </div>

          {/* Numbered list skeleton */}
          <div className="pl-6 space-y-2">
            <div className="h-4 bg-muted shimmer rounded-lg w-full" />
            <div className="h-4 bg-muted shimmer rounded-lg w-full" />
            <div className="h-4 bg-muted shimmer rounded-lg w-4/5" />
          </div>

          {/* H2 + multiple paragraphs */}
          <div className="space-y-4">
            <div className="h-8 w-1/2 bg-muted shimmer rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-full" />
              <div className="h-4 bg-muted shimmer rounded-lg w-5/6" />
            </div>
          </div>

          {/* Divider skeleton */}
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-border/60" />
            <div className="flex gap-1.5">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            </div>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* Final paragraph skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-muted shimmer rounded-lg w-full" />
            <div className="h-4 bg-muted shimmer rounded-lg w-full" />
            <div className="h-4 bg-muted shimmer rounded-lg w-3/5" />
          </div>
        </div>
      </div>
    </main>
  );
};
