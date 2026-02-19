import { z } from "zod"

/**
 * Common validation patterns for Indonesian data
 */

// NIK (Nomor Induk Kependudukan) - 16 digits
export const nikSchema = z
  .string()
  .min(1, "NIK wajib diisi")
  .regex(/^\d{16}$/, "NIK harus 16 digit angka")

// Phone number - Indonesian format
export const phoneSchema = z
  .string()
  .min(1, "Nomor telepon wajib diisi")
  .regex(
    /^(\+62|62|0)[0-9]{9,12}$/,
    "Format nomor telepon tidak valid (contoh: 08123456789 atau +628123456789)"
  )

// Email - standard email validation
export const emailSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")

// Name - Indonesian names (letters, spaces, apostrophes)
export const nameSchema = z
  .string()
  .min(1, "Nama wajib diisi")
  .min(3, "Nama minimal 3 karakter")
  .max(100, "Nama maksimal 100 karakter")
  .regex(
    /^[a-zA-Z\s']+$/,
    "Nama hanya boleh mengandung huruf, spasi, dan tanda petik"
  )

// Address - Indonesian address
export const addressSchema = z
  .string()
  .min(1, "Alamat wajib diisi")
  .min(10, "Alamat minimal 10 karakter")
  .max(200, "Alamat maksimal 200 karakter")

// Password - strong password requirements
export const passwordSchema = z
  .string()
  .min(1, "Password wajib diisi")
  .min(8, "Password minimal 8 karakter")
  .regex(/[a-z]/, "Password harus mengandung huruf kecil")
  .regex(/[A-Z]/, "Password harus mengandung huruf besar")
  .regex(/[0-9]/, "Password harus mengandung angka")

// Date - ISO date string
export const dateSchema = z
  .string()
  .min(1, "Tanggal wajib diisi")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
  .refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, "Tanggal tidak valid")

// Date of birth - must be in the past
export const dateOfBirthSchema = dateSchema.refine((date) => {
  const birthDate = new Date(date)
  const today = new Date()
  return birthDate < today
}, "Tanggal lahir harus di masa lalu")

// Currency amount - Indonesian Rupiah
export const currencySchema = z
  .number({ message: "Jumlah harus berupa angka" })
  .positive("Jumlah harus lebih dari 0")
  .max(1000000000000, "Jumlah terlalu besar") // 1 trillion max

// Percentage - 0-100
export const percentageSchema = z
  .number({ message: "Persentase harus berupa angka" })
  .min(0, "Persentase minimal 0")
  .max(100, "Persentase maksimal 100")

// Optional string with min/max length
export const optionalStringSchema = (min: number = 0, max: number = 255) =>
  z.string().min(min).max(max).optional().or(z.literal(""))

// Required select field
export const selectSchema = (message: string = "Pilih salah satu opsi") =>
  z.string().min(1, message)

/**
 * Common form schemas
 */

// Jamaah registration form
export const jamaahFormSchema = z.object({
  nik: nikSchema,
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: dateOfBirthSchema,
  address: addressSchema,
  package: selectSchema("Pilih paket umroh"),
  emergencyContact: phoneSchema,
  emergencyName: nameSchema,
})

export type JamaahFormValues = z.infer<typeof jamaahFormSchema>

// Login form
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().default(false),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

// Change password form
export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Password baru harus berbeda dari password saat ini",
    path: ["newPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

// Profile update form
export const profileFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  agency: optionalStringSchema(3, 100),
  bio: optionalStringSchema(0, 500),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

/**
 * Utility functions
 */

// Format phone number to Indonesian format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "")

  // Convert to +62 format
  if (digits.startsWith("62")) {
    return `+${digits}`
  } else if (digits.startsWith("0")) {
    return `+62${digits.slice(1)}`
  }
  return `+62${digits}`
}

// Format currency to Indonesian Rupiah
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/\D/g, "")) || 0
}
