import { useId, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

type FormInputProps = React.ComponentProps<"input"> & {
  label: string
  error?: string
  hint?: string
}

export const FormInput = ({
  label,
  error,
  hint,
  id: idProp,
  required,
  className,
  ...properties
}: FormInputProps) => {
  const autoId = useId()
  const id = idProp ?? `form-input-${autoId}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined
  const { type, ...props } = properties

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="gap-0">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
        ) : null}
      </Label>
      <div className="relative">
        <Input
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(type === "password" && "pr-10")}
          type={type === "password" && showPassword ? "text" : type}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute top-1/2 right-4 translate-y-[-50%] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="text-muted-foreground" size={15} />
            ) : (
              <Eye className="text-muted-foreground" size={15} />
            )}
          </button>
        )}
      </div>
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
