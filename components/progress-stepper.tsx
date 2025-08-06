"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  progress: number
}

export function ProgressStepper({ steps, currentStep, progress }: ProgressStepperProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isUpcoming = index > currentStep

        return (
          <Card 
            key={step.id} 
            className={`transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border-purple-200 dark:border-purple-700' 
                : isCompleted
                ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-700'
                : 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isActive || isCompleted 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    isActive 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {isCompleted ? 'Bajarildi' : step.description}
                  </p>
                </div>

                {isActive && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {progress}%
                    </div>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
