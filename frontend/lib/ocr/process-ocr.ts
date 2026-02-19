export interface OCRData {
  nik: string
  name: string
  address: string
  dateOfBirth: string
}

export interface OCRResult {
  success: boolean
  confidence: number
  data?: OCRData
  error?: string
  errorType?: 'blur' | 'low_light' | 'incomplete' | 'generic'
}

/**
 * Simulate file upload to server
 * In production, this would upload to actual backend
 */
export async function uploadFile(file: File): Promise<{ success: boolean; fileUrl: string }> {
  return new Promise((resolve) => {
    // Simulate upload with progress
    setTimeout(() => {
      resolve({
        success: true,
        fileUrl: `/uploads/${file.name}`,
      })
    }, 2500) // 2.5 seconds total upload time
  })
}

/**
 * Simulate OCR processing
 * In production, this would call actual OCR API
 */
export async function processOCR(fileUrl: string): Promise<OCRResult> {
  return new Promise((resolve) => {
    // Simulate OCR processing time (3-5 seconds)
    const processingTime = 3000 + Math.random() * 2000

    setTimeout(() => {
      // Randomly simulate different OCR outcomes for testing
      const random = Math.random()

      if (random < 0.7) {
        // 70% success with high confidence
        resolve({
          success: true,
          confidence: 85 + Math.floor(Math.random() * 15), // 85-100%
          data: {
            nik: '3201012345670001',
            name: 'AHMAD FAUZI',
            address: 'JL. MERDEKA NO. 123, JAKARTA PUSAT',
            dateOfBirth: '1990-01-15',
          },
        })
      } else if (random < 0.85) {
        // 15% success with low confidence
        resolve({
          success: true,
          confidence: 60 + Math.floor(Math.random() * 15), // 60-75%
          data: {
            nik: '3201012345670001',
            name: 'AHMAD FAUZI',
            address: 'JL. MERDEKA NO. 123, JAKARTA PUSAT',
            dateOfBirth: '1990-01-15',
          },
        })
      } else {
        // 15% error
        const errorTypes: Array<'blur' | 'low_light' | 'incomplete' | 'generic'> = [
          'blur',
          'low_light',
          'incomplete',
          'generic',
        ]
        const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)]

        resolve({
          success: false,
          confidence: 0,
          error: getErrorMessage(errorType),
          errorType,
        })
      }
    }, processingTime)
  })
}

function getErrorMessage(errorType: 'blur' | 'low_light' | 'incomplete' | 'generic'): string {
  switch (errorType) {
    case 'blur':
      return 'Foto blur? Upload foto lebih jelas'
    case 'low_light':
      return 'Foto terlalu gelap? Coba dengan pencahayaan lebih baik'
    case 'incomplete':
      return 'KTP terpotong? Pastikan seluruh KTP terlihat'
    case 'generic':
    default:
      return 'Coba upload ulang atau masukkan data manual'
  }
}
