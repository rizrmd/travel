"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarComponent } from "@/components/ui/calendar"

interface DateInputProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  /**
   * Disable dates before this date
   */
  disableBefore?: Date
  /**
   * Disable dates after this date
   */
  disableAfter?: Date
  /**
   * Format for displaying the date
   * @default "dd MMMM yyyy"
   */
  dateFormat?: string
}

export function DateInput({
  form,
  name,
  label,
  description,
  placeholder = "Pilih tanggal",
  disabled,
  required,
  className,
  disableBefore,
  disableAfter,
  dateFormat = "dd MMMM yyyy",
}: DateInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col space-y-8", className)}>
          {label && (
            <FormLabel
              className={cn(
                required &&
                  "after:content-['*'] after:ml-4 after:text-red-600"
              )}
            >
              {label}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-12 text-left font-normal",
                    !field.value && "text-slate-500"
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(new Date(field.value), dateFormat, {
                      locale: idLocale,
                    })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <Calendar className="ml-auto h-16 w-16 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(format(date, "yyyy-MM-dd"))
                  }
                }}
                disabled={(date) => {
                  if (disableBefore && date < disableBefore) return true
                  if (disableAfter && date > disableAfter) return true
                  return false
                }}
                initialFocus
                locale={idLocale}
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface TimeInputProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function TimeInput({
  form,
  name,
  label,
  description,
  placeholder = "HH:MM",
  disabled,
  required,
  className,
}: TimeInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-8", className)}>
          {label && (
            <FormLabel
              className={cn(
                required &&
                  "after:content-['*'] after:ml-4 after:text-red-600"
              )}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <input
              {...field}
              type="time"
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "flex h-40 w-full rounded-md border border-input bg-background px-12 py-8 text-body",
                "ring-offset-background file:border-0 file:bg-transparent file:text-body file:font-medium",
                "placeholder:text-slate-500",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface DateTimeInputProps {
  form: UseFormReturn<any>
  dateName: string
  timeName: string
  label?: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: string
  disableBefore?: Date
  disableAfter?: Date
}

export function DateTimeInput({
  form,
  dateName,
  timeName,
  label,
  description,
  disabled,
  required,
  className,
  disableBefore,
  disableAfter,
}: DateTimeInputProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {label && (
        <label
          className={cn(
            "text-body-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            required && "after:content-['*'] after:ml-4 after:text-red-600"
          )}
        >
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-12">
        <DateInput
          form={form}
          name={dateName}
          placeholder="Pilih tanggal"
          disabled={disabled}
          disableBefore={disableBefore}
          disableAfter={disableAfter}
        />
        <TimeInput
          form={form}
          name={timeName}
          placeholder="HH:MM"
          disabled={disabled}
        />
      </div>
      {description && (
        <p className="text-body-sm text-slate-500">{description}</p>
      )}
    </div>
  )
}
