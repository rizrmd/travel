"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface FormFieldOption {
  label: string
  value: string
  disabled?: boolean
}

interface BaseFormFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

interface TextFormFieldProps extends BaseFormFieldProps {
  type: "text" | "email" | "password" | "tel" | "url" | "number"
  maxLength?: number
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
  type: "textarea"
  rows?: number
  maxLength?: number
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: "select"
  options: FormFieldOption[]
  emptyMessage?: string
}

interface CheckboxFormFieldProps extends BaseFormFieldProps {
  type: "checkbox"
  checkboxLabel?: string
}

type FormFieldComponentProps =
  | TextFormFieldProps
  | TextareaFormFieldProps
  | SelectFormFieldProps
  | CheckboxFormFieldProps

export function FormFieldComponent(props: FormFieldComponentProps) {
  const { form, name, label, description, disabled, required, className } = props

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-8", className)}>
          {label && (
            <FormLabel className={cn(required && "after:content-['*'] after:ml-4 after:text-red-600")}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            {props.type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={props.placeholder}
                disabled={disabled}
                rows={props.rows || 4}
                maxLength={props.maxLength}
                className="resize-none"
              />
            ) : props.type === "select" ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={props.placeholder || "Pilih opsi"} />
                </SelectTrigger>
                <SelectContent>
                  {props.options.length === 0 ? (
                    <div className="p-16 text-center text-body-sm text-slate-500">
                      {props.emptyMessage || "Tidak ada opsi"}
                    </div>
                  ) : (
                    props.options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            ) : props.type === "checkbox" ? (
              <div className="flex items-center space-x-8">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
                {props.checkboxLabel && (
                  <label
                    htmlFor={name}
                    className="text-body-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {props.checkboxLabel}
                  </label>
                )}
              </div>
            ) : (
              <Input
                {...field}
                type={props.type}
                placeholder={props.placeholder}
                disabled={disabled}
                maxLength={props.maxLength}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {props.type === "textarea" && props.maxLength && field.value && (
            <div className="text-caption text-slate-500 text-right">
              {field.value.length} / {props.maxLength}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Convenience exports for specific field types
export function TextFormField(props: Omit<TextFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="text" />
}

export function EmailFormField(props: Omit<BaseFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="email" />
}

export function PasswordFormField(props: Omit<BaseFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="password" />
}

export function TelFormField(props: Omit<BaseFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="tel" />
}

export function TextareaFormField(props: Omit<TextareaFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="textarea" />
}

export function SelectFormField(props: Omit<SelectFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="select" />
}

export function CheckboxFormField(props: Omit<CheckboxFormFieldProps, "type">) {
  return <FormFieldComponent {...props} type="checkbox" />
}
