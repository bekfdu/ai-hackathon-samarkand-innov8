"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { User, Settings, BarChart3, Download, Globe, Bell, ChevronRight, Award, Clock, Target, Trash2, RefreshCw } from 'lucide-react'
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"
import { LanguageSelector } from "@/components/language-selector"

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("uzbek")
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    errorsFixed: 0,
    timesSaved: "0 soat"
  })

  // Load stats from localStorage
  useEffect(() => {
    const loadStats = () => {
      try {
        const savedStats = localStorage.getItem('userStats')
        if (savedStats) {
          const parsed = JSON.parse(savedStats)
          setStats(parsed)
        } else {
          // Calculate stats from stored results
          const results = []
          let index = 0
          while (true) {
            const result = localStorage.getItem(`analysis_${index}`)
            if (!result) break
            results.push(JSON.parse(result))
            index++
          }
          
          if (results.length > 0) {
            const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0)
            const totalErrors = results.reduce((sum, r) => sum + (r.errorCount || 0), 0)
            const avgTime = results.length * 2.5 // Estimate 2.5 minutes saved per analysis
            
            const calculatedStats = {
              totalAnalyses: results.length,
              averageScore: totalScore / results.length,
              errorsFixed: totalErrors,
              timesSaved: `${avgTime.toFixed(1)} soat`
            }
            
            setStats(calculatedStats)
            localStorage.setItem('userStats', JSON.stringify(calculatedStats))
          }
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [])

  const menuItems = [
    {
      icon: BarChart3,
      title: "Statistika",
      description: "Tahlil natijalari va hisobotlar",
      action: () => {
        // Navigate to stats page or show detailed stats
        console.log('Show detailed statistics')
      }
    },
    {
      icon: Download,
      title: "Ma'lumotlarni eksport",
      description: "Barcha natijalarni yuklab olish",
      action: () => {
        exportAllData()
      }
    },
    {
      icon: RefreshCw,
      title: "Statistikani yangilash",
      description: "Hisoblarni qayta hisoblash",
      action: () => {
        updateStats()
      }
    },
    {
      icon: Trash2,
      title: "Ma'lumotlarni tozalash",
      description: "Barcha saqlangan ma'lumotlarni o'chirish",
      action: () => {
        clearAllData()
      }
    }
  ]

  const exportAllData = () => {
    try {
      const allData = {
        stats: stats,
        language: language,
        notifications: notifications,
        exportDate: new Date().toISOString(),
        analyses: []
      }

      // Collect all analysis results
      let index = 0
      while (true) {
        const result = localStorage.getItem(`analysis_${index}`)
        if (!result) break
        allData.analyses.push(JSON.parse(result))
        index++
      }

      const dataStr = JSON.stringify(allData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `educheck-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const updateStats = () => {
    // Recalculate stats
    const results = []
    let index = 0
    while (true) {
      const result = localStorage.getItem(`analysis_${index}`)
      if (!result) break
      results.push(JSON.parse(result))
      index++
    }
    
    if (results.length > 0) {
      const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0)
      const totalErrors = results.reduce((sum, r) => sum + (r.errorCount || 0), 0)
      const avgTime = results.length * 2.5
      
      const newStats = {
        totalAnalyses: results.length,
        averageScore: Math.round((totalScore / results.length) * 10) / 10,
        errorsFixed: totalErrors,
        timesSaved: `${avgTime.toFixed(1)} soat`
      }
      
      setStats(newStats)
      localStorage.setItem('userStats', JSON.stringify(newStats))
    }
  }

  const clearAllData = () => {
    if (confirm('Barcha ma\'lumotlarni o\'chirishni xohlaysizmi? Bu amalni bekor qilib bo\'lmaydi.')) {
      // Clear all stored data
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('analysis_') || key.includes('educheck') || key === 'userStats')) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Reset stats
      const emptyStats = {
        totalAnalyses: 0,
        averageScore: 0,
        errorsFixed: 0,
        timesSaved: "0 soat"
      }
      setStats(emptyStats)
      
      alert('Barcha ma\'lumotlar muvaffaqiyatli o\'chirildi!')
    }
  }

  return (
    <MobileLayout currentPage="profile">
      <MobileHeader 
        title="Profil" 
        showBack={true}
        showMenu={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 border-0 shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">EduCheck Foydalanuvchisi</h2>
                <p className="text-purple-100">AI yordamchi bilan ishlaydi</p>
                <div className="flex items-center gap-1 mt-2">
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm text-purple-100">
                    {stats.totalAnalyses > 10 ? 'Faol foydalanuvchi' : 'Yangi foydalanuvchi'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalAnalyses}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Tahlil</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '0.0'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">O'rtacha ball</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.errorsFixed}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Tuzatilgan</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{stats.timesSaved}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Tejangan</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sozlamalar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Til</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Interfeys tili</p>
                </div>
              </div>
              <div className="w-32">
                <LanguageSelector value={language} onValueChange={setLanguage} />
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Bildirishnomalar</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Push bildirishnomalar</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">EduCheck v1.0</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              AI yordamida matn tahlili
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2024 EduCheck Team. Barcha huquqlar himoyalangan.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  )
}
