import { useId } from "react"
import { NumericFormat } from "react-number-format"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormNumberProps = {
  label: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  value?: number | string
  defaultValue?: number | string
  onValueChange?: (value: number | undefined) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  name?: string
  min?: number
  max?: number
  decimalScale?: number
  allowNegative?: boolean
  thousandSeparator?: boolean | string
  className?: string
}

export const FormNumber = ({
  label,
  error,
  hint,
  required,
  disabled,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  name,
  min,
  max,
  decimalScale = 0,
  allowNegative = false,
  thousandSeparator = false,
  className,
}: FormNumberProps) => {
  const autoId = useId()
  const id = `form-number-${autoId}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined

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
      <NumericFormat
        id={id}
        name={name}
        customInput={Input}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(values) => onValueChange?.(values.floatValue)}
        onBlur={onBlur}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        allowNegative={allowNegative}
        isAllowed={(values) => {
          const { floatValue } = values
          if (floatValue === undefined) return true
          if (min !== undefined && floatValue < min) return false
          if (max !== undefined && floatValue > max) return false
          return true
        }}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
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
