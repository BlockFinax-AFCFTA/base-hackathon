// Simplified version of the original file
// This is a basic implementation to match the original functionality

import { ReactNode } from "react"

type ToastProps = {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  duration?: number
  variant?: "default" | "destructive" | "success"
}

type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
}

// Simplified version - in a real app this would manage toast state
export function useToast() {
  function toast(props: Omit<ToasterToast, "id">) {
    // In a UI-only version, just log the toast to console
    console.log("Toast:", {
      id: Date.now().toString(),
      ...props
    })

    return {
      id: Date.now().toString(),
      dismiss: () => console.log("Dismissing toast")
    }
  }

  return {
    toast,
    dismiss: (id: string) => console.log(`Dismissing toast with id: ${id}`),
    remove: (id: string) => console.log(`Removing toast with id: ${id}`),
  }
}