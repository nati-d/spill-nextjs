"use client"

import type { AlertMessagesProps } from "@/types/profile"

export function AlertMessages({ success, error, validationErrors }: AlertMessagesProps) {
  return (
    <>
      {success && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4">
          <p className="text-green-700 dark:text-green-400 text-sm font-medium">
            ✓ Profile updated successfully! Redirecting...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4">
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">✕ {error}</p>
        </div>
      )}

      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4">
          <p className="text-red-700 dark:text-red-400 text-sm font-semibold mb-3">Validation Errors</p>
          <ul className="space-y-2">
            {Object.entries(validationErrors).map(([field, message]) => (
              <li key={field} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                <span>
                  <span className="font-medium capitalize">{field.replace(/_/g, " ")}</span>: {message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

