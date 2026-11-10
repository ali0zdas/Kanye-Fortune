import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export interface ToastProps {
  message: string | null;
  onClose?: () => void;
  duration?: number;
}

/**
 * Animated feedback toast component using Framer Motion AnimatePresence.
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  duration = 2600,
}) => {
  useEffect(() => {
    if (!message || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            key="toast-alert"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/90 text-white border border-white/20 shadow-2xl backdrop-blur-xl text-xs sm:text-sm font-mono tracking-wide"
            style={{
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.15)',
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-medium whitespace-nowrap">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
