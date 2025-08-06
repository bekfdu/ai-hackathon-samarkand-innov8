"use client"

import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, FileText, X, ImageIcon, Loader2, AlertCircle, Copy, CheckCircle } from 'lucide-react'

interface OCRResponse {
  text?: string
  confidence?: number
  language?: string
  fallback?: boolean
  success?: boolean
}

interface EnhancedFileUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onOCRResult?: (result: OCRResponse) => void
}

export function EnhancedFileUploader({ onFileSelect, selectedFile, onOCRResult }: EnhancedFileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [ocrResult, setOcrResult] = useState<OCRResponse | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
        performOCR(file)
      }
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
        performOCR(file)
      }
    }
  }, [onFileSelect])

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      setOcrError('Faqat JPG, PNG, GIF fayllarni yuklash mumkin')
      return false
    }

    if (file.size > maxSize) {
      setOcrError('Fayl hajmi 5MB dan oshmasligi kerak')
      return false
    }

    return true
  }

  const performOCR = async (file: File) => {
    setOcrLoading(true)
    setOcrError("")
    setOcrResult(null)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64String = event.target?.result?.toString().split(",")[1]
        
        if (!base64String) {
          setOcrError("Fayl o'qishda xatolik yuz berdi")
          setOcrLoading(false)
          return
        }

        try {
          const response = await fetch('/api/ocr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64String,
              language: 'auto'
            })
          })

          if (!response.ok) {
            throw new Error(`Server xatosi: ${response.status}`)
          }

          const data: OCRResponse = await response.json()
          setOcrResult(data)
          
          if (onOCRResult) {
            onOCRResult(data)
          }

          if (!data.text || data.text.trim() === '') {
            setOcrError("Rasmdan matn topilmadi. Iltimos, aniqroq rasm yuklang.")
          }
        } catch (err) {
          console.error("OCR Error:", err)
          setOcrError(err instanceof Error ? err.message : "OCR xatoligi yuz berdi")
        } finally {
          setOcrLoading(false)
        }
      }

      reader.onerror = () => {
        setOcrError("Fayl o'qishda xatolik yuz berdi")
        setOcrLoading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      setOcrError("Fayl yuklashda xatolik yuz berdi")
      setOcrLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Nusxa olishda xatolik:', err)
    }
  }

  const removeFile = () => {
    onFileSelect(null as any)
    setOcrResult(null)
    setOcrError("")
    setOcrLoading(false)
  }

  if (selectedFile) {
    return (
      <div className="space-y-4">
        {/* File Info Card */}
        <Card className="border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  {selectedFile.type.startsWith('image/') ? (
                    <ImageIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">{selectedFile.name}</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} className="text-green-600 hover:text-green-700">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OCR Loading */}
        {ocrLoading && (
          <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Matn ajratilmoqda...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OCR Error */}
        {ocrError && (
          <Card className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-red-700 dark:text-red-300 font-medium">{ocrError}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => performOCR(selectedFile)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  Qayta urinish
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OCR Results */}
        {ocrResult && !ocrLoading && (
          <div className="space-y-4">
            {/* Stats */}
            {ocrResult.confidence && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="text-green-800 dark:text-green-200 font-medium text-sm">Aniqlik</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {Math.round((ocrResult.confidence || 0) * 100)}%
                    </div>
                  </CardContent>
                </Card>

                {ocrResult.language && (
                  <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="text-blue-800 dark:text-blue-200 font-medium text-sm">Til</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 uppercase">
                        {ocrResult.language}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {ocrResult.text && (
                  <Card className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                      <div className="text-purple-800 dark:text-purple-200 font-medium text-sm">So'zlar</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {ocrResult.text.split(/\s+/).filter(word => word.length > 0).length}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Extracted Text */}
            {ocrResult.text && (
              <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-purple-100 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Ajratilgan matn
                      {ocrResult.fallback && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                          Demo
                        </span>
                      )}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(ocrResult.text || '')}
                      className="text-xs"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                          Nusxa olindi
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Nusxa olish
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                    <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-sm">
                      {ocrResult.text}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        dragActive 
          ? 'border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/50' 
          : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Faylni bu yerga tashlang
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          yoki tugmani bosing
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" className="relative">
            <Camera className="w-4 h-4 mr-2" />
            Rasm olish
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
          
          <Button variant="outline" className="relative">
            <Upload className="w-4 h-4 mr-2" />
            Fayl tanlash
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          JPG, PNG, GIF • Maksimal 5MB
        </div>
      </CardContent>
    </Card>
  )
}
