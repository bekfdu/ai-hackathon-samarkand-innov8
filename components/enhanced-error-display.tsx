"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Check, X, AlertCircle, Lightbulb, BookOpen } from 'lucide-react'

interface GrammarError {
  position: number
  length?: number
  text: string
  corrections: string[] // Multiple suggestions
  correction: string // Primary correction
  type: 'spelling' | 'grammar' | 'style'
  description: string
  sentence_start?: number
  sentence_end?: number
}

interface EnhancedErrorDisplayProps {
  text: string
  errors: GrammarError[]
  onApplyCorrection?: (errorIndex: number, selectedCorrection: string) => void
  className?: string
}

export function EnhancedErrorDisplay({ 
  text, 
  errors, 
  onApplyCorrection,
  className = "" 
}: EnhancedErrorDisplayProps) {
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set())
  const [selectedCorrections, setSelectedCorrections] = useState<{[key: number]: string}>({})
  const [appliedCorrections, setAppliedCorrections] = useState<Set<number>>(new Set())

  const toggleErrorExpansion = (index: number) => {
    const newExpanded = new Set(expandedErrors)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedErrors(newExpanded)
  }

  const handleCorrectionSelect = (errorIndex: number, correction: string) => {
    setSelectedCorrections(prev => ({
      ...prev,
      [errorIndex]: correction
    }))
  }

  const handleApplyCorrection = (errorIndex: number) => {
    const selectedCorrection = selectedCorrections[errorIndex] || errors[errorIndex].correction
    setAppliedCorrections(prev => new Set([...prev, errorIndex]))
    
    if (onApplyCorrection) {
      onApplyCorrection(errorIndex, selectedCorrection)
    }
  }

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'spelling': return <AlertCircle className="w-4 h-4" />
      case 'grammar': return <BookOpen className="w-4 h-4" />
      case 'style': return <Lightbulb className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'spelling': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700'
      case 'grammar': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
      case 'style': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700'
      default: return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
    }
  }

  const getErrorTypeLabel = (type: string) => {
    switch (type) {
      case 'spelling': return 'Imlo xatosi'
      case 'grammar': return 'Grammatika xatosi'
      case 'style': return 'Uslub tavsiyasi'
      default: return 'Xatolik'
    }
  }

  const highlightTextWithErrors = () => {
    if (errors.length === 0) return text

    let highlightedText = text
    let offset = 0

    // Sort errors by position to process them in order
    const sortedErrors = [...errors].sort((a, b) => a.position - b.position)

    sortedErrors.forEach((error, index) => {
      const startPos = error.position + offset
      const endPos = startPos + (error.length || error.text.length)
      
      const before = highlightedText.slice(0, startPos)
      const errorText = highlightedText.slice(startPos, endPos)
      const after = highlightedText.slice(endPos)
      
      const isApplied = appliedCorrections.has(index)
      const selectedCorrection = selectedCorrections[index] || error.correction
      
      const highlightClass = isApplied 
        ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
        : error.type === 'spelling' 
        ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
        : error.type === 'grammar'
        ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
        : 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
      
      const highlightedError = `<span class="${highlightClass} px-1 rounded cursor-pointer underline decoration-2" data-error-index="${index}" title="${error.description}">${isApplied ? selectedCorrection : errorText}</span>`
      
      highlightedText = before + highlightedError + after
      offset += highlightedError.length - (endPos - startPos)
    })

    return highlightedText
  }

  if (errors.length === 0) {
    return (
      <Card className={`bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 ${className}`}>
        <CardContent className="p-6 text-center">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
            Xatolik topilmadi!
          </h3>
          <p className="text-green-600 dark:text-green-400">
            Matn grammatik va imloviy jihatdan to'g'ri yozilgan
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Highlighted Text */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-purple-100 dark:border-purple-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Xatoliklar bilan belgilangan matn
          </h3>
          <div 
            className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border text-gray-900 dark:text-white leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightTextWithErrors() }}
          />
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Imlo xatosi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Grammatika xatosi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Uslub tavsiyasi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Tuzatilgan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Topilgan xatoliklar ({errors.length})
        </h3>
        
        {errors.map((error, index) => {
          const isExpanded = expandedErrors.has(index)
          const isApplied = appliedCorrections.has(index)
          const selectedCorrection = selectedCorrections[index] || error.correction
          
          return (
            <Card 
              key={index} 
              className={`border-l-4 ${getErrorTypeColor(error.type)} ${isApplied ? 'opacity-75' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`${getErrorTypeColor(error.type)} border`}>
                        {getErrorTypeIcon(error.type)}
                        <span className="ml-1">{getErrorTypeLabel(error.type)}</span>
                      </Badge>
                      
                      {isApplied && (
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
                          <Check className="w-3 h-3 mr-1" />
                          Tuzatildi
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Xato: </span>
                        <span className="line-through text-red-600 dark:text-red-400 font-medium">
                          "{error.text}"
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Tavsiya: </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          "{selectedCorrection}"
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {error.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!isApplied && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyCorrection(index)}
                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Qo'llash
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleErrorExpansion(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {/* Multiple Corrections Dropdown */}
                    {error.corrections && error.corrections.length > 1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tuzatish variantlari ({error.corrections.length}):
                        </label>
                        <Select
                          value={selectedCorrection}
                          onValueChange={(value) => handleCorrectionSelect(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Variant tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {error.corrections.map((correction, corrIndex) => (
                              <SelectItem key={corrIndex} value={correction}>
                                <div className="flex items-center justify-between w-full">
                                  <span>"{correction}"</span>
                                  {corrIndex === 0 && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      Tavsiya
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {/* Context Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Pozitsiya:</span> {error.position}
                      </div>
                      {error.length && (
                        <div>
                          <span className="font-medium">Uzunlik:</span> {error.length}
                        </div>
                      )}
                      {error.sentence_start !== undefined && (
                        <div>
                          <span className="font-medium">Jumla boshi:</span> {error.sentence_start}
                        </div>
                      )}
                      {error.sentence_end !== undefined && (
                        <div>
                          <span className="font-medium">Jumla oxiri:</span> {error.sentence_end}
                        </div>
                      )}
                    </div>
                    
                    {/* Context Preview */}
                    {error.sentence_start !== undefined && error.sentence_end !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Kontekst:
                        </label>
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                          {text.slice(error.sentence_start, error.sentence_end)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
