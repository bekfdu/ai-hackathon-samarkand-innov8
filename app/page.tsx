"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Zap, Globe, Target, Users, TrendingUp, Camera, FileText, CheckCircle, Award, ArrowRight, Star } from 'lucide-react'
import Link from "next/link"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"

export default function HomePage() {
  const [stats] = useState({
    users: "10,000+",
    accuracy: "95%",
    languages: 4
  })

  const quickActions = [
    {
      title: "Rasm yuklash",
      description: "Insho rasmini yuklang",
      icon: Upload,
      href: "/upload",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Grammatika",
      description: "Matnni tekshiring",
      icon: FileText,
      href: "/grammar",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "OCR",
      description: "Matn ajratish",
      icon: Zap,
      href: "/ocr",
      color: "from-orange-500 to-red-500"
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "Tez tahlil",
      description: "10 soniyada natija",
      color: "text-purple-600"
    },
    {
      icon: Globe,
      title: "To'rt til",
      description: "O'zbek, Ingliz, Rus, Turk",
      color: "text-blue-600"
    },
    {
      icon: Target,
      title: "Aniq natija",
      description: "95% aniqlik kafolati",
      color: "text-green-600"
    }
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
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Salom! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Insholaringizni AI yordamida tez va aniq tahlil qiling
            </p>
          </div>
        </div>

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
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h4>
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
            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
            Xususiyatlar
          </h3>
          <div className="grid gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
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
            {[
              { icon: Camera, title: "Rasm yuklang", desc: "Inshongizning rasmini oling" },
              { icon: FileText, title: "Matn ajratish", desc: "AI rasmdan matnni o'qiydi" },
              { icon: CheckCircle, title: "Tekshirish", desc: "Grammatika tekshiriladi" },
              { icon: Award, title: "Natija", desc: "Batafsil tahlil va tavsiyalar" }
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-2xl bg-white/40 dark:bg-gray-800/40">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
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
