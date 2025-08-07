"use client"

import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"
import { GrammarChecker } from "@/components/grammar-checker"
import { APIStatus } from "@/components/api-status"

export default function GrammarPage() {
  return (
    <MobileLayout currentPage="grammar">
      <MobileHeader 
        title="Grammatika Tekshirish" 
        showBack={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* API Status */}
        <APIStatus />
        
        {/* Grammar Checker Component */}
        <GrammarChecker />
      </div>
    </MobileLayout>
  )
}
