import { useId } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type FormTextAreaProps = React.ComponentProps<"textarea"> & {
  label: string
  error?: string
  hint?: string
}

export const FormTextArea = ({
  label,
  error,
  hint,
  id: idProp,
  required,
  className,
  ...props
}: FormTextAreaProps) => {
  const autoId = useId()
  const id = idProp ?? `form-textarea-${autoId}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-signal">
            *
          </span>
        ) : null}
      </Label>
      <Textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
