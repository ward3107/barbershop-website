import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  message
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className={`${sizes[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#FFD700]/20" />

        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FFD700]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Scissors className={`${iconSizes[size]} text-[#FFD700]`} />
          </motion.div>
        </div>
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Skeleton components for loading states
export function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-[#FFD700]/20 rounded-xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-zinc-800 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-5/6" />
        <div className="h-3 bg-zinc-800 rounded w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonBooking() {
  return (
    <div className="bg-zinc-900 border border-[#FFD700]/20 rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-zinc-800 rounded w-2/3" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </div>
        <div className="w-20 h-8 bg-zinc-800 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="h-3 bg-zinc-800 rounded w-16" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-zinc-800 rounded w-16" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 bg-zinc-800 rounded flex-1" />
        <div className="h-9 bg-zinc-800 rounded flex-1" />
      </div>
    </div>
  );
}

export function SkeletonGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-zinc-900 rounded-xl border border-[#FFD700]/20" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonReview() {
  return (
    <div className="bg-zinc-900 border border-[#FFD700]/20 rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-zinc-800 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-zinc-800 rounded w-32" />
            <div className="h-3 bg-zinc-800 rounded w-24" />
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-4 h-4 bg-zinc-800 rounded" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-800 rounded w-5/6" />
            <div className="h-3 bg-zinc-800 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
