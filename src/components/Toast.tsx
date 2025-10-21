import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string, duration: number = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) => showToast('success', message, duration);
  const error = (message: string, duration?: number) => showToast('error', message, duration);
  const warning = (message: string, duration?: number) => showToast('warning', message, duration);
  const info = (message: string, duration?: number) => showToast('info', message, duration);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: {
      bg: 'bg-green-900/95',
      border: 'border-green-500',
      icon: 'text-green-400',
      glow: 'shadow-lg shadow-green-500/50'
    },
    error: {
      bg: 'bg-red-900/95',
      border: 'border-red-500',
      icon: 'text-red-400',
      glow: 'shadow-lg shadow-red-500/50'
    },
    warning: {
      bg: 'bg-yellow-900/95',
      border: 'border-yellow-500',
      icon: 'text-yellow-400',
      glow: 'shadow-lg shadow-yellow-500/50'
    },
    info: {
      bg: 'bg-blue-900/95',
      border: 'border-blue-500',
      icon: 'text-blue-400',
      glow: 'shadow-lg shadow-blue-500/50'
    }
  };

  const style = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
      className="pointer-events-auto"
    >
      <div
        className={`relative ${style.bg} ${style.glow} border-2 ${style.border} rounded-xl p-4 pr-12 backdrop-blur-sm min-w-[300px] max-w-[400px]`}
      >
        {/* Golden gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FFD700]/5 rounded-xl pointer-events-none" />

        <div className="relative flex items-start gap-3">
          <div className={`${style.icon} flex-shrink-0 mt-0.5`}>
            {icons[toast.type]}
          </div>

          <div className="flex-1">
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {toast.message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        {toast.duration && toast.duration > 0 && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: toast.duration / 1000, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-1 ${style.border.replace('border-', 'bg-')} origin-left rounded-bl-xl`}
            style={{ width: '100%' }}
          />
        )}
      </div>
    </motion.div>
  );
}
