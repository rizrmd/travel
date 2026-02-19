"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface FormStep {
  id: string
  title: string
  description?: string
  content: React.ReactNode
  isOptional?: boolean
}

interface MultiStepFormProps {
  steps: FormStep[]
  /**
   * Current step index (0-based)
   */
  currentStep: number
  /**
   * Callback when step changes
   */
  onStepChange: (step: number) => void
  /**
   * Callback when form is submitted (on last step)
   */
  onSubmit: () => void
  /**
   * Whether the form is submitting
   */
  isSubmitting?: boolean
  /**
   * Custom next button text
   * @default "Lanjut"
   */
  nextButtonText?: string
  /**
   * Custom back button text
   * @default "Kembali"
   */
  backButtonText?: string
  /**
   * Custom submit button text
   * @default "Selesai"
   */
  submitButtonText?: string
  /**
   * Disable next button (for validation)
   */
  isNextDisabled?: boolean
  /**
   * Show progress bar
   * @default true
   */
  showProgress?: boolean
  /**
   * Show step indicators
   * @default true
   */
  showStepIndicators?: boolean
  /**
   * Additional className for the container
   */
  className?: string
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  isSubmitting = false,
  nextButtonText = "Lanjut",
  backButtonText = "Kembali",
  submitButtonText = "Selesai",
  isNextDisabled = false,
  showProgress = true,
  showStepIndicators = true,
  className,
}: MultiStepFormProps) {
  const totalSteps = steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1
  const progress = ((currentStep + 1) / totalSteps) * 100
  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (!isLastStep) {
      onStepChange(currentStep + 1)
    } else {
      onSubmit()
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1)
    }
  }

  const handleStepClick = (index: number) => {
    // Only allow clicking on previous steps
    if (index < currentStep) {
      onStepChange(index)
    }
  }

  return (
    <div className={cn("space-y-24", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-8">
          <div className="flex justify-between items-center text-body-sm">
            <span className="text-slate-600">
              Langkah {currentStep + 1} dari {totalSteps}
            </span>
            <span className="text-slate-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-8" />
        </div>
      )}

      {/* Step Indicators */}
      {showStepIndicators && (
        <nav aria-label="Langkah form">
          <ol className="flex items-center gap-8 overflow-x-auto pb-8">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep
              const isClickable = index < currentStep

              return (
                <li
                  key={step.id}
                  className={cn(
                    "flex-1 min-w-[120px]",
                    index < totalSteps - 1 && "relative"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={cn(
                      "w-full text-left p-12 rounded-lg transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isCurrent && "bg-blue-50 border-2 border-primary",
                      isCompleted &&
                        !isCurrent &&
                        "bg-green-50 border-2 border-green-500",
                      !isCurrent &&
                        !isCompleted &&
                        "border-2 border-slate-200",
                      isClickable && "cursor-pointer hover:bg-slate-50",
                      !isClickable && "cursor-default"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    <div className="flex items-center gap-8">
                      {/* Step Number/Check */}
                      <div
                        className={cn(
                          "flex-shrink-0 h-24 w-24 rounded-full flex items-center justify-center text-caption font-semibold",
                          isCurrent && "bg-primary text-white",
                          isCompleted &&
                            !isCurrent &&
                            "bg-green-500 text-white",
                          !isCurrent &&
                            !isCompleted &&
                            "bg-slate-200 text-slate-600"
                        )}
                      >
                        {isCompleted && !isCurrent ? (
                          <Check className="h-14 w-14" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      {/* Step Title */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-body-sm font-medium truncate",
                            isCurrent && "text-primary",
                            isCompleted &&
                              !isCurrent &&
                              "text-green-700",
                            !isCurrent &&
                              !isCompleted &&
                              "text-slate-600"
                          )}
                        >
                          {step.title}
                          {step.isOptional && (
                            <span className="text-caption text-slate-500 ml-4">
                              (Opsional)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-24 md:p-32">
        <div className="space-y-16">
          {/* Step Header */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">
              {currentStepData.title}
            </h2>
            {currentStepData.description && (
              <p className="text-body text-slate-600">
                {currentStepData.description}
              </p>
            )}
          </div>

          {/* Step Content */}
          <div>{currentStepData.content}</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-16">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
          className={cn(isFirstStep && "invisible")}
        >
          {backButtonText}
        </Button>

        <div className="flex items-center gap-8 text-caption text-slate-600">
          <span>
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isLastStep
            ? submitButtonText
            : nextButtonText}
        </Button>
      </div>
    </div>
  )
}
