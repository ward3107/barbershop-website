import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, LogIn, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Authentication-specific Error Boundary
 *
 * Catches errors in authentication-related components and provides
 * auth-specific error recovery options.
 */
class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth error:', error, errorInfo);

    // Check if it's a Firebase auth error
    if (error.message.includes('Firebase') || error.message.includes('auth')) {
      console.error('Firebase authentication error detected');
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isFirebaseError =
        this.state.error?.message.includes('Firebase') ||
        this.state.error?.message.includes('not configured');

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-yellow-500/50 rounded-2xl p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-500 mb-2">
              {isFirebaseError ? 'Configuration Error' : 'Authentication Error'}
            </h2>
            <p className="text-gray-400 mb-4">
              {isFirebaseError
                ? 'Firebase authentication is not properly configured. Please check your environment variables.'
                : 'We encountered an issue with authentication. Please try again.'}
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-4 p-3 bg-black rounded border border-yellow-500/30">
                <p className="text-sm text-yellow-400 font-mono text-left">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              {isFirebaseError && (
                <button
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Reload Page
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
