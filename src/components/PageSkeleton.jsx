import React from 'react';

export const PageSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-8 w-1/3 max-w-[250px] bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-2/3 max-w-[400px] bg-slate-800/50 rounded-lg"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-900/80 border border-white/5 rounded-3xl p-6 h-32 flex justify-between items-center">
            <div className="flex flex-col gap-3 w-full">
               <div className="h-3 w-24 bg-slate-800 rounded"></div>
               <div className="h-8 w-16 bg-slate-700 rounded"></div>
            </div>
            <div className="h-12 w-12 bg-slate-800 rounded-2xl shrink-0"></div>
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex justify-between items-center">
           <div className="h-10 w-64 bg-slate-800/80 rounded-xl"></div>
           <div className="h-10 w-32 bg-slate-800/80 rounded-xl"></div>
        </div>
        <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-6 min-h-[400px]">
          <div className="flex flex-col gap-4">
             <div className="h-8 w-full bg-slate-800/80 rounded-xl mb-4"></div>
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="h-12 w-full bg-slate-800/40 rounded-xl"></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
