"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  /**
   * Fallback component to render on error
   */
  fallback?: React.ComponentType<ErrorFallbackProps>
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /**
   * Whether to show error details
   * @default process.env.NODE_ENV === 'development'
   */
  showDetails?: boolean
}

export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  showDetails: boolean
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      const showDetails =
        this.props.showDetails ?? process.env.NODE_ENV === "development"

      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          showDetails={showDetails}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({
  error,
  resetError,
  showDetails,
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-16">
      <div className="max-w-md w-full bg-white rounded-lg border-2 border-red-500 p-24 space-y-24">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="h-64 w-64 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-32 w-32 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center space-y-8">
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Terjadi Kesalahan
          </h1>
          <p className="text-body text-slate-600">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi support jika masalah berlanjut.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {showDetails && (
          <div className="bg-red-50 rounded-lg p-16 space-y-8">
            <p className="text-body-sm font-semibold text-red-900">
              Detail Error (Development):
            </p>
            <pre className="text-caption text-red-800 overflow-x-auto whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.stack && (
              <details className="text-caption text-red-700">
                <summary className="cursor-pointer hover:text-red-900 font-medium">
                  Stack Trace
                </summary>
                <pre className="mt-8 overflow-x-auto whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-12">
          <Button onClick={resetError} className="flex-1">
            <RefreshCw className="h-16 w-16 mr-8" />
            Coba Lagi
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard">
              <Home className="h-16 w-16 mr-8" />
              Ke Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook to handle errors in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}

/**
 * Simple error fallback for section-level errors
 */
interface SectionErrorFallbackProps {
  error: Error
  resetError: () => void
  message?: string
}

export function SectionErrorFallback({
  error,
  resetError,
  message = "Gagal memuat bagian ini",
}: SectionErrorFallbackProps) {
  return (
    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-24 space-y-16">
      <div className="flex items-start gap-12">
        <AlertTriangle className="h-24 w-24 text-red-600 flex-shrink-0 mt-4" />
        <div className="flex-1 space-y-8">
          <p className="text-body font-semibold text-red-900">{message}</p>
          <p className="text-body-sm text-red-700">{error.message}</p>
        </div>
      </div>
      <Button onClick={resetError} variant="outline" size="sm">
        <RefreshCw className="h-16 w-16 mr-8" />
        Coba Lagi
      </Button>
    </div>
  )
}
