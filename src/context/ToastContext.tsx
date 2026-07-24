import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; msg: string; type: ToastType; }

interface ToastCtx {
  toast: (msg: string, type?: ToastType) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const Ctx = createContext<ToastCtx>({} as ToastCtx);
export const useToast = () => useContext(Ctx);

let seq = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);
  const toast = useCallback((msg: string, type: ToastType = 'success') => {
    const id = seq++;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const success = useCallback((m: string) => toast(m, 'success'), [toast]);
  const error = useCallback((m: string) => toast(m, 'error'), [toast]);

  const style: Record<ToastType, { bg: string; icon: any }> = {
    success: { bg: 'bg-primary text-on-primary', icon: CheckCircle2 },
    error: { bg: 'bg-error text-on-error', icon: AlertCircle },
    info: { bg: 'bg-secondary text-on-secondary', icon: Info },
  };

  return (
    <Ctx.Provider value={{ toast, success, error }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => {
          const s = style[t.type]; const Icon = s.icon;
          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-3 ${s.bg} px-5 py-3.5 rounded-2xl shadow-2xl min-w-[260px] max-w-sm animate-in`} style={{ animation: 'qzToast .3s cubic-bezier(.22,1,.36,1)' }}>
              <Icon size={20} className="shrink-0" />
              <span className="text-sm font-semibold flex-1">{t.msg}</span>
              <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100"><X size={16} /></button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes qzToast { from { opacity:0; transform: translateX(20px);} to { opacity:1; transform:none;} }`}</style>
    </Ctx.Provider>
  );
}
