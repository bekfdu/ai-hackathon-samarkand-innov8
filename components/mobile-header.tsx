"use client"

import { ArrowLeft, MoreVertical, Bell, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  backHref?: string
  showNotifications?: boolean
  showSearch?: boolean
  showMenu?: boolean
  rightAction?: React.ReactNode
}

export function MobileHeader({ 
  title, 
  showBack = false, 
  backHref = "/",
  showNotifications = false,
  showSearch = false,
  showMenu = false,
  rightAction
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <Link href={backHref}>
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          )}
          
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          {showNotifications && (
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </Button>
          )}
          
          {rightAction || (
            <>
              <ThemeToggle />
              {showMenu && (
                <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
