/**
 * Currency formatting utilities for Indonesian Rupiah
 */

/**
 * Format number to Indonesian Rupiah currency
 */
export function formatCurrency(amount: number, options?: {
  showSymbol?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}): string {
  const {
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {}

  const formatted = new Intl.NumberFormat("id-ID", {
    style: showSymbol ? "currency" : "decimal",
    currency: "IDR",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)

  return formatted
}

/**
 * Format to compact notation (e.g., 1.5M, 2.3K)
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`
  }
  return formatCurrency(amount)
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/\D/g, "")) || 0
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format large numbers with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}
