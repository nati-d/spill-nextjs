"use client"

import type { FormFieldProps } from "@/types/profile"

export function FormField({ 
  label, 
  id, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  error, 
  min, 
  max 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        min={min}
        max={max}
        value={value ?? ""}
        onChange={onChange}
        className={`w-full h-10 px-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          error ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "border-border bg-background hover:border-primary/50"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

