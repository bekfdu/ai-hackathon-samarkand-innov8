"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <AlertCircle className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-700'
      case 'error': return 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-700'
      default: return 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-700'
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getBgColor()} animate-fade-in-up`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
        <button onClick={onClose} className="ml-2">
          <X className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </button>
      </div>
    </div>
  )
}
