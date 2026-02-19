# AI Chatbot Integration - Phase 2 Implementation Guide

**Status:** Planned for Phase 2
**Priority:** High
**Estimated Effort:** 4-6 weeks
**Target Release:** Q2 2025

---

## Overview

The Travel Umroh AI Chatbot will provide natural language query capabilities across three distinct modes: Public (website visitors), Agent (staff), and Admin (management). The chatbot will integrate with the existing platform to provide instant answers, perform actions, and generate insights via conversational interface.

---

## NLP Provider Recommendations

### Primary: OpenAI GPT-4
- Best Indonesian language support
- Function calling for API integration
- No training required
- Cost: ~$0.01-0.03 per conversation
- Total estimated: $185-285/month

### Fallback: Google Dialogflow CX
- Pre-built intents
- Visual flow designer
- Cost: $0.002-0.007 per query

### Self-hosted: Rasa
- Complete data privacy
- Requires ML expertise
- Recommended for >100k queries/month

---

## Sample Conversation Flow

**Public Mode - Package Inquiry:**
```
User: "Berapa harga paket umroh bulan Ramadan?"

Chatbot: "Untuk paket umroh di bulan Ramadan 2025:
1. Paket Ramadan Premium - Rp 35.000.000 (15 seat tersedia)
2. Paket Ramadan Reguler - Rp 28.000.000 (25 seat tersedia)

Apakah Anda ingin informasi lebih detail?"
```

**Agent Mode - Jamaah Search:**
```
Agent: "Cari jamaah bernama Ahmad yang belum lunas"

Chatbot: "Saya menemukan 3 jamaah:
1. Ahmad Rizki - Rp 20jt sisa (43% paid)
2. Ahmad Fauzi - Rp 18jt sisa - OVERDUE
3. Ahmad Syarif - Rp 12jt sisa (71% paid)"
```

See full documentation in this file for complete implementation details.
