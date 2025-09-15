import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Simple context-based implementation
interface ToastContextType {
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = React.useCallback((toast: Omit<ToasterToast, "id">) => {
    const id = genId()
    const newToast: ToasterToast = {
      ...toast,
      id,
      open: true,
    }

    setToasts((currentToasts) => [newToast, ...currentToasts].slice(0, TOAST_LIMIT))

    // Auto remove toast after delay
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
    }, TOAST_REMOVE_DELAY)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
  }, [])

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  )

  return (
    React.createElement(ToastContext.Provider, { value }, children)
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  
  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = genId()
    context.addToast(props)
    
    return {
      id,
      dismiss: () => context.removeToast(id),
      update: () => {}, // Simplified - no update functionality for now
    }
  }, [context])

  return {
    toasts: context.toasts,
    toast,
    dismiss: context.removeToast,
  }
}

// Export standalone toast function
export const toast = (props: Omit<ToasterToast, "id">) => {
  // For standalone usage, we'll just console.warn since we need the context
  console.warn('Toast called outside of ToastProvider context. Please use the toast function from useToast hook instead.')
  return { id: '', dismiss: () => {}, update: () => {} }
}