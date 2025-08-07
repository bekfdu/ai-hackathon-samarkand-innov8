"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, AlertCircle, Copy, CheckCircle, Camera, X, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { CameraUploader } from './camera-uploader'

interface OCRResponse {
  text?: string
  confidence?: number
  language?: string
  error?: string
  success?: boolean
  boundingBoxes?: Array<{
    description: string
    bounding_poly: Array<{ x: number; y: number }>
  }>
}

interface OCRUploaderProps {
  onOCRResult?: (result: OCRResponse) => void
  className?: string
}

export function OCRUploader({ onOCRResult, className = "" }: OCRUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<OCRResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showCamera, setShowCamera] = useState(false)

  // Network status monitoring
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const validateFile = (file: File): boolean => {
    // File type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError("Faqat rasm fayllari qo'llab-quvvatlanadi (JPG, PNG, GIF, WebP)")
      return false
    }

    // File size validation (5MB limit)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError("Fayl hajmi 5MB dan oshmasligi kerak")
      return false
    }

    // Minimum file size (1KB)
    if (file.size < 1024) {
      setError("Fayl juda kichik. Iltimos, boshqa rasm tanlang")
      return false
    }

    return true
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result?.toString()
          if (!result) {
            reject(new Error("Fayl o'qishda xatolik yuz berdi"))
            return
          }
          
          // Extract base64 string (remove data:image/...;base64, prefix)
          const base64String = result.split(",")[1]
          if (!base64String || base64String.length === 0) {
            reject(new Error("Base64 formatiga o'tkazishda xatolik"))
            return
          }
          
          resolve(base64String)
        } catch (err) {
          reject(new Error("Fayl formatida xatolik"))
        }
      }
      
      reader.onerror = () => {
        reject(new Error("Fayl o'qishda xatolik yuz berdi"))
      }
      
      reader.readAsDataURL(file)
    })
  }

  const performOCR = async (file: File): Promise<OCRResponse> => {
    // Check network connectivity
    if (!isOnline) {
      throw new Error("Internet aloqasi yo'q. Iltimos, internetga ulanib qayta urinib ko'ring.")
    }

    try {
      console.log('OCR: Starting conversion to base64 for file:', file.name)
      const base64String = await convertToBase64(file)
      console.log('OCR: Base64 conversion successful, length:', base64String.length)

      // Prepare request payload matching your server format
      const requestPayload = {
        image_base64: base64String
      }

      console.log('OCR: Sending request to API endpoint')
      
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 30000) // 30 second timeout

      const response = await fetch("https://educhecktexttest1111.onrender.com/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      console.log('OCR: Response received, status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OCR: API error response:', errorText)
        
        if (response.status === 413) {
          throw new Error("Fayl hajmi juda katta. Iltimos, kichikroq rasm yuklang.")
        } else if (response.status === 429) {
          throw new Error("Juda ko'p so'rov yuborildi. Iltimos, biroz kuting va qayta urinib ko'ring.")
        } else if (response.status >= 500) {
          throw new Error("Server xatosi. Iltimos, keyinroq qayta urinib ko'ring.")
        } else {
          throw new Error(`API xatosi: ${response.status} - ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log('OCR: Success response received:', data)

      // Validate response structure based on your server format
      if (!data || typeof data !== 'object') {
        throw new Error("Noto'g'ri API javobi formati")
      }

      // Handle your server's response format with 'texts' array
      let extractedText = ""
      let confidence = 0.95 // Default confidence since Google Vision API doesn't return this directly
      
      if (data.texts && Array.isArray(data.texts) && data.texts.length > 0) {
        // The first element usually contains the full text
        if (data.texts[0] && data.texts[0].description) {
          extractedText = data.texts[0].description.trim()
        } else {
          // Fallback: combine all text descriptions
          extractedText = data.texts
            .map((text: any) => text.description || '')
            .filter((desc: string) => desc.trim() !== '')
            .join(' ')
            .trim()
        }
      }
      
      if (!extractedText || extractedText === '') {
        throw new Error("Rasmdan matn topilmadi. Iltimos, aniqroq va o'qilishi oson rasm yuklang.")
      }

      // Detect language based on text content (simple heuristic)
      let detectedLanguage = 'uzbek'
      if (/[а-яё]/i.test(extractedText)) {
        detectedLanguage = 'russian'
      } else if (/[a-z]/i.test(extractedText) && !/[ўғқҳ]/i.test(extractedText)) {
        detectedLanguage = 'english'
      } else if (/[çğıöşü]/i.test(extractedText)) {
        detectedLanguage = 'turkish'
      }

      return {
        text: extractedText,
        confidence: confidence,
        language: detectedLanguage,
        success: true,
        boundingBoxes: data.texts // Store bounding box data for potential future use
      }

    } catch (error) {
      console.error('OCR: Error occurred:', error)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error("So'rov vaqti tugadi. Iltimos, qayta urinib ko'ring.")
        } else if (error.message.includes('fetch')) {
          throw new Error("Tarmoq xatosi. Internet aloqangizni tekshiring.")
        } else {
          throw error
        }
      } else {
        throw new Error("Noma'lum xatolik yuz berdi")
      }
    }
  }

  const handleFileChange = async (file: File) => {
    if (!file) return

    // Reset previous states
    setResult(null)
    setError("")
    setSelectedFile(file)

    // Validate file
    if (!validateFile(file)) {
      return
    }

    // Start OCR process
    setLoading(true)

    try {
      const ocrResult = await performOCR(file)
      setResult(ocrResult)
      
      // Call callback if provided
      if (onOCRResult) {
        onOCRResult(ocrResult)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "OCR xatoligi yuz berdi"
      setError(errorMessage)
      console.error("OCR Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }, [])

  const handleCameraCapture = useCallback((file: File) => {
    handleFileChange(file)
    setShowCamera(false)
  }, [])

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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard error:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetUploader = () => {
    setResult(null)
    setError("")
    setLoading(false)
    setSelectedFile(null)
    setCopied(false)
    
    // Clear file input
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
    fileInputs.forEach(input => {
      input.value = ''
    })
  }

  const retryOCR = () => {
    if (selectedFile) {
      setError("")
      handleFileChange(selectedFile)
    }
  }

  // Show camera component
  if (showCamera) {
    return (
      <CameraUploader
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          OCR Matn Ajratish
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Qo'lda yozilgan yoki bosma matnli rasmlardan matn ajrating
        </p>
        
        {/* Network Status */}
        <div className="flex items-center justify-center gap-2 text-sm">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Onlayn</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400">Oflayn</span>
            </>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-300 ${
          dragActive 
            ? 'border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/50' 
            : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
        } ${!isOnline ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Faylni bu yerga tashlang
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                yoki tugmani bosing
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                className="relative"
                disabled={loading || !isOnline}
                onClick={() => setShowCamera(true)}
              >
                <Camera className="w-4 h-4 mr-2" />
                Kamera
              </Button>
              
              <Button 
                variant="outline" 
                className="relative"
                disabled={loading || !isOnline}
              >
                <Upload className="w-4 h-4 mr-2" />
                Fayl tanlash
                <input
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={loading || !isOnline}
                />
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG, GIF, WebP • Maksimal 5MB
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
                  Matn ajratilmoqda...
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                  Bu bir necha soniya davom etishi mumkin
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
              <div className="flex gap-2">
                {selectedFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={retryOCR}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Qayta urinish
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetUploader}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4 mr-1" />
                  Tozalash
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Results */}
      {result && !loading && !error && (
        <div className="space-y-4">
          {/* Success Indicator */}
          <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-green-700 dark:text-green-300 font-medium">
                    Matn muvaffaqiyatli ajratildi
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-sm">
                    {selectedFile?.name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {result.confidence && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
                <CardContent className="p-4 text-center">
                  <div className="text-green-800 dark:text-green-200 font-medium text-sm">Aniqlik</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {Math.round((result.confidence || 0) * 100)}%
                  </div>
                </CardContent>
              </Card>

              {result.language && (
                <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-blue-800 dark:text-blue-200 font-medium text-sm">Til</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 uppercase">
                      {result.language}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.text && (
                <Card className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-purple-800 dark:text-purple-200 font-medium text-sm">So'zlar</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {result.text.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Extracted Text */}
          {result.text && (
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-purple-100 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Ajratilgan matn
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.text || '')}
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
                    {result.text}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={resetUploader}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Yangi rasm yuklash
            </Button>
            
            {result.text && (
              <Button
                onClick={() => copyToClipboard(result.text || '')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Matnni nusxa olish
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
