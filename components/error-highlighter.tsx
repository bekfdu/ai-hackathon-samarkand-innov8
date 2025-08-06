"use client"

interface GrammarError {
  position: number
  text: string
  correction: string
  type: 'spelling' | 'grammar' | 'style'
  description: string
}

interface ErrorHighlighterProps {
  text: string
  errors: GrammarError[]
}

export function ErrorHighlighter({ text, errors }: ErrorHighlighterProps) {
  const getHighlightClass = (type: string) => {
    switch (type) {
      case 'spelling': return 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
      case 'grammar': return 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
      case 'style': return 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
      default: return 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
    }
  }

  // Sort errors by position to process them in order
  const sortedErrors = [...errors].sort((a, b) => a.position - b.position)

  let highlightedText = text
  let offset = 0

  sortedErrors.forEach((error) => {
    const startPos = error.position + offset
    const endPos = startPos + error.text.length
    
    const before = highlightedText.slice(0, startPos)
    const errorText = highlightedText.slice(startPos, endPos)
    const after = highlightedText.slice(endPos)
    
    const highlightedError = `<span class="${getHighlightClass(error.type)} px-1 rounded cursor-pointer" title="${error.description}: ${error.text} → ${error.correction}">${errorText}</span>`
    
    highlightedText = before + highlightedError + after
    offset += highlightedError.length - error.text.length
  })

  return (
    <div className="prose max-w-none">
      <div 
        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white leading-relaxed"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
    </div>
  )
}
