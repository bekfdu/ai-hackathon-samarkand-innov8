"use client"

import { MobileLayout } from "@/components/mobile-layout"
import { MobileHeader } from "@/components/mobile-header"
import { GrammarChecker } from "@/components/grammar-checker"

export default function GrammarPage() {
  return (
    <MobileLayout currentPage="grammar">
      <MobileHeader 
        title="Grammatika Tekshirish" 
        showBack={true}
      />

      <div className="px-4 py-6">
        <GrammarChecker />
      </div>
    </MobileLayout>
  )
}
