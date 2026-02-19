/**
 * Integration 5: E-Signature Integration
 * Domain: Signature Event Type Enumeration
 */

export enum SignatureEventType {
  SENT = "sent",
  DELIVERED = "delivered",
  OPENED = "opened",
  VIEWED = "viewed",
  SIGNED = "signed",
  DECLINED = "declined",
  EXPIRED = "expired",
  FAILED = "failed",
  REMINDER_SENT = "reminder_sent",
  CERTIFICATE_GENERATED = "certificate_generated",
}

export const SignatureEventTypeLabels: Record<SignatureEventType, string> = {
  [SignatureEventType.SENT]: "Permintaan Terkirim",
  [SignatureEventType.DELIVERED]: "Email Terkirim",
  [SignatureEventType.OPENED]: "Email Dibuka",
  [SignatureEventType.VIEWED]: "Dokumen Dilihat",
  [SignatureEventType.SIGNED]: "Ditandatangani",
  [SignatureEventType.DECLINED]: "Ditolak",
  [SignatureEventType.EXPIRED]: "Kedaluwarsa",
  [SignatureEventType.FAILED]: "Gagal",
  [SignatureEventType.REMINDER_SENT]: "Pengingat Terkirim",
  [SignatureEventType.CERTIFICATE_GENERATED]: "Sertifikat Dibuat",
};
