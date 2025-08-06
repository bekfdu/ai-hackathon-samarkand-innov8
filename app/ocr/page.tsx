"use client"

import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"
import { OCRUploader } from "@/components/ocr-uploader"

export default function OCRPage() {
  return (
    <MobileLayout currentPage="ocr">
      <MobileHeader 
        title="OCR Matn Ajratish" 
        showBack={true}
      />

      <div className="px-4 py-6">
        <OCRUploader />
      </div>
    </MobileLayout>
  )
}
