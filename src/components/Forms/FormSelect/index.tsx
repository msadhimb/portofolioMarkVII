import { useId } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type FormSelectOption = {
  value: string
  label: string
}

type FormSelectProps = {
  label: string
  options: FormSelectOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
  className?: string
}

export const FormSelect = ({
  label,
  options,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  name,
  required,
  disabled,
  error,
  hint,
  className,
}: FormSelectProps) => {
  const autoId = useId()
  const triggerId = `form-select-${autoId}`
  const errorId = `${triggerId}-error`
  const hintId = `${triggerId}-hint`

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={triggerId}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-signal">
            *
          </span>
        ) : null}
      </Label>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger
          id={triggerId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
