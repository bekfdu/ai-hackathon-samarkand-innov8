"use client"

import { ReactNode } from "react"
import { BottomNavigation } from "./bottom-navigation"

interface MobileLayoutProps {
  children: ReactNode
  currentPage?: string
}

export function MobileLayout({ children, currentPage }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 pb-20">
      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation currentPage={currentPage} />
    </div>
  )
}
