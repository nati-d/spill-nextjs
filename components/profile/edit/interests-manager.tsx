"use client"

import React from "react"
import { Plus, X } from "lucide-react"
import { SectionHeader } from "./section-header"
import type { InterestsManagerProps } from "@/types/profile"

export function InterestsManager({ interests, onAdd, onRemove }: InterestsManagerProps) {
  const [newInterest, setNewInterest] = React.useState("")

  const handleAdd = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      onAdd(newInterest.trim())
      setNewInterest("")
    }
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Interests"
        count={interests.length}
        countLabel="interest"
      />

      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full text-sm font-medium"
            >
              {interest}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAdd()
            }
          }}
          className="flex-1 h-10 px-4 rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
          placeholder="Add an interest (press Enter)"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="h-10 px-4 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center font-medium"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}

