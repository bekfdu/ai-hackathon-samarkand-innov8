"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import { ProgressStepper } from "@/components/progress-stepper"
import { performOCR, checkGrammar, calculateScore } from "@/lib/api-services"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"

export default function ProcessingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(15)
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const [processingStatus, setProcessingStatus] = useState("")

  const steps = [
    { id: 1, title: "Rasmdan matn ajratish", description: "OCR texnologiyasi ishlamoqda..." },
    { id: 2, title: "Grammatika tekshirish", description: "Xatoliklar qidirilmoqda..." },
    { id: 3, title: "Natijalarni tayyorlash", description: "Tahlil yakunlanmoqda..." }
  ]

  useEffect(() => {
    const fileData = localStorage.getItem('uploadedFile')
    if (!fileData) {
      router.push('/upload')
      return
    }

    const processFile = async () => {
      try {
        const fileInfo = JSON.parse(fileData)
        console.log('Processing file:', fileInfo.name, 'Language:', fileInfo.language)
        
        setProcessingStatus("Fayl tayyorlanmoqda...")
        
        let ocrResult
        
        if (fileInfo.ocrCompleted) {
          const extractedText = localStorage.getItem('extractedText')
          const ocrConfidence = localStorage.getItem('ocrConfidence')
          const ocrFallback = localStorage.getItem('ocrFallback')
          
          if (extractedText) {
            console.log('Using pre-completed OCR result')
            ocrResult = {
              text: extractedText,
              confidence: parseFloat(ocrConfidence || '0.95'),
              language: fileInfo.language,
              fallback: ocrFallback === 'true'
            }
            
            setCurrentStep(1)
            setProgress(100)
          } else {
            const response = await fetch(fileInfo.data)
            const blob = await response.blob()
            const file = new File([blob], fileInfo.name, { type: fileInfo.type })
            
            setCurrentStep(0)
            setProgress(0)
            setProcessingStatus("Rasmdan matn ajratilmoqda...")
            ocrResult = await performOCRWithProgress(file)
          }
        } else {
          const response = await fetch(fileInfo.data)
          const blob = await response.blob()
          const file = new File([blob], fileInfo.name, { type: fileInfo.type })
          
          setCurrentStep(0)
          setProgress(0)
          setProcessingStatus("Rasmdan matn ajratilmoqda...")
          ocrResult = await performOCRWithProgress(file)
        }
        
        setCurrentStep(1)
        setProgress(0)
        setProcessingStatus("Grammatika tekshirilmoqda...")
        const grammarResult = await performGrammarCheckWithProgress(ocrResult.text, fileInfo.language)
        
        setCurrentStep(2)
        setProgress(0)
        setProcessingStatus("Natijalar tayyorlanmoqda...")
        await prepareResultsWithProgress(ocrResult, grammarResult)
        
        setProcessingStatus("Tayyor!")
        router.push('/results')
        
      } catch (err) {
        console.error('Processing error details:', err)
        const errorMessage = err instanceof Error ? err.message : "Tahlil qilishda xatolik yuz berdi"
        setError(errorMessage)
        setProcessingStatus("Xatolik yuz berdi")
      }
    }

    processFile()
  }, [router, retryCount])

  const performOCRWithProgress = async (file: File) => {
    const startTime = Date.now()
    setEstimatedTime(20)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const elapsed = (Date.now() - startTime) / 1000
        const newProgress = Math.min(90, (elapsed / 20) * 100)
        setEstimatedTime(Math.max(1, 20 - elapsed))
        return newProgress
      })
    }, 200)

    try {
      console.log('Starting OCR for file:', file.name)
      const result = await performOCR(file)
      console.log('OCR completed successfully')
      
      clearInterval(progressInterval)
      setProgress(100)
      
      localStorage.setItem('extractedText', result.text)
      localStorage.setItem('ocrConfidence', result.confidence.toString())
      localStorage.setItem('ocrFallback', result.fallback ? 'true' : 'false')
      
      return result
    } catch (error) {
      clearInterval(progressInterval)
      console.error('OCR Progress Error:', error)
      throw new Error(`OCR xatoligi: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`)
    }
  }

  const performGrammarCheckWithProgress = async (text: string, language: string) => {
    const startTime = Date.now()
    setEstimatedTime(15)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const elapsed = (Date.now() - startTime) / 1000
        const newProgress = Math.min(90, (elapsed / 15) * 100)
        setEstimatedTime(Math.max(1, 15 - elapsed))
        return newProgress
      })
    }, 200)

    try {
      console.log('Starting grammar check for text length:', text.length)
      const result = await checkGrammar(text, language)
      console.log('Grammar check completed, errors found:', result.errors.length)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      return result
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Grammar Check Progress Error:', error)
      throw new Error(`Grammatika tekshirish xatoligi: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`)
    }
  }

  const prepareResultsWithProgress = async (ocrResult: any, grammarResult: any) => {
    setEstimatedTime(3)
    
    for (let i = 0; i <= 100; i += 25) {
      setProgress(i)
      setEstimatedTime(Math.max(1, 3 - Math.floor(i / 25)))
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    const score = calculateScore(ocrResult.text, grammarResult.errors)
    
    const finalResults = {
      score,
      errors: grammarResult.errors,
      confidence: ocrResult.confidence,
      language: ocrResult.language,
      fallback: ocrResult.fallback || grammarResult.fallback
    }
    
    localStorage.setItem('grammarResults', JSON.stringify(finalResults))
  }

  const handleCancel = () => {
    localStorage.removeItem('uploadedFile')
    localStorage.removeItem('extractedText')
    localStorage.removeItem('grammarResults')
    localStorage.removeItem('ocrConfidence')
    localStorage.removeItem('ocrFallback')
    router.push('/upload')
  }

  const handleRetry = () => {
    setError("")
    setRetryCount(prev => prev + 1)
    setCurrentStep(0)
    setProgress(0)
    setProcessingStatus("")
  }

  if (error) {
    return (
      <MobileLayout>
        <MobileHeader title="Xatolik" showBack={true} />
        <div className="px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Xatolik yuz berdi
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{error}</p>
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl py-3">
                  Qayta urinish
                </Button>
                <Button variant="outline" onClick={handleCancel} className="w-full rounded-2xl py-3">
                  Bekor qilish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <MobileHeader 
        title="Tahlil qilinmoqda" 
        showBack={true}
        rightAction={
          <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full w-10 h-10">
            <X className="w-5 h-5" />
          </Button>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Progress Steps */}
        <ProgressStepper 
          steps={steps} 
          currentStep={currentStep} 
          progress={progress}
        />

        {/* Time Estimate */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl font-bold text-white">
                {Math.ceil(estimatedTime)}s
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Taxminiy vaqt
            </h3>
            
            {processingStatus && (
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-4">
                {processingStatus}
              </p>
            )}
            
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">API ulanishi faol</span>
            </div>
          </CardContent>
        </Card>

        {/* Cancel Button */}
        <div className="pt-4">
          <Button variant="outline" onClick={handleCancel} className="w-full rounded-2xl py-3">
            Bekor qilish
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
