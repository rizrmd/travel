# Epic 9, Story 9.1: Chatbot UI Placeholder - Frontend Implementation Guide

**Status:** Pending Frontend Implementation
**Backend Status:** ✅ Complete (WhatsApp stub API ready)

## Overview

This document provides implementation specifications for the frontend team to create the chatbot UI placeholder as defined in Epic 9, Story 9.1.

## Requirements

### 1. Chat Icon (Bottom-Right Corner)

**Position:**
- Fixed position: bottom-right corner
- z-index: 1000 (above other elements)
- Offset: 20px from bottom, 20px from right
- Should appear on all authenticated pages

**Design:**
- Circular button with 60px diameter
- Background: Primary brand color (or gradient)
- Icon: Chat bubble or robot icon (white)
- Floating shadow for depth
- Pulse animation on first visit to draw attention

**Example CSS:**
```css
.chatbot-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.chatbot-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chatbot-trigger.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
  }
}
```

**Example React Component:**
```tsx
// components/ChatbotPlaceholder.tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatbotModal from './ChatbotModal';

export default function ChatbotPlaceholder() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Show pulse animation for first-time visitors
    const hasSeenChatbot = localStorage.getItem('hasSeenChatbot');
    if (!hasSeenChatbot) {
      setShowPulse(true);
      localStorage.setItem('hasSeenChatbot', 'true');
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowPulse(false);
  };

  return (
    <>
      <button
        className={`chatbot-trigger ${showPulse ? 'pulse' : ''}`}
        onClick={handleOpen}
        aria-label="Open AI Chatbot"
      >
        <MessageCircle size={28} color="white" />
      </button>

      {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
```

### 2. "Coming Soon" Modal

**Trigger:** Clicking the chat icon

**Modal Specs:**
- Size: Medium (max-width: 600px)
- Centered on screen
- Backdrop: Semi-transparent dark overlay
- Animation: Slide up from bottom or fade in
- Close: X button, backdrop click, or ESC key

**Modal Content Structure:**

1. **Header**
   - Title: "AI Chatbot - Coming Soon!"
   - Badge: "Phase 2 Feature" with distinct styling
   - Close button (X)

2. **Body**
   - Hero section with icon or illustration
   - Feature description
   - 3 chatbot modes (Public, Agent, Admin)
   - Feature preview screenshots (mockups)
   - Feature request form

3. **Footer**
   - "Notify Me" button with email input
   - Estimated launch: Q2 2025

**Example React Component:**
```tsx
// components/ChatbotModal.tsx
import React, { useState } from 'react';
import { X, Bot, Users, Shield, Mail } from 'lucide-react';

interface ChatbotModalProps {
  onClose: () => void;
}

export default function ChatbotModal({ onClose }: ChatbotModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNotifyMe = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/whatsapp/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          feature: 'chatbot',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      console.error('Failed to submit notification request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-purple-600" />
            <h2 className="text-2xl font-bold">AI Chatbot</h2>
          </div>
          <span className="badge badge-purple">Coming in Phase 2</span>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Hero Section */}
          <div className="hero-section text-center mb-6">
            <div className="chatbot-illustration mb-4">
              {/* Add illustration or Lottie animation here */}
              <Bot size={80} className="mx-auto text-purple-500" />
            </div>
            <p className="text-gray-600">
              Asisten virtual berbasis AI yang siap membantu Anda 24/7 dengan tiga mode khusus:
            </p>
          </div>

          {/* 3 Modes */}
          <div className="modes-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="mode-card">
              <Users size={32} className="text-blue-500 mb-2" />
              <h3 className="font-bold mb-1">Public Mode</h3>
              <p className="text-sm text-gray-600">
                Info paket, FAQ umroh, dan lead capture otomatis
              </p>
            </div>

            <div className="mode-card">
              <Bot size={32} className="text-green-500 mb-2" />
              <h3 className="font-bold mb-1">Agent Mode</h3>
              <p className="text-sm text-gray-600">
                Cari jamaah, cek pembayaran, kirim reminder dengan cepat
              </p>
            </div>

            <div className="mode-card">
              <Shield size={32} className="text-purple-500 mb-2" />
              <h3 className="font-bold mb-1">Admin Mode</h3>
              <p className="text-sm text-gray-600">
                Dashboard bisnis, laporan, analisis performa agent
              </p>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="feature-preview mb-6">
            <h3 className="font-bold mb-3">Fitur Unggulan:</h3>
            <ul className="feature-list">
              <li>✅ Natural language understanding (Bahasa Indonesia)</li>
              <li>✅ Integrasi WhatsApp Business API</li>
              <li>✅ Knowledge base sync otomatis</li>
              <li>✅ Multi-turn conversations dengan context</li>
              <li>✅ Lead capture dan routing ke agent</li>
              <li>✅ Dashboard analytics dan insights</li>
            </ul>
          </div>

          {/* Screenshots Placeholder */}
          <div className="screenshots mb-6">
            <h3 className="font-bold mb-3">Preview (Mockup):</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="screenshot-placeholder">
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400">Chat Interface</span>
                </div>
              </div>
              <div className="screenshot-placeholder">
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400">Agent Dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Request Form */}
          <div className="feature-request bg-gray-50 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">Punya ide fitur chatbot?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Kami ingin mendengar saran Anda! Fitur apa yang Anda harapkan dari AI Chatbot?
            </p>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Contoh: Saya ingin chatbot bisa mengirimkan reminder pembayaran otomatis..."
            />
            <button className="btn btn-secondary mt-2">
              Kirim Saran
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {!submitted ? (
            <>
              <div className="notify-section">
                <Mail size={20} className="text-gray-500" />
                <input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="notify-input"
                />
                <button
                  className="btn btn-primary"
                  onClick={handleNotifyMe}
                  disabled={!email || isSubmitting}
                >
                  {isSubmitting ? 'Mengirim...' : 'Notify Me'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Estimasi peluncuran: <strong>Q2 2025</strong>
              </p>
            </>
          ) : (
            <div className="text-center text-green-600 font-medium">
              ✅ Terima kasih! Kami akan memberitahu Anda saat AI Chatbot diluncurkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Example CSS:**
```css
/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.badge-purple {
  background: #ede9fe;
  color: #7c3aed;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.mode-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
}

