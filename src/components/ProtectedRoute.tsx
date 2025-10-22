// Protected Route Component
// Ensures only authenticated users can access certain routes
// Optionally requires admin privileges

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback
}: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!currentUser) {
    return fallback || (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-zinc-900 border-2 border-red-500/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to access this page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
          >
            Go to Home & Login
          </button>
        </div>
      </motion.div>
    );
  }

  // User authenticated but admin required and not admin
  if (requireAdmin && !userProfile?.isAdmin) {
    return fallback || (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-zinc-900 border-2 border-yellow-500/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-2">
            This page is restricted to administrators only.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You are logged in as: <span className="text-[#FFD700]">{currentUser.email}</span>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
            >
              Go to Home
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-zinc-800 text-gray-300 font-bold py-3 rounded-lg hover:bg-zinc-700 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // User authenticated and authorized
  return <>{children}</>;
}

/**
 * Hook to check if user is admin
 * Useful for conditionally rendering UI elements
 */
export function useIsAdmin(): boolean {
  const { userProfile } = useAuth();
  return userProfile?.isAdmin || false;
}

/**
 * Hook to check if user is authenticated
 * Useful for conditionally rendering UI elements
 */
export function useIsAuthenticated(): boolean {
  const { currentUser } = useAuth();
  return !!currentUser;
}
