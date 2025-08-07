"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, AlertCircle, Settings, CheckCircle, Clock, Zap } from 'lucide-react'
import { useRouter } from "next/navigation"
import { EnhancedFileUploader } from "@/components/enhanced-file-uploader"
import { LanguageSelector } from "@/components/language-selector"
import { APIStatus } from "@/components/api-status"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"

interface OCRResponse {
  text?: string
  confidence?: number
  language?: string
  fallback?: boolean
  success?: boolean
}

export default function UploadPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("uzbek")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [ocrResult, setOcrResult] = useState<OCRResponse | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Auto-hide settings after language selection
  useEffect(() => {
    if (selectedLanguage && showSettings) {
      const timer = setTimeout(() => setShowSettings(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [selectedLanguage, showSettings])

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setError("")
    setOcrResult(null)
    setUploadProgress(0)
  }, [])

  const handleOCRResult = useCallback((result: OCRResponse) => {
    setOcrResult(result)
    if (result.text) {
      localStorage.setItem('extractedText', result.text)
      localStorage.setItem('ocrConfidence', (result.confidence || 0.95).toString())
      localStorage.setItem('ocrFallback', result.fallback ? 'true' : 'false')
      localStorage.setItem('selectedLanguage', selectedLanguage)
    }
  }, [selectedLanguage])

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Iltimos, fayl tanlang")
      return
    }

    if (!ocrResult || !ocrResult.text) {
      setError("OCR natijasi kutilmoqda. Iltimos, biroz kuting.")
      return
    }

    setIsUploading(true)
    setError("")
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const reader = new FileReader()
      reader.onload = () => {
        localStorage.setItem('uploadedFile', JSON.stringify({
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          data: reader.result,
          language: selectedLanguage,
          ocrCompleted: true,
          uploadTime: new Date().toISOString()
        }))
        
        setUploadProgress(100)
        clearInterval(progressInterval)
        
        setTimeout(() => {
          router.push('/processing')
        }, 500)
      }
      
      reader.onerror = () => {
        setError("Fayl yuklashda xatolik yuz berdi")
        setIsUploading(false)
        setUploadProgress(0)
        clearInterval(progressInterval)
      }
      
      reader.readAsDataURL(selectedFile)
    } catch (err) {
      setError("Fayl yuklashda xatolik yuz berdi")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getUploadButtonText = () => {
    if (isUploading) {
      return `Yuklanmoqda... ${uploadProgress}%`
    }
    if (!ocrResult?.text) {
      return "OCR kutilmoqda..."
    }
    return "Grammatika tahlili"
  }

  const getUploadButtonIcon = () => {
    if (isUploading) {
      return <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
    }
    if (!ocrResult?.text) {
      return <Clock className="w-6 h-6" />
    }
    return <Zap className="w-6 h-6" />
  }

  return (
    <MobileLayout currentPage="upload">
      <MobileHeader 
        title="Insho yuklash" 
        showBack={true}
        rightAction={
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-10 h-10"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Language Selection - Collapsible */}
        {showSettings && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in-up">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Sozlamalar
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Matn tili
                  </label>
                  <LanguageSelector value={selectedLanguage} onValueChange={setSelectedLanguage} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bu grammatika tekshirish uchun ishlatiladi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Status */}
        <APIStatus />

        {/* File Upload */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rasm yuklang
              </h3>
            </div>
            <EnhancedFileUploader 
              onFileSelect={handleFileSelect} 
              selectedFile={selectedFile}
              onOCRResult={handleOCRResult}
            />
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Fayl yuklanmoqda...
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {uploadProgress}% tugallandi
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 border animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Xatolik yuz berdi</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {ocrResult?.text && !isUploading && (
          <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 border animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">OCR muvaffaqiyatli tugallandi</p>
                  <p className="text-sm">
                    {ocrResult.text.split(' ').length} so'z ajratildi
                    {ocrResult.confidence && ` • ${Math.round(ocrResult.confidence * 100)}% aniqlik`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 border">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-sm">
              💡 Eng yaxshi natija uchun:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Yaxshi yorug'likda va aniq rasm oling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Matn to'liq ko'rinishi kerak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>JPG, PNG, GIF formatida yuklang</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Maksimal hajm: 5MB</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 backdrop-blur-sm">
        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || !ocrResult?.text || isUploading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 active:scale-95"
        >
          {getUploadButtonIcon()}
          <span className="ml-3">{getUploadButtonText()}</span>
        </Button>
      </div>
    </MobileLayout>
  )
}
