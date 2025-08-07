"use client"

import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"
import { OCRUploader } from "@/components/ocr-uploader"
import { APIStatus } from "@/components/api-status"

export default function OCRPage() {
  return (
    <MobileLayout currentPage="ocr">
      <MobileHeader 
        title="OCR Matn Ajratish" 
        showBack={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* API Status */}
        <APIStatus />
        
        {/* OCR Uploader Component */}
        <OCRUploader />
      </div>
    </MobileLayout>
  )
}
