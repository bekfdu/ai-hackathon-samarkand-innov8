"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Share2, Upload, RefreshCw, Trophy, Target, Clock } from 'lucide-react'
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
}

interface ExtendedResults extends Results {
  confidence?: number
  language?: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [extractedText, setExtractedText] = useState("")
  const [results, setResults] = useState<ExtendedResults | null>(null)
  const [loading, setLoading] = useState(true)

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
    
    const content = `EduCheck Tahlil Natijasi\n\nBall: ${results.score}/10\n\nMatn:\n${extractedText}\n\nXatoliklar:\n${results.errors.map(error => `- ${error.text} → ${error.correction} (${error.description})`).join('\n')}`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'educheck-natija.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EduCheck Natijasi',
          text: `Mening inshom ${results?.score}/10 ball oldi!`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
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
              <p className="text-gray-600 dark:text-gray-300 mb-4">Natijalar topilmadi</p>
              <Button onClick={() => router.push('/upload')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl">
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
    if (score >= 6) return "👍"
    return "💪"
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
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
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

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {results.confidence ? `${Math.round(results.confidence * 100)}%` : '95%'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Aniqlik</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Error Display */}
        <EnhancedErrorDisplay 
          text={extractedText} 
          errors={results.errors}
        />
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
            Qayta
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
