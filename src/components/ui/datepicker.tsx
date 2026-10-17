"use client"

import * as React from "react"
import moment from "moment"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  mode?: "date" | "month" | "year"
  label?: string
  error?: string
  hideLayout?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  mode = "date",
  label,
  error,
  hideLayout = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentYear, setCurrentYear] = React.useState(() =>
    value ? moment(value).year() : moment().year(),
  )

  const hasError = Boolean(error)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate)
    if (selectedDate) {
      setOpen(false)
    }
  }

  const getFormattedValue = () => {
    if (!value) return placeholder

    switch (mode) {
      case "month":
        return moment(value).format("MMM YYYY")
      case "year":
        return moment(value).format("YYYY")
      default:
        return moment(value).format("DD MMM YYYY")
    }
  }

  const getPlaceholder = () => {
    if (placeholder !== "Pick a date") return placeholder

    switch (mode) {
      case "month":
        return "Pick a month"
      case "year":
        return "Pick a year"
      default:
        return "Pick a date"
    }
  }

  const renderMonthYearPicker = () => {
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)
    const months = moment.months()
    const selectedMoment = value ? moment(value) : null

    if (mode === "year") {
      return (
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium">Select Year</div>
          <Select
            value={selectedMoment?.year().toString() || ""}
            onValueChange={(year) => {
              const newDate = moment()
                .year(parseInt(year))
                .month(0)
                .date(1)
                .toDate()
              handleDateSelect(newDate)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    if (mode === "month") {
      const handleMonthSelect = (monthIndex: number) => {
        const newDate = moment()
          .year(currentYear)
          .month(monthIndex)
          .date(1)
          .toDate()
        handleDateSelect(newDate)
      }

      const handleYearChange = (direction: "prev" | "next") => {
        setCurrentYear((prev) => (direction === "prev" ? prev - 1 : prev + 1))
      }

      return (
        <div className="w-64 p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange("prev")}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">{currentYear}</div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange("next")}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected =
                selectedMoment &&
                selectedMoment.year() === currentYear &&
                selectedMoment.month() === index

              return (
                <Button
                  key={month}
                  type="button"
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleMonthSelect(index)}
                  className="h-9 rounded-lg text-sm font-normal"
                >
                  {month.substring(0, 3)}
                </Button>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }

  const content = (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-start rounded-xl px-4 text-[15px] font-normal shadow-xs",
            "bg-background dark:bg-background",
            "focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/25",
            value ? "text-foreground" : "text-muted-foreground/60",
            hasError &&
              "border-destructive/60 text-destructive ring-2 ring-destructive/20",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {value ? <span>{getFormattedValue()}</span> : <span>{getPlaceholder()}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "date" ? (
          <Calendar mode="single" selected={value} onSelect={handleDateSelect} disabled={disabled} />
        ) : (
          renderMonthYearPicker()
        )}
      </PopoverContent>
    </Popover>
  )

  if (hideLayout) return content

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label
          className={cn(
            "text-sm font-medium leading-none",
            hasError ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </label>
      )}

      {content}

      {hasError && (
        <span className="text-xs text-destructive mt-1 animate-in slide-in-from-top-1 duration-200">
          {error}
        </span>
      )}
    </div>
  )
}
