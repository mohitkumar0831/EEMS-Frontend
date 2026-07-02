import React from 'react';
import { useAppState } from '../context/StateContext';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export const ToastList = () => {
  const { toasts } = useAppState();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        let Icon = Info;
        let bgClass = 'bg-slate-900 border-indigo-500/30 text-indigo-400';
        
        if (toast.type === 'success') {
          Icon = CheckCircle;
          bgClass = 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          bgClass = 'bg-rose-950/90 border-rose-500/30 text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-amber-950/90 border-amber-500/30 text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-slide-in ${bgClass}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
