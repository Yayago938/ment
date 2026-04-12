import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ToastContext = createContext(null)

function ToastItem({ toast, onClose }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(0)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="pointer-events-auto overflow-hidden rounded-2xl bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
      <div className="px-4 py-3 text-sm">{toast.message}</div>
      <div className="h-px bg-black/10">
        <div
          className="h-full bg-black/60 transition-[width] ease-linear"
          style={{
            width: `${progress}%`,
            transitionDuration: `${toast.duration}ms`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="sr-only"
      >
        Dismiss
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback(id => {
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((message, options = {}) => {
    if (!message) {
      return
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const duration = options.duration ?? 4000

    setToasts(current => [...current, { id, message, duration }])
    window.setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id))
    }, duration)
  }, [])

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