.mode-card:hover {
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.notify-section {
  display: flex;
  gap: 8px;
  align-items: center;
}

.notify-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### 3. API Integration

**Endpoint:** `POST /whatsapp/notify-me`

**Request Body:**
```typescript
{
  email: string;
  name?: string;
  feature: 'chatbot' | 'whatsapp';
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  feature: string;
  estimatedLaunch: string;
}
```

**Example API Call:**
```typescript
const handleNotifyMe = async (email: string) => {
  try {
    const response = await fetch('/api/whatsapp/notify-me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        feature: 'chatbot',
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Show success message
      toast.success(data.message);
    }
  } catch (error) {
    toast.error('Gagal mengirim notifikasi. Silakan coba lagi.');
  }
};
```

### 4. Feature Request Submission

**Additional Endpoint (Optional):**
`POST /api/feature-requests`

**Request Body:**
```typescript
{
  feature: 'chatbot',
  suggestion: string;
  userId?: string;
  email?: string;
}
```

This allows users to submit feature suggestions which can be stored for future product planning.

### 5. Screenshot Mockups

Create simple mockups showing:

1. **Chat Interface Mockup:**
   - Message bubbles (user and bot)
   - Input field with send button
   - Mode indicator (Public/Agent/Admin)

2. **Agent Dashboard Mockup:**
   - Quick search bar
   - Recent queries list
   - Action buttons (Send reminder, Generate report)

**Tools:** Figma, Sketch, or use existing design system components

### 6. Accessibility Requirements

- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, ESC to close)
- Screen reader friendly
- Focus management (trap focus in modal)
- Color contrast compliance (WCAG AA)

**Example Accessibility:**
```tsx
<button
  className="chatbot-trigger"
  onClick={handleOpen}
  aria-label="Open AI Chatbot (Coming Soon)"
  role="button"
>
  <MessageCircle size={28} color="white" aria-hidden="true" />
</button>

<div
  className="modal-backdrop"
  role="dialog"
  aria-modal="true"
  aria-labelledby="chatbot-modal-title"
>
  <h2 id="chatbot-modal-title">AI Chatbot - Coming Soon</h2>
  {/* ... */}
</div>
```

### 7. Mobile Responsiveness

**Breakpoints:**
- Desktop: Full modal (600px width)
- Tablet: 90% width
- Mobile: Full screen modal with slide-up animation

**Mobile Considerations:**
- Chat icon: 50px diameter on mobile (smaller)
- Modal: Full screen or bottom sheet style
- Touch-friendly button sizes (min 44×44px)

### 8. Integration Points

**Where to Add ChatbotPlaceholder Component:**

```tsx
// In your main layout component (e.g., Layout.tsx or DashboardLayout.tsx)

import ChatbotPlaceholder from '@/components/ChatbotPlaceholder';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />

      <main>{children}</main>

      {/* Add chatbot placeholder on all pages */}
      <ChatbotPlaceholder />

      <Footer />
    </div>
  );
}
```

**Conditional Rendering (Optional):**
```tsx
// Only show on authenticated pages
{isAuthenticated && <ChatbotPlaceholder />}

// Or hide on specific pages
{!isPublicPage && <ChatbotPlaceholder />}
```

## Testing Checklist

- [ ] Chat icon visible on all required pages
- [ ] Chat icon positioned correctly (bottom-right)
- [ ] Pulse animation works for first-time visitors
- [ ] Modal opens when clicking chat icon
- [ ] Modal closes on backdrop click
- [ ] Modal closes on ESC key
- [ ] Modal closes on X button click
- [ ] Email input validation works
- [ ] "Notify Me" button submits successfully
- [ ] Success message displays after submission
- [ ] Feature request form works (if implemented)
- [ ] Mobile responsive design works
- [ ] Accessibility requirements met
- [ ] No console errors
- [ ] Works in all major browsers (Chrome, Firefox, Safari, Edge)

## Design Assets Needed

1. Chatbot icon SVG or Lottie animation
2. Coming Soon badge design
3. Mode icons (Public, Agent, Admin)
4. Illustration or hero image
5. Screenshot mockups (2 images)
6. Brand colors and typography

## Timeline Estimate

- Design mockups: 2-3 hours
- Component development: 4-6 hours
- API integration: 1-2 hours
- Testing and refinement: 2-3 hours
- **Total:** 1-2 days

## Additional Notes

- This is a placeholder feature - no actual chatbot functionality needed yet
- Focus on visual appeal and clear communication of future capabilities
- Collect user feedback through the feature request form
- Track "Notify Me" submissions for launch planning
- Consider A/B testing different modal copy for engagement

## References

- Backend API: `/src/whatsapp/whatsapp.controller.ts`
- Documentation: `/docs/integrations/chatbot.md`
- Epic Requirements: `/_bmad-output/epics.md` (Epic 9, Story 9.1)

## Questions?

Contact the backend team for:
- API endpoint details
- Authentication requirements
- Data storage for feature requests
