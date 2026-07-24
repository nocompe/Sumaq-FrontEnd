import { FC } from 'react';

export const Skeleton: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-variant/60 rounded-lg ${className}`} />
);

/** Rejilla de tarjetas de producto (menú) */
export const CardGridSkeleton: FC<{ n?: number }> = ({ n = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} className="bg-surface-container-low rounded-3xl border border-outline-variant/30 overflow-hidden">
        <Skeleton className="h-48 rounded-none" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-between pt-3"><Skeleton className="h-6 w-16" /><Skeleton className="h-10 w-10 rounded-full" /></div>
        </div>
      </div>
    ))}
  </div>
);

/** Filas de tabla */
export const TableSkeleton: FC<{ rows?: number; cols?: number }> = ({ rows = 6, cols = 5 }) => (
  <div className="divide-y divide-outline-variant/20">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-4 px-4">
        {Array.from({ length: cols }).map((_, j) => <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-40' : 'flex-1'}`} />)}
      </div>
    ))}
  </div>
);

export default Skeleton;
