"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react'
import { checkAPIHealth, checkNetworkConnectivity } from "@/lib/api-services"

export function APIStatus() {
  const [status, setStatus] = useState({ ocr: false, grammar: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // First check network connectivity
        const isConnected = await checkNetworkConnectivity()
        if (!isConnected) {
          setStatus({ ocr: false, grammar: false })
          return
        }
        
        const health = await checkAPIHealth()
        setStatus(health)
        console.log('API Status updated:', health)
      } catch (error) {
        console.error('API health check failed:', error)
        setStatus({ ocr: false, grammar: false })
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
    
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Xizmat holati tekshirilmoqda...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const allServicesUp = status.ocr && status.grammar
  const someServicesDown = !status.ocr || !status.grammar

  return (
    <Card className={`${
      allServicesUp 
        ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-700' 
        : someServicesDown 
        ? 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-700'
        : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-700'
    }`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allServicesUp ? (
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : someServicesDown ? (
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              allServicesUp 
                ? 'text-green-800 dark:text-green-200' 
                : someServicesDown 
                ? 'text-yellow-800 dark:text-yellow-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              {allServicesUp 
                ? 'Barcha xizmatlar ishlayapti' 
                : someServicesDown 
                ? 'Ba\'zi xizmatlar ishlamayapti'
                : 'Xizmatlar ishlamayapti'
              }
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${status.ocr ? 'bg-green-500' : 'bg-red-500'}`} title="OCR Service" />
            <div className={`w-2 h-2 rounded-full ${status.grammar ? 'bg-green-500' : 'bg-red-500'}`} title="Grammar Service" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
