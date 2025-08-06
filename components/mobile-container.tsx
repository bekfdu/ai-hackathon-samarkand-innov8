"use client"

import { ReactNode } from "react"

interface MobileContainerProps {
  children: ReactNode
  className?: string
}

export function MobileContainer({ children, className = "" }: MobileContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 ${className}`}>
      <div className="container mx-auto px-4 max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
        {children}
      </div>
    </div>
  )
}
