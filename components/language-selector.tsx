"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LanguageSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  const languages = [
    { value: "uzbek", label: "O'zbek", flag: "🇺🇿" },
    { value: "english", label: "English", flag: "🇺🇸" },
    { value: "russian", label: "Русский", flag: "🇷🇺" },
    { value: "turkish", label: "Türkçe", flag: "🇹🇷" }
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Til tanlang" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
