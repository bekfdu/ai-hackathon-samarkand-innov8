"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, AlertCircle, Settings } from 'lucide-react'
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

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setError("")
    setOcrResult(null)
  }, [])

  const handleOCRResult = useCallback((result: OCRResponse) => {
    setOcrResult(result)
    if (result.text) {
      localStorage.setItem('extractedText', result.text)
      localStorage.setItem('ocrConfidence', (result.confidence || 0.95).toString())
      localStorage.setItem('ocrFallback', result.fallback ? 'true' : 'false')
    }
  }, [])

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

    try {
      const reader = new FileReader()
      reader.onload = () => {
        localStorage.setItem('uploadedFile', JSON.stringify({
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          data: reader.result,
          language: selectedLanguage,
          ocrCompleted: true
        }))
        router.push('/processing')
      }
      reader.readAsDataURL(selectedFile)
    } catch (err) {
      setError("Fayl yuklashda xatolik yuz berdi")
      setIsUploading(false)
    }
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Sozlamalar
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Til tanlang
                  </label>
                  <LanguageSelector value={selectedLanguage} onValueChange={setSelectedLanguage} />
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rasm yuklang
            </h3>
            <EnhancedFileUploader 
              onFileSelect={handleFileSelect} 
              selectedFile={selectedFile}
              onOCRResult={handleOCRResult}
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 border animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 border">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-sm">
              💡 Maslahatlar:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Yaxshi yorug'likda rasm oling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Matn aniq ko'rinishi kerak</span>
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
          {isUploading ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
              Yuklanmoqda...
            </>
          ) : !ocrResult?.text ? (
            <>
              <Upload className="w-6 h-6 mr-3" />
              OCR kutilmoqda...
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 mr-3" />
              Grammatika tahlili
            </>
          )}
        </Button>
      </div>
    </MobileLayout>
  )
}
