"use client"

import { useEffect, useId, useState } from "react"
import moment from "moment"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { DatePicker } from "@/components/ui/datepicker"

type FormInputProps = React.ComponentProps<"input"> & {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  dateMode?: "date" | "month" | "year"
}

export const FormInput = ({
  label,
  error,
  hint,
  id: idProp,
  required,
  className,
  dateMode = "month",
  ...properties
}: FormInputProps) => {
  const autoId = useId()
  const id = idProp ?? `form-input-${autoId}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined
  const { type, ...props } = properties

  const [showPassword, setShowPassword] = useState(false)

  const isDate = type === "date"
  const rawValue = (props.value as string | undefined) ?? ""
  const [dateText, setDateText] = useState(rawValue)

  useEffect(() => {
    setDateText(rawValue)
  }, [rawValue])

  const parsedDate = dateText ? moment(dateText, "YYYY-MM-DD", true) : null
  const dateValue =
    parsedDate && parsedDate.isValid() ? parsedDate.toDate() : undefined

  const handleDateSelect = (selected: Date | undefined) => {
    const value = selected ? moment(selected).format("YYYY-MM-DD") : ""
    setDateText(value)
    ;(
      props.onChange as unknown as (event: {
        target: { name: string; value: string }
      }) => void
    )?.({
      target: { name: props.name as string, value },
    })
  }

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
      {isDate ? (
        <div className="relative">
          <DatePicker
            mode={dateMode}
            value={dateValue}
            onChange={handleDateSelect}
            disabled={props.disabled as boolean}
            placeholder="Pilih bulan & tahun"
            error={error}
            hideLayout
          />
        </div>
      ) : (
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
      )}
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
