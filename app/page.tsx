"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Zap, Globe, Target, Users, TrendingUp, Camera, FileText, CheckCircle, Award, ArrowRight, Star, BookOpen } from 'lucide-react'
import Link from "next/link"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"
import { APIStatus } from "@/components/api-status"
import Image from "next/image"

export default function HomePage() {
  const [stats] = useState({
    users: "10,000+",
    accuracy: "95%",
    languages: 4,
    checksToday: "1,247"
  })

  const [greeting, setGreeting] = useState("Salom!")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Xayrli tong! 🌅")
    } else if (hour < 18) {
      setGreeting("Xayrli kun! ☀️")
    } else {
      setGreeting("Xayrli kech! 🌙")
    }
  }, [])

  const quickActions = [
    {
      title: "Rasm yuklash",
      description: "Insho rasmini yuklang va tahlil qiling",
      icon: Upload,
      href: "/upload",
      color: "from-purple-500 to-blue-500",
      badge: "Mashhur"
    },
    {
      title: "Grammatika tekshirish",
      description: "Matnni to'g'ridan-to'g'ri tekshiring",
      icon: FileText,
      href: "/grammar",
      color: "from-green-500 to-teal-500",
      badge: "Tez"
    },
    {
      title: "OCR matn ajratish",
      description: "Rasmdan matn ajratib oling",
      icon: Zap,
      href: "/ocr",
      color: "from-orange-500 to-red-500",
      badge: "Yangi"
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "Tez tahlil",
      description: "10 soniyada natija",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/50"
    },
    {
      icon: Globe,
      title: "To'rt til",
      description: "O'zbek, Ingliz, Rus, Turk",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/50"
    },
    {
      icon: Target,
      title: "Aniq natija",
      description: "95% aniqlik kafolati",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/50"
    },
    {
      icon: BookOpen,
      title: "Bepul xizmat",
      description: "Cheklovsiz foydalaning",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/50"
    }
  ]

  const workflowSteps = [
    { icon: Camera, title: "Rasm yuklang", desc: "Inshongizning rasmini oling yoki yuklang", color: "from-purple-500 to-blue-500" },
    { icon: FileText, title: "Matn ajratish", desc: "AI rasmdan matnni avtomatik o'qiydi", color: "from-blue-500 to-cyan-500" },
    { icon: CheckCircle, title: "Tekshirish", desc: "Grammatika va imlo tekshiriladi", color: "from-cyan-500 to-green-500" },
    { icon: Award, title: "Natija", desc: "Batafsil tahlil va tavsiyalar olasiz", color: "from-green-500 to-purple-500" }
  ]

  return (
    <MobileLayout currentPage="home">
      <MobileHeader 
        title="EduCheck" 
        showNotifications={true}
        showMenu={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 flex items-center justify-center mx-auto shadow-xl animate-pulse-slow">
            <Image
              src="/logo.svg"
              alt="EduCheck Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {greeting}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Insholaringizni AI yordamida tez va aniq tahlil qiling
            </p>
          </div>
        </div>

        {/* API Status */}
        <APIStatus />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
            Tezkor amallar
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {action.title}
                            </h4>
                            {action.badge && (
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                                {action.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Statistics */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-xl">
          <CardContent className="p-6 text-white">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Bizning natijalarimiz</h3>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{stats.users}</div>
                <div className="text-xs text-purple-100">foydalanuvchi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{stats.accuracy}</div>
                <div className="text-xs text-purple-100">aniqlik</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{stats.languages}</div>
                <div className="text-xs text-purple-100">til</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{stats.checksToday}</div>
                <div className="text-xs text-purple-100">bugun tekshirildi</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
            Xususiyatlar
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
            Qanday ishlaydi?
          </h3>
          <div className="space-y-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {step.desc}
                    </p>
                  </div>
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 border">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-sm flex items-center gap-2">
              💡 Foydali maslahatlar:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Yaxshi yorug'likda va aniq rasm oling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Matn to'liq ko'rinishi uchun kamerani to'g'ri yo'naltiring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Qo'lyozma aniq va o'qilishi oson bo'lishi kerak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Eng yaxshi natija uchun JPG yoki PNG formatida yuklang</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="pt-4">
          <Link href="/upload">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95">
              <Upload className="w-6 h-6 mr-3" />
              Hoziroq boshlash
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  )
}
