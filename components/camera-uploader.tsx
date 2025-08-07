"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw, Check, AlertCircle, Loader2 } from 'lucide-react'

interface CameraUploaderProps {
  onCapture: (file: File) => void
  onClose: () => void
  className?: string
}

export function CameraUploader({ onCapture, onClose, className = "" }: CameraUploaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState("")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = useCallback(async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError("Kamera ruxsati berilmadi. Brauzer sozlamalarida kamera ruxsatini yoqing.")
        } else if (err.name === 'NotFoundError') {
          setError("Kamera topilmadi. Qurilmangizda kamera mavjudligini tekshiring.")
        } else if (err.name === 'NotSupportedError') {
          setError("Kamera qo'llab-quvvatlanmaydi. HTTPS orqali kirish talab qilinadi.")
        } else {
          setError("Kameraga kirish xatosi: " + err.message)
        }
      } else {
        setError("Noma'lum kamera xatosi yuz berdi")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert to data URL
    const dataURL = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(dataURL)
    
    // Stop camera stream
    stopCamera()
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const confirmPhoto = useCallback(() => {
    if (!capturedImage) return
    
    // Convert data URL to File
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })
        onCapture(file)
        onClose()
      })
      .catch(err => {
        console.error('Error converting image:', err)
        setError("Rasmni saqlashda xatolik yuz berdi")
      })
  }, [capturedImage, onCapture, onClose])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Auto-start camera when component mounts
  React.useEffect(() => {
    startCamera()
  }, [startCamera])

  return (
    <div className={`fixed inset-0 z-50 bg-black ${className}`}>
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 safe-area-pt">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
            <h1 className="text-white font-semibold">Rasm olish</h1>
            <div className="w-10 h-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Kamera ishga tushirilmoqda...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black p-6">
              <Card className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 max-w-sm">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    Kamera xatosi
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                    {error}
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={startCamera}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Qayta urinish
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full"
                    >
                      Yopish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {capturedImage ? (
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          )}

          {/* Camera overlay guides */}
          {isStreaming && !capturedImage && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner guides */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 border-l-2 border-t-2 border-white/50"></div>
              <div className="absolute top-1/4 right-1/4 w-8 h-8 border-r-2 border-t-2 border-white/50"></div>
              <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-l-2 border-b-2 border-white/50"></div>
              <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-r-2 border-b-2 border-white/50"></div>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white text-sm text-center">
                    Matnni ramka ichiga joylashtiring
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm safe-area-pb">
          <div className="flex items-center justify-center p-6">
            {capturedImage ? (
              <div className="flex items-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={retakePhoto}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full px-6"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Qayta olish
                </Button>
                <Button
                  size="lg"
                  onClick={confirmPhoto}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Tasdiqlash
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={capturePhoto}
                disabled={!isStreaming}
                className="w-20 h-20 rounded-full bg-white border-4 border-white/50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-8 h-8 text-black" />
              </Button>
            )}
          </div>
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
