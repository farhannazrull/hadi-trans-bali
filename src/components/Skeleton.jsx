'use client';

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <div className="relative h-[70vh] min-h-[500px] bg-gray-100">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-100" />
    <div className="relative h-full flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-12 w-80 mx-auto" />
        <Skeleton className="h-6 w-64 mx-auto" />
        <div className="flex gap-4 justify-center mt-6">
          <Skeleton className="h-12 w-36 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Card skeleton
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  </div>
);

// Section skeleton
export const SectionSkeleton = () => (
  <div className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12 space-y-3">
        <Skeleton className="h-4 w-24 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  </div>
);

// Full page skeleton
export const PageSkeleton = () => (
  <div className="min-h-screen bg-white">
    <HeroSkeleton />
    <SectionSkeleton />
  </div>
);

// Navbar skeleton
export const NavSkeleton = () => (
  <div className="h-16 bg-white border-b border-gray-100 px-4">
    <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <div className="hidden md:flex gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-24 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
