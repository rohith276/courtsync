import { useCallback } from "react"
import { toast as sonnerToast } from "sonner"

export function useToast() {
  const toast = useCallback(({ title, description, variant }: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    if (variant === "destructive") {
      sonnerToast.error(title, { description })
    } else {
      sonnerToast(title, { description })
    }
  }, [])

  return { toast }
}
