/**
 * Integration 5: E-Signature Integration
 * Domain: Signature Status Enumeration
 */

export enum SignatureStatus {
  PENDING = "pending",
  SENT = "sent",
  SIGNED = "signed",
  EXPIRED = "expired",
  DECLINED = "declined",
  FAILED = "failed",
}

export const SignatureStatusLabels: Record<SignatureStatus, string> = {
  [SignatureStatus.PENDING]: "Menunggu",
  [SignatureStatus.SENT]: "Terkirim",
  [SignatureStatus.SIGNED]: "Ditandatangani",
  [SignatureStatus.EXPIRED]: "Kedaluwarsa",
  [SignatureStatus.DECLINED]: "Ditolak",
  [SignatureStatus.FAILED]: "Gagal",
};

export const isSignatureStatusFinal = (status: SignatureStatus): boolean => {
  return [
    SignatureStatus.SIGNED,
    SignatureStatus.EXPIRED,
    SignatureStatus.DECLINED,
  ].includes(status);
};
