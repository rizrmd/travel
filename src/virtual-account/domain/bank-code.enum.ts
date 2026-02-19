/**
 * Integration 4: Virtual Account Payment Gateway
 * Domain: Bank Code Enumeration
 *
 * Supported banks for Midtrans Virtual Account:
 * - BCA: Bank Central Asia
 * - Mandiri: Bank Mandiri
 * - BNI: Bank Negara Indonesia
 * - BRI: Bank Rakyat Indonesia
 * - Permata: Bank Permata
 */

export enum BankCode {
  BCA = "bca",
  MANDIRI = "mandiri",
  BNI = "bni",
  BRI = "bri",
  PERMATA = "permata",
}

/**
 * Bank display names in Indonesian
 */
export const BankNames: Record<BankCode, string> = {
  [BankCode.BCA]: "Bank Central Asia (BCA)",
  [BankCode.MANDIRI]: "Bank Mandiri",
  [BankCode.BNI]: "Bank Negara Indonesia (BNI)",
  [BankCode.BRI]: "Bank Rakyat Indonesia (BRI)",
  [BankCode.PERMATA]: "Bank Permata",
};

/**
 * Validate if a string is a valid bank code
 */
export function isValidBankCode(code: string): boolean {
  return Object.values(BankCode).includes(code as BankCode);
}

/**
 * Get bank name from code
 */
export function getBankName(code: BankCode): string {
  return BankNames[code] || "Unknown Bank";
}
