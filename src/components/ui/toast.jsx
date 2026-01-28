import React, { useEffect } from 'react';
import { useToastStore } from '../../stores/toastStore';

const Toast = ({ toast }) => {
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[toast.type] || 'bg-blue-500';

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded shadow-lg text-sm`}
      role="alert"
    >
      {toast.message}
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 pointer-events-auto z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
