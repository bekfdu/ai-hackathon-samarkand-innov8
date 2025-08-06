"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Loader2, FileText, Copy, RefreshCw } from 'lucide-react'
import { checkGrammar, calculateScore } from '@/lib/api-services'
import { EnhancedErrorDisplay } from './enhanced-error-display'

interface GrammarError {
  position: number
  length?: number
  text: string
  corrections: string[] // Multiple suggestions
  correction: string // Primary correction
  type: 'spelling' | 'grammar' | 'style'
  description: string
  sentence_start?: number
  sentence_end?: number
}

interface GrammarResult {
  errors: GrammarError[]
  score: number
  source: string
  fallback?: boolean
}

interface GrammarCheckerProps {
  initialText?: string
  onResult?: (result: GrammarResult) => void
  className?: string
}

export function GrammarChecker({ initialText = "", onResult, className = "" }: GrammarCheckerProps) {
  const [text, setText] = useState(initialText)
  const [originalText, setOriginalText] = useState(initialText)
  const [result, setResult] = useState<GrammarResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheck = async () => {
    if (!text.trim()) {
      setError("Iltimos, tekshirish uchun matn kiriting")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setOriginalText(text)

    try {
      console.log('Starting grammar check for text:', text.substring(0, 100) + '...')
      
      const grammarResponse = await checkGrammar(text, 'uzbek')
      const score = calculateScore(text, grammarResponse.errors)
      
      const finalResult: GrammarResult = {
        errors: grammarResponse.errors,
        score: score,
        source: grammarResponse.source || 'unknown',
        fallback: grammarResponse.fallback
      }
      
      setResult(finalResult)
      
      if (onResult) {
        onResult(finalResult)
      }
      
      console.log('Grammar check completed:', {
        errorsFound: grammarResponse.errors.length,
        score: score,
        source: grammarResponse.source,
        errorsWithMultipleSuggestions: grammarResponse.errors.filter(e => e.corrections && e.corrections.length > 1).length
      })
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Grammatika tekshirishda xatolik yuz berdi"
      setError(errorMessage)
      console.error("Grammar Check Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyCorrection = (errorIndex: number, selectedCorrection: string) => {
    if (!result) return
    
    const error = result.errors[errorIndex]
    const startPos = error.position
    const endPos = startPos + (error.length || error.text.length)
    
    const newText = text.slice(0, startPos) + selectedCorrection + text.slice(endPos)
    setText(newText)
    
    console.log(`Applied correction: "${error.text}" → "${selectedCorrection}"`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'A\'lo'
    if (score >= 8) return 'Yaxshi'
    if (score >= 6) return 'Qoniqarli'
    return 'Yaxshilanishi kerak'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Grammatika Tekshirish
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Matnni grammatika va imlo xatoliklari uchun tekshiring
        </p>
      </div>

      {/* Text Input */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-purple-100 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="w-5 h-5" />
            Matn kiriting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bu yerga tekshirmoqchi bo'lgan matningizni yozing..."
            className="min-h-[120px] resize-none"
            disabled={loading}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {text.length} belgi, {text.split(/\s+/).filter(word => word.length > 0).length} so'z
            </div>
            
            <div className="flex gap-2">
              {result && text !== originalText && (
                <Button 
                  onClick={() => {
                    setText(originalText)
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Asl matn
                </Button>
              )}
              
              <Button 
                onClick={handleCheck}
                disabled={loading || !text.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tekshirish
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
              <div className="text-center">
                <div className="text-blue-700 dark:text-blue-300 font-medium text-lg">
                  Grammatika tekshirilmoqda...
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                  Tahrirchi.uz API orqali tahlil qilinmoqda
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-red-700 dark:text-red-300 font-medium mb-1">
                  Xatolik yuz berdi
                </div>
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCheck}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Qayta urinish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && !loading && !error && (
        <div className="space-y-6">
          {/* Score Display */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="text-6xl font-bold">
                  <span className={getScoreColor(result.score)}>
                    {result.score.toFixed(1)}
                  </span>
                  <span className="text-2xl text-gray-500 dark:text-gray-400">/10</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getScoreLabel(result.score)}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Manba: {result.source}
                    </span>
                    {result.fallback && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                        Demo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Error Display with Multiple Suggestions */}
          <EnhancedErrorDisplay 
            text={originalText}
            errors={result.errors}
            onApplyCorrection={handleApplyCorrection}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => {
                setText("")
                setOriginalText("")
                setResult(null)
                setError("")
              }}
              variant="outline"
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Yangi matn
            </Button>
            
            <Button
              onClick={handleCheck}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Qayta tekshirish
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
