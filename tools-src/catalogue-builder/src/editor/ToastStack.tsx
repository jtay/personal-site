import { useCatalogueStore } from '../state/store';

export const ToastStack: React.FC = () => {
  const toasts = useCatalogueStore((s) => s.toasts);
  const dismissToast = useCatalogueStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="cb-toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className="cb-toast">
          <span>{toast.message}</span>
          {toast.actionLabel && toast.onAction && (
            <button
              className="cb-toast-action"
              onClick={() => {
                toast.onAction?.();
                dismissToast(toast.id);
              }}
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
