import { AnimatePresence, motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface Toast {
  id: number;
  message: string;
}

interface ToastContextValue {
  addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="pointer-events-auto w-64 max-w-full border-[3px] border-dark bg-dark px-5 py-4 font-display text-xs font-black uppercase tracking-[0.2em] text-surface shadow-hard"
              onClick={() => removeToast(toast.id)}
            >
              <p>{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
