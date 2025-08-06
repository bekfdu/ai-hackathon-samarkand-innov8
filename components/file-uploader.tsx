"use client"

import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, FileText, X, ImageIcon } from 'lucide-react'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)

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
      }
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Faqat JPG, PNG yoki PDF fayllarni yuklash mumkin')
      return false
    }

    if (file.size > maxSize) {
      alert('Fayl hajmi 10MB dan oshmasligi kerak')
      return false
    }

    return true
  }

  const removeFile = () => {
    onFileSelect(null as any)
  }

  if (selectedFile) {
    return (
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
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          JPG, PNG, PDF • Maksimal 10MB
        </div>
      </CardContent>
    </Card>
  )
}
