import { Jamaah } from '../types/jamaah'

export interface SendProgress {
  current: number
  total: number
  status: 'sending' | 'success' | 'partial' | 'error'
  failed: number
}

export type ProgressCallback = (progress: SendProgress) => void

/**
 * Send WhatsApp message to multiple jamaah
 * Opens WhatsApp web/app for each jamaah with pre-filled message
 */
export async function sendBulkWhatsApp(
  jamaahList: Jamaah[],
  message: string,
  onProgress?: ProgressCallback
): Promise<{ success: number; failed: number }> {
  let successCount = 0
  let failedCount = 0
  const total = jamaahList.length

  for (let i = 0; i < jamaahList.length; i++) {
    const jamaah = jamaahList[i]

    try {
      // Substitute merge fields for this specific jamaah
      const personalizedMessage = substituteMergeFields(message, jamaah)

      // Generate WhatsApp deep link
      // Note: In real implementation, phone number would come from jamaah data
      const phoneNumber = generateMockPhoneNumber(jamaah.id)
      const encodedMessage = encodeURIComponent(personalizedMessage)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank')

      successCount++

      // Report progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          status: 'sending',
          failed: failedCount,
        })
      }

      // Wait 2 seconds between sends to avoid rate limiting
      if (i < jamaahList.length - 1) {
        await sleep(2000)
      }
    } catch (error) {
      console.error(`Failed to send WhatsApp to ${jamaah.name}:`, error)
      failedCount++

      // Report progress with error
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          status: failedCount === total ? 'error' : 'sending',
          failed: failedCount,
        })
      }
    }
  }

  // Final progress callback
  if (onProgress) {
    const finalStatus =
      failedCount === 0
        ? 'success'
        : failedCount === total
        ? 'error'
        : 'partial'

    onProgress({
      current: total,
      total,
      status: finalStatus,
      failed: failedCount,
    })
  }

  return { success: successCount, failed: failedCount }
}

/**
 * Substitute merge fields in message with jamaah data
 */
function substituteMergeFields(message: string, jamaah: Jamaah): string {
  return message
    .replace(/{nama}/g, jamaah.name)
    .replace(/{paket}/g, jamaah.package)
    .replace(/{tanggal}/g, new Date().toLocaleDateString('id-ID'))
    .replace(/{jumlah}/g, '5.000.000') // Mock amount
}

/**
 * Generate mock phone number for testing
 * In production, this would come from jamaah.phoneNumber
 */
function generateMockPhoneNumber(jamaahId: string): string {
  // Indonesian phone number format: 62 + area code + number
  const lastDigits = jamaahId.padStart(9, '0').slice(-9)
  return `62${lastDigits}`
}

/**
 * Sleep helper for delay between sends
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Cancel bulk send operation
 * Note: This is a placeholder. In a real implementation,
 * you would need to track and abort the ongoing operation.
 */
export function cancelBulkSend(): void {
  // In production, set a cancellation flag that sendBulkWhatsApp checks
  console.log('Bulk send cancelled')
}
