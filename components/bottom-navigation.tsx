"use client"

import { Home, Upload, FileText, User, Zap } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BottomNavProps {
  currentPage?: string
}

export function BottomNavigation({ currentPage }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Bosh sahifa",
      id: "home"
    },
    {
      href: "/upload",
      icon: Upload,
      label: "Yuklash",
      id: "upload"
    },
    {
      href: "/grammar",
      icon: FileText,
      label: "Grammatika",
      id: "grammar"
    },
    {
      href: "/ocr",
      icon: Zap,
      label: "OCR",
      id: "ocr"
    },
    {
      href: "/profile",
      icon: User,
      label: "Profil",
      id: "profile"
    }
  ]

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                active
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-medium ${active ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
