"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = score / steps
    const progressIncrement = (score * 10) / steps // Convert to percentage

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setAnimatedScore(Math.min(increment * currentStep, score))
      setAnimatedProgress(Math.min(progressIncrement * currentStep, score * 10))
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'A\'lo'
    if (score >= 8) return 'Yaxshi'
    if (score >= 6) return 'Qoniqarli'
    return 'Yaxshilanishi kerak'
  }

  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${
              score >= 8 
                ? 'text-green-500' 
                : score >= 6 
                ? 'text-yellow-500' 
                : 'text-red-500'
            }`}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(animatedScore)}`}>
              {animatedScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">/ 10</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Ball: {animatedScore.toFixed(1)}/10
        </h3>
        <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </p>
      </div>
    </div>
  )
}
