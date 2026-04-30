'use client';

export function SkeletonLoader() {
  return (
    <div className="w-full h-64 bg-white rounded-lg border border-gray-200 p-6 shadow-sm overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>

        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
