"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Share2, Upload, RefreshCw, Trophy, Target, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import { ScoreDisplay } from "@/components/score-display"
import { EnhancedErrorDisplay } from "@/components/enhanced-error-display"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"

interface GrammarError {
  position: number
  length?: number
  text: string
  corrections: string[]
  correction: string
  type: 'spelling' | 'grammar' | 'style'
  description: string
}

interface Results {
  score: number
  errors: GrammarError[]
  wordCount?: number
  errorCount?: number
  processedAt?: string
}

interface ExtendedResults extends Results {
  confidence?: number
  language?: string
  fallback?: boolean
}

export default function ResultsPage() {
  const router = useRouter()
  const [extractedText, setExtractedText] = useState("")
  const [results, setResults] = useState<ExtendedResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    const text = localStorage.getItem('extractedText')
    const grammarResults = localStorage.getItem('grammarResults')
    const confidence = localStorage.getItem('ocrConfidence')
    
    if (!text || !grammarResults) {
      router.push('/upload')
      return
    }

    setExtractedText(text)
    const parsedResults = JSON.parse(grammarResults)
    
    const extendedResults: ExtendedResults = {
      ...parsedResults,
      confidence: confidence ? parseFloat(confidence) : undefined
    }
    
    setResults(extendedResults)
    setLoading(false)
  }, [router])

  const handleDownload = () => {
    if (!results || !extractedText) return
    
    const timestamp = new Date().toLocaleString('uz-UZ')
    const content = `EduCheck Tahlil Natijasi
Sana: ${timestamp}

UMUMIY MA'LUMOTLAR:
Ball: ${results.score}/10
So'zlar soni: ${results.wordCount || extractedText.split(/\s+/).length}
Xatoliklar soni: ${results.errorCount || results.errors.length}
${results.confidence ? `OCR aniqlik: ${Math.round(results.confidence * 100)}%` : ''}

AJRATILGAN MATN:
${extractedText}

TOPILGAN XATOLIKLAR:
${results.errors.length === 0 ? 'Xatolik topilmadi!' : results.errors.map((error, index) => 
  `${index + 1}. "${error.text}" → "${error.correction}" (${error.description})`
).join('\n')}

TAVSIYALAR:
${results.errors.length === 0 
  ? '✅ Matn grammatik va imloviy jihatdan to\'g\'ri yozilgan'
  : results.errors.map(error => `• ${error.text} so'zini ${error.correction} bilan almashtiring`).join('\n')
}

---
EduCheck - AI yordamida matn tahlili
`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `educheck-natija-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareText = `EduCheck orqali inshomni tekshirdim! 📝\n\nNatija: ${results?.score}/10 ball\nXatoliklar: ${results?.errors.length || 0} ta\n\n#EduCheck #AI #Grammatika`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EduCheck Natijasi',
          text: shareText,
          url: window.location.href
        })
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareText)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (err) {
        console.log('Copy failed')
      }
    }
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Natijalar yuklanmoqda...</p>
          </div>
        </div>
      </MobileLayout>
    )
  }

  if (!results) {
    return (
      <MobileLayout>
        <MobileHeader title="Natijalar" showBack={true} />
        <div className="px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Natijalar topilmadi
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tahlil natijalarini yuklab bo'lmadi
              </p>
              <Button onClick={() => router.push('/upload')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl">
                <Upload className="w-4 h-4 mr-2" />
                Yangi tahlil
              </Button>
            </CardContent>
          </Card>
        </div>
      </MobileLayout>
    )
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return "🏆"
    if (score >= 8) return "🎉"
    if (score >= 7) return "👍"
    if (score >= 6) return "👌"
    return "💪"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 9) return "A'lo natija! Ajoyib ish!"
    if (score >= 8) return "Juda yaxshi natija!"
    if (score >= 7) return "Yaxshi natija!"
    if (score >= 6) return "Qoniqarli natija"
    return "Yaxshilanishi mumkin"
  }

  return (
    <MobileLayout>
      <MobileHeader 
        title="Natijalar" 
        showBack={true}
        rightAction={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full w-10 h-10">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload} className="rounded-full w-10 h-10">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Score Display */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 border-0 shadow-xl">
          <CardContent className="p-6 text-center text-white">
            <div className="text-6xl mb-4">{getScoreEmoji(results.score)}</div>
            <ScoreDisplay score={results.score} />
            <p className="text-purple-100 mt-2 text-sm">
              {getScoreMessage(results.score)}
            </p>
          </CardContent>
        </Card>

        {/* Share Success Message */}
        {shareSuccess && (
          <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Muvaffaqiyatli ulashildi!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">{results.score.toFixed(1)}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Ball</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">{results.errors.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Xatolik</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {results.wordCount || extractedText.split(/\s+/).filter(word => word.length > 0).length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">So'z</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {results.confidence ? `${Math.round(results.confidence * 100)}%` : '95%'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Aniqlik</div>
            </CardContent>
          </Card>
        </div>

        {/* Processing Info */}
        {(results.fallback || results.processedAt) && (
          <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">
                📊 Tahlil ma'lumotlari:
              </h4>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                {results.processedAt && (
                  <p>Tahlil vaqti: {new Date(results.processedAt).toLocaleString('uz-UZ')}</p>
                )}
                {results.fallback && (
                  <p>⚠️ Demo rejimda ishladi (API mavjud emas)</p>
                )}
                <p>Til: {results.language || 'O\'zbek'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Error Display */}
        <EnhancedErrorDisplay 
          text={extractedText} 
          errors={results.errors}
        />

        {/* Recommendations */}
        {results.errors.length > 0 && (
          <Card className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                💡 Tavsiyalar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Topilgan xatoliklarni diqqat bilan ko'rib chiqing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Har bir xato uchun bir nechta tuzatish varianti taklif qilingan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Grammatika qoidalarini takrorlash foydali bo'ladi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Keyingi safar yanada yaxshi natija olish uchun harakat qiling</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 backdrop-blur-sm">
        <div className="flex gap-3">
          <Button 
            onClick={() => router.push('/upload')} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl py-3 active:scale-95"
          >
            <Upload className="w-5 h-5 mr-2" />
            Yangi tahlil
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="flex-1 rounded-2xl py-3 active:scale-95"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Qayta ko'rish
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
