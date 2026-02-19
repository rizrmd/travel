# Epic 10: Agent Landing Page Builder - Frontend Implementation Guide

## Overview

This document provides comprehensive guidance for implementing the frontend UI components for the Agent Landing Page Builder feature. The backend APIs are fully implemented and ready for integration.

**Epic Goal**: Enable agents to create customized landing pages for their Umroh packages with lead capture and analytics tracking.

---

## Table of Contents

1. [API Endpoints Reference](#api-endpoints-reference)
2. [Data Models & Types](#data-models--types)
3. [Component Architecture](#component-architecture)
4. [User Stories & UI Requirements](#user-stories--ui-requirements)
5. [State Management](#state-management)
6. [Routing & Navigation](#routing--navigation)
7. [Testing Guidelines](#testing-guidelines)

---

## API Endpoints Reference

### Landing Pages API (`/api/landing-pages`)

**Authentication Required**: Yes (Agent role)

#### Create Landing Page
```http
POST /api/landing-pages
Content-Type: application/json
Authorization: Bearer {token}

{
  "packageId": "uuid",
  "templateId": "modern" | "classic" | "minimal",
  "slug": "my-umroh-package-2025",
  "customizations": {
    "primaryColor": "#3B82F6",
    "secondaryColor": "#10B981",
    "accentColor": "#F59E0B",
    "logo": "https://...",
    "profilePhoto": "https://...",
    "agentName": "Ahmad Surya",
    "tagline": "Your Trusted Umroh Partner",
    "whatsappNumber": "+6281234567890",
    "email": "agent@example.com",
    "address": "Jakarta, Indonesia",
    "socialMedia": {
      "instagram": "https://instagram.com/username",
      "facebook": "https://facebook.com/username",
      "youtube": "https://youtube.com/channel"
    },
    "customIntro": "Welcome! I'm here to help...",
    "videoUrl": "https://youtube.com/watch?v=...",
    "metaTitle": "Best Umroh Package 2025",
    "metaDescription": "Affordable Umroh packages...",
    "customCss": ".custom-class { ... }"
  }
}

Response: 201 Created
{
  "id": "uuid",
  "slug": "my-umroh-package-2025",
  "status": "draft",
  "fullUrl": "https://app.travelumroh.com/p/my-umroh-package-2025",
  "viewsCount": 0,
  "leadsCount": 0,
  "conversionRate": 0,
  ...
}
```

#### List Landing Pages
```http
GET /api/landing-pages?page=1&limit=10&status=published&search=umroh

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "slug": "my-umroh-package-2025",
      "status": "published",
      "templateId": "modern",
      "viewsCount": 150,
      "leadsCount": 12,
      "conversionRate": 8.0,
      "createdAt": "2025-01-15T10:00:00Z",
      "publishedAt": "2025-01-15T11:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

#### Get Landing Page Details
```http
GET /api/landing-pages/{id}

Response: 200 OK
{
  "id": "uuid",
  "slug": "my-umroh-package-2025",
  "status": "published",
  "templateId": "modern",
  "packageId": "uuid",
  "customizations": { ... },
  "viewsCount": 150,
  "leadsCount": 12,
  "conversionRate": 8.0,
  "fullUrl": "https://app.travelumroh.com/p/my-umroh-package-2025",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T11:00:00Z",
  "publishedAt": "2025-01-15T11:00:00Z"
}
```

#### Update Landing Page
```http
PATCH /api/landing-pages/{id}
Content-Type: application/json

{
  "customizations": {
    "primaryColor": "#EF4444"
  }
}

Response: 200 OK
{
  "id": "uuid",
  "customizations": {
    "primaryColor": "#EF4444",
    ...
  },
  ...
}
```

#### Publish Landing Page
```http
POST /api/landing-pages/{id}/publish

Response: 200 OK
{
  "id": "uuid",
  "status": "published",
  "publishedAt": "2025-01-15T11:00:00Z",
  ...
}
```

#### Archive Landing Page
```http
POST /api/landing-pages/{id}/archive

Response: 200 OK
{
  "id": "uuid",
  "status": "archived",
  ...
}
```

#### Duplicate Landing Page
```http
POST /api/landing-pages/{id}/duplicate

Response: 201 Created
{
  "id": "new-uuid",
  "slug": "my-umroh-package-2025-copy",
  "status": "draft",
  ...
}
```

#### Delete Landing Page
```http
DELETE /api/landing-pages/{id}

Response: 204 No Content
```

#### Get Landing Page Analytics
```http
GET /api/landing-pages/{id}/analytics

Response: 200 OK
{
  "landingPageId": "uuid",
  "totalViews": 150,
  "totalLeads": 12,
  "conversionRate": 8.0,
  "leadsByStatus": {
    "new": 5,
    "contacted": 4,
    "qualified": 2,
    "converted": 1,
    "lost": 0
  },
  "viewsByDate": [
    { "date": "2025-01-15", "views": 45 },
    { "date": "2025-01-16", "views": 52 }
  ],
  "leadsByDate": [
    { "date": "2025-01-15", "leads": 4 },
    { "date": "2025-01-16", "leads": 5 }
  ],
  "utmSources": [
    { "source": "facebook", "leads": 7 },
    { "source": "instagram", "leads": 5 }
  ]
}
```

### Public Landing Page API

**Authentication Required**: No

#### View Landing Page (Public)
```http
GET /p/{slug}?utm_source=facebook&utm_medium=social&utm_campaign=ramadan2025

Response: 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
  <!-- Rendered Handlebars template -->
</html>
```

### Leads API (`/api/leads`)

#### Create Lead (Public - from landing page form)
```http
POST /api/leads
Content-Type: application/json

{
  "landingPageId": "uuid",
  "fullName": "Fatimah Zahra",
  "email": "fatimah@example.com",
  "phone": "+6281234567890",
  "message": "I'm interested in the Umroh package",
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "ramadan2025"
}

Response: 201 Created
{
  "id": "uuid",
  "fullName": "Fatimah Zahra",
  "status": "new",
  "source": "landing_page",
  "createdAt": "2025-01-15T12:00:00Z"
}
```

#### List Leads (Agent)
```http
GET /api/leads?page=1&limit=10&status=new&landingPageId=uuid

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "fullName": "Fatimah Zahra",
      "email": "fatimah@example.com",
      "phone": "+6281234567890",
      "status": "new",
      "source": "landing_page",
      "utmSource": "facebook",
      "daysSinceCreated": 2,
      "createdAt": "2025-01-15T12:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

#### Get Hot Leads (< 24 hours old)
```http
GET /api/leads/hot

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "fullName": "Ahmad Abdullah",
      "phone": "+6281234567890",
      "status": "new",
      "daysSinceCreated": 0,
      "createdAt": "2025-01-23T10:00:00Z"
    }
  ],
  "total": 3
}
```

#### Update Lead Status
```http
PATCH /api/leads/{id}/status
Content-Type: application/json

{
  "status": "contacted" | "qualified" | "converted" | "lost",
  "convertedToJamaahId": "uuid" // only if status=converted
}

Response: 200 OK
{
  "id": "uuid",
  "status": "contacted",
  ...
}
```

#### Mark Lead as Contacted
```http
POST /api/leads/{id}/contact

Response: 200 OK
{
  "id": "uuid",
  "status": "contacted",
  ...
}
```

---

## Data Models & Types

### TypeScript Interfaces

Create these TypeScript types in your frontend codebase:

```typescript
// src/types/landing-pages.ts

export enum TemplateType {
  MODERN = 'modern',
  CLASSIC = 'classic',
  MINIMAL = 'minimal',
}

export enum LandingPageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface ColorScheme {
  primary: string; // hex color
  secondary: string;
  accent: string;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
}

export interface LandingPageCustomizations {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Branding
  logo?: string; // URL
  profilePhoto?: string; // URL
  agentName?: string;
  tagline?: string;

  // Contact
  whatsappNumber?: string;
  email?: string;
  address?: string;
  socialMedia?: SocialMediaLinks;

  // Content
  customIntro?: string;
  videoUrl?: string; // YouTube/Vimeo embed

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string; // URL

  // Advanced
  customCss?: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  status: LandingPageStatus;
  templateId: TemplateType;
  packageId: string;
  agentId: string;
  tenantId: string;
  customizations: LandingPageCustomizations;
  viewsCount: number;
  leadsCount: number;
  conversionRate: number;
  fullUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deletedAt?: string;
}

export interface CreateLandingPageDto {
  packageId: string;
  templateId?: TemplateType;
  slug?: string;
  customizations?: LandingPageCustomizations;
}

export interface UpdateLandingPageDto {
  templateId?: TemplateType;
  slug?: string;
  customizations?: Partial<LandingPageCustomizations>;
}

export interface PageAnalytics {
  landingPageId: string;
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  leadsByStatus: {
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  };
  viewsByDate: Array<{ date: string; views: number }>;
  leadsByDate: Array<{ date: string; leads: number }>;
  utmSources: Array<{ source: string; leads: number }>;
}
```

```typescript
// src/types/leads.ts

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  LOST = 'lost',
}

export enum LeadSource {
  LANDING_PAGE = 'landing_page',
  WEBSITE = 'website',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  CHATBOT = 'chatbot',
  WHATSAPP = 'whatsapp',
  OTHER = 'other',
}

export interface Lead {
  id: string;
  landingPageId?: string;
  agentId: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  status: LeadStatus;
  source: LeadSource;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  ipAddress?: string;
  userAgent?: string;
  convertedToJamaahId?: string;
  daysSinceCreated: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  landingPageId?: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface UpdateLeadStatusDto {
  status: LeadStatus;
  convertedToJamaahId?: string;
}
```

---

## Component Architecture

### Recommended Component Structure

```
src/
├── pages/
│   ├── landing-pages/
│   │   ├── LandingPagesListPage.tsx        # List all landing pages
│   │   ├── CreateLandingPagePage.tsx       # Create wizard
│   │   ├── EditLandingPagePage.tsx         # Edit landing page
│   │   └── LandingPageAnalyticsPage.tsx    # Analytics dashboard
│   └── leads/
│       ├── LeadsListPage.tsx               # List all leads
│       └── LeadDetailPage.tsx              # Lead details
│
├── components/
│   ├── landing-pages/
│   │   ├── LandingPageCard.tsx             # Card in list view
│   │   ├── LandingPageWizard/
│   │   │   ├── index.tsx                   # Main wizard component
│   │   │   ├── StepSelectTemplate.tsx      # Step 1: Choose template
│   │   │   ├── StepCustomizeBranding.tsx   # Step 2: Customize colors/logo
│   │   │   ├── StepCustomizeContent.tsx    # Step 3: Content/social links
│   │   │   └── StepReviewPublish.tsx       # Step 4: Review & publish
│   │   ├── BrandingCustomizer/
│   │   │   ├── index.tsx
│   │   │   ├── ColorPicker.tsx             # Color selection
│   │   │   ├── LogoUploader.tsx            # Upload logo/photo
│   │   │   └── SocialMediaLinksForm.tsx    # Social media inputs
│   │   ├── TemplatePreview.tsx             # Live preview iframe
│   │   ├── ShareButtons.tsx                # Social share buttons
│   │   └── Analytics/
│   │       ├── ConversionChart.tsx         # Line chart for conversion
│   │       ├── LeadsSourceChart.tsx        # Pie chart for UTM sources
│   │       └── MetricsCards.tsx            # Views/Leads/Conv. Rate cards
│   │
│   └── leads/
│       ├── LeadCard.tsx                    # Card in list view
│       ├── LeadForm.tsx                    # PUBLIC form on landing page
│       ├── LeadStatusBadge.tsx             # Status badge component
│       └── LeadTimeline.tsx                # Activity timeline
│
└── hooks/
    ├── useLandingPages.ts                  # API hooks for landing pages
    ├── useLeads.ts                         # API hooks for leads
    └── useAnalytics.ts                     # API hooks for analytics
```

---

## User Stories & UI Requirements

### Story 10.1: Template Selection & Customization

**As an agent, I want to select a landing page template and customize it with my branding.**

#### UI Components Required

**1. Template Selection Screen**

```tsx
// StepSelectTemplate.tsx

import React from 'react';

interface TemplateOption {
  id: TemplateType;
  name: string;
  description: string;
  thumbnail: string; // preview image
  features: string[];
}

const templates: TemplateOption[] = [
  {
    id: TemplateType.MODERN,
    name: 'Modern',
    description: 'Bold gradients and contemporary design',
    thumbnail: '/templates/modern-preview.png',
    features: [
      'Gradient hero section',
      'Responsive grid layout',
      'WhatsApp quick action button',
      'Optimized for mobile'
    ]
  },
  {
    id: TemplateType.CLASSIC,
    name: 'Classic',
    description: 'Traditional and trustworthy design',
    thumbnail: '/templates/classic-preview.png',
    features: [
      'Serif typography',
      'Formal layout',
      'Table-based details',
      'Professional look'
    ]
  },
  {
    id: TemplateType.MINIMAL,
    name: 'Minimal',
    description: 'Clean and simple design',
    thumbnail: '/templates/minimal-preview.png',
    features: [
      'Lots of whitespace',
      'Sans-serif fonts',
      'Minimal colors',
      'Focus on content'
    ]
  }
];

export default function StepSelectTemplate({
  selected,
  onSelect
}: {
  selected?: TemplateType;
  onSelect: (template: TemplateType) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`
            border-2 rounded-lg p-6 cursor-pointer transition-all
            ${selected === template.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
            }
          `}
        >
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{template.name}</h3>
          <p className="text-gray-600 mb-4">{template.description}</p>
          <ul className="space-y-1">
            {template.features.map((feature, idx) => (
              <li key={idx} className="text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-500" /* checkmark icon *//>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

**2. Branding Customizer**

```tsx
// BrandingCustomizer/index.tsx

import React from 'react';
import ColorPicker from './ColorPicker';
import LogoUploader from './LogoUploader';
import SocialMediaLinksForm from './SocialMediaLinksForm';

interface Props {
  customizations: LandingPageCustomizations;
  onChange: (customizations: Partial<LandingPageCustomizations>) => void;
}

export default function BrandingCustomizer({ customizations, onChange }: Props) {
  return (
    <div className="space-y-8">
      {/* Color Scheme */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker
            label="Primary Color"
            value={customizations.primaryColor || '#3B82F6'}
            onChange={(color) => onChange({ primaryColor: color })}
          />
          <ColorPicker
            label="Secondary Color"
            value={customizations.secondaryColor || '#10B981'}
            onChange={(color) => onChange({ secondaryColor: color })}
          />
          <ColorPicker
            label="Accent Color"
            value={customizations.accentColor || '#F59E0B'}
            onChange={(color) => onChange({ accentColor: color })}
          />
        </div>
      </section>

      {/* Branding Assets */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Branding Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LogoUploader
            label="Company Logo"
            value={customizations.logo}
            onChange={(url) => onChange({ logo: url })}
          />
          <LogoUploader
            label="Profile Photo"
            value={customizations.profilePhoto}
            onChange={(url) => onChange({ profilePhoto: url })}
          />
        </div>
      </section>

      {/* Agent Info */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Agent Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Agent Name</label>
            <input
              type="text"
              value={customizations.agentName || ''}
              onChange={(e) => onChange({ agentName: e.target.value })}
              placeholder="Ahmad Surya"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={customizations.tagline || ''}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="Your Trusted Umroh Partner"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
            <input
              type="tel"
              value={customizations.whatsappNumber || ''}
              onChange={(e) => onChange({ whatsappNumber: e.target.value })}
              placeholder="+6281234567890"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={customizations.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="agent@example.com"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <textarea
              value={customizations.address || ''}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="Jakarta, Indonesia"
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Social Media</h3>
        <SocialMediaLinksForm
          value={customizations.socialMedia || {}}
          onChange={(links) => onChange({ socialMedia: links })}
        />
      </section>

      {/* Custom Content */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Custom Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Introduction
              <span className="text-gray-500 ml-2">(optional)</span>
            </label>
            <textarea
              value={customizations.customIntro || ''}
              onChange={(e) => onChange({ customIntro: e.target.value })}
              placeholder="Add a personal welcome message..."
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Video URL
              <span className="text-gray-500 ml-2">(YouTube or Vimeo)</span>
            </label>
            <input
              type="url"
              value={customizations.videoUrl || ''}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
```

**3. Live Preview Component**

```tsx
// TemplatePreview.tsx

import React, { useEffect, useRef } from 'react';

interface Props {
  landingPageId?: string;
  slug?: string;
  templateId?: TemplateType;
  customizations?: LandingPageCustomizations;
}

export default function TemplatePreview({
  landingPageId,
  slug,
  templateId,
  customizations
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // If editing existing page, use the public URL
  const previewUrl = landingPageId
    ? `/p/${slug}`
    : `/api/landing-pages/preview?template=${templateId}`;

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm ml-4">Preview</span>
        </div>
        <div className="flex space-x-2">
          <button className="text-sm hover:bg-gray-700 px-2 py-1 rounded">
            Desktop
          </button>
          <button className="text-sm hover:bg-gray-700 px-2 py-1 rounded">
            Tablet
          </button>
          <button className="text-sm hover:bg-gray-700 px-2 py-1 rounded">
            Mobile
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src={previewUrl}
        className="w-full h-[600px] bg-white"
        title="Landing Page Preview"
      />
    </div>
  );
}
```

### Story 10.2: Share Landing Page

**As an agent, I want to share my landing page on social media and via direct link.**

#### UI Components Required

**1. Share Buttons Component**

```tsx
// ShareButtons.tsx

import React from 'react';

interface Props {
  url: string;
  title: string;
  onCopyLink: () => void;
}

export default function ShareButtons({ url, title, onCopyLink }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Landing Page URL</label>
        <div className="flex">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 border rounded-l px-3 py-2 bg-gray-50"
          />
          <button
            onClick={onCopyLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Copy Link
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Share on Social Media</label>
        <div className="flex space-x-3">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Share on Facebook"
          >
            <svg className="w-6 h-6" /* Facebook icon */ />
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded hover:bg-green-600"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-6 h-6" /* WhatsApp icon */ />
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-sky-500 text-white rounded hover:bg-sky-600"
            aria-label="Share on Twitter"
          >
            <svg className="w-6 h-6" /* Twitter icon */ />
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-blue-700 text-white rounded hover:bg-blue-800"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-6 h-6" /* LinkedIn icon */ />
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Share on Telegram"
          >
            <svg className="w-6 h-6" /* Telegram icon */ />
          </a>
        </div>
      </div>

      {/* QR Code */}
      <div>
        <label className="block text-sm font-medium mb-2">QR Code</label>
        <div className="border rounded p-4 inline-block bg-white">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`}
            alt="QR Code"
            className="w-48 h-48"
          />
          <p className="text-xs text-center mt-2 text-gray-500">
            Scan to open landing page
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Story 10.3: Lead Form (Public)

**As a prospective customer, I want to fill out a lead form on the landing page.**

#### UI Components Required

**1. Public Lead Form Component**

```tsx
// LeadForm.tsx

import React, { useState } from 'react';
import { CreateLeadDto } from '@/types/leads';

interface Props {
  landingPageId: string;
  onSubmit?: () => void; // Success callback
}

export default function LeadForm({ landingPageId, onSubmit }: Props) {
  const [formData, setFormData] = useState<CreateLeadDto>({
    landingPageId,
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Capture UTM parameters from URL
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors(error.message || {});
        return;
      }

      // Success
      onSubmit?.();

      // Show success message or redirect to thank you page
      alert('Thank you! We will contact you soon.');

      // Reset form
      setFormData({
        landingPageId,
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Failed to submit lead:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className={`w-full border rounded px-3 py-2 ${errors.fullName ? 'border-red-500' : ''}`}
          placeholder="Ahmad Abdullah"
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
          placeholder="ahmad@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          WhatsApp Number *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="+6281234567890"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="I'm interested in this package..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
```

### Story 10.4: Leads Management

**As an agent, I want to view and manage leads from my landing pages.**

#### UI Components Required

**1. Leads List Page**

```tsx
// pages/leads/LeadsListPage.tsx

import React, { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import LeadCard from '@/components/leads/LeadCard';
import LeadStatusBadge from '@/components/leads/LeadStatusBadge';
import { LeadStatus } from '@/types/leads';

export default function LeadsListPage() {
  const [filters, setFilters] = useState({
    status: undefined as LeadStatus | undefined,
    landingPageId: undefined as string | undefined,
    search: '',
  });

  const { data, isLoading } = useLeads(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex space-x-3">
          {/* Hot Leads Alert */}
          <a
            href="/leads/hot"
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-2" /* fire icon */ />
            Hot Leads
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as LeadStatus })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Statuses</option>
              <option value={LeadStatus.NEW}>New</option>
              <option value={LeadStatus.CONTACTED}>Contacted</option>
              <option value={LeadStatus.QUALIFIED}>Qualified</option>
              <option value={LeadStatus.CONVERTED}>Converted</option>
              <option value={LeadStatus.LOST}>Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Landing Page</label>
            <select
              value={filters.landingPageId || ''}
              onChange={(e) => setFilters({ ...filters, landingPageId: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Landing Pages</option>
              {/* TODO: Fetch landing pages */}
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="text-center py-12">Loading leads...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.data.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**2. Lead Card Component**

```tsx
// components/leads/LeadCard.tsx

import React from 'react';
import { Lead } from '@/types/leads';
import LeadStatusBadge from './LeadStatusBadge';

interface Props {
  lead: Lead;
}

export default function LeadCard({ lead }: Props) {
  const handleContact = () => {
    // Update lead status to contacted
    // Then open WhatsApp
    const message = `Hi ${lead.fullName}, thank you for your interest in our Umroh package!`;
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{lead.fullName}</h3>
          <p className="text-gray-600">{lead.email}</p>
          <p className="text-gray-600">{lead.phone}</p>
        </div>
        <div className="text-right">
          <LeadStatusBadge status={lead.status} />
          <p className="text-sm text-gray-500 mt-2">
            {lead.daysSinceCreated === 0 ? 'Today' : `${lead.daysSinceCreated} days ago`}
          </p>
        </div>
      </div>

      {lead.message && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
          <p className="text-gray-600">{lead.message}</p>
        </div>
      )}

      {/* UTM Info */}
      {lead.utmSource && (
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" /* chart icon */ />
          Source: {lead.utmSource}
          {lead.utmMedium && ` / ${lead.utmMedium}`}
          {lead.utmCampaign && ` / ${lead.utmCampaign}`}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleContact}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Contact via WhatsApp
        </button>
        <button
          onClick={() => window.location.href = `/leads/${lead.id}`}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
```

### Story 10.6: Analytics Dashboard

**As an agent, I want to view analytics for my landing pages.**

#### UI Components Required

**1. Analytics Dashboard**

```tsx
// components/landing-pages/Analytics/index.tsx

import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import MetricsCards from './MetricsCards';
import ConversionChart from './ConversionChart';
import LeadsSourceChart from './LeadsSourceChart';

interface Props {
  landingPageId: string;
}

export default function AnalyticsDashboard({ landingPageId }: Props) {
  const { data, isLoading } = useAnalytics(landingPageId);

  if (isLoading) return <div>Loading analytics...</div>;
  if (!data) return <div>No analytics data available</div>;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <MetricsCards
        totalViews={data.totalViews}
        totalLeads={data.totalLeads}
        conversionRate={data.conversionRate}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Over Time</h3>
          <ConversionChart
            viewsByDate={data.viewsByDate}
            leadsByDate={data.leadsByDate}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Leads by Source</h3>
          <LeadsSourceChart utmSources={data.utmSources} />
        </div>
      </div>

      {/* Leads by Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(data.leadsByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**2. Metrics Cards**

```tsx
// components/landing-pages/Analytics/MetricsCards.tsx

import React from 'react';

interface Props {
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
}

export default function MetricsCards({ totalViews, totalLeads, conversionRate }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Views</p>
            <p className="text-3xl font-bold mt-2">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-8 h-8 text-blue-600" /* eye icon */ />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Leads</p>
            <p className="text-3xl font-bold mt-2">{totalLeads.toLocaleString()}</p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <svg className="w-8 h-8 text-green-600" /* users icon */ />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Conversion Rate</p>
            <p className="text-3xl font-bold mt-2">{conversionRate.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-100 rounded-full p-3">
            <svg className="w-8 h-8 text-purple-600" /* trending up icon */ />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## State Management

### Recommended Approach: React Query

Use `@tanstack/react-query` for server state management. This provides caching, automatic refetching, and optimistic updates.

```typescript
// hooks/useLandingPages.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LandingPage, CreateLandingPageDto, UpdateLandingPageDto } from '@/types/landing-pages';

const API_BASE = '/api/landing-pages';

export function useLandingPages(filters?: any) {
  return useQuery({
    queryKey: ['landing-pages', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch landing pages');
      return response.json();
    },
  });
}

export function useLandingPage(id: string) {
  return useQuery({
    queryKey: ['landing-page', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch landing page');
      return response.json();
    },
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLandingPageDto) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create landing page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    },
  });
}

export function useUpdateLandingPage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLandingPageDto) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update landing page');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-page', id] });
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    },
  });
}

export function usePublishLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}/publish`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to publish landing page');
      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['landing-page', id] });
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
    },
  });
}
```

---

## Routing & Navigation

### Recommended Routes

```typescript
// App routing structure

/landing-pages
  - List all landing pages

/landing-pages/create
  - Create new landing page wizard

/landing-pages/:id/edit
  - Edit existing landing page

/landing-pages/:id/analytics
  - View analytics dashboard

/leads
  - List all leads

/leads/hot
  - Show hot leads (< 24 hours)

/leads/:id
  - Lead details page

/p/:slug
  - PUBLIC: View landing page (no auth)
```

---

## Testing Guidelines

### Unit Tests

Test individual components with Jest and React Testing Library:

```typescript
// __tests__/components/ShareButtons.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ShareButtons from '@/components/landing-pages/ShareButtons';

describe('ShareButtons', () => {
  const mockProps = {
    url: 'https://example.com/p/test-page',
    title: 'Test Umroh Package',
    onCopyLink: jest.fn(),
  };

  it('should render share buttons', () => {
    render(<ShareButtons {...mockProps} />);

    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument();
  });

  it('should call onCopyLink when copy button clicked', () => {
    render(<ShareButtons {...mockProps} />);

    const copyButton = screen.getByText('Copy Link');
    fireEvent.click(copyButton);

    expect(mockProps.onCopyLink).toHaveBeenCalled();
  });
});
```

### Integration Tests

Test complete user flows:

```typescript
// __tests__/flows/create-landing-page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateLandingPagePage from '@/pages/landing-pages/CreateLandingPagePage';

describe('Create Landing Page Flow', () => {
  it('should complete landing page creation wizard', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateLandingPagePage />
      </QueryClientProvider>
    );

    // Step 1: Select template
    const modernTemplate = screen.getByText('Modern');
    fireEvent.click(modernTemplate);
    fireEvent.click(screen.getByText('Next'));

    // Step 2: Customize branding
    const agentNameInput = screen.getByLabelText('Agent Name');
    fireEvent.change(agentNameInput, { target: { value: 'Ahmad Surya' } });
    fireEvent.click(screen.getByText('Next'));

    // Step 3: Customize content
    const introTextarea = screen.getByLabelText('Custom Introduction');
    fireEvent.change(introTextarea, { target: { value: 'Welcome!' } });
    fireEvent.click(screen.getByText('Next'));

    // Step 4: Review and publish
    fireEvent.click(screen.getByText('Create Landing Page'));

    await waitFor(() => {
      expect(screen.getByText('Landing page created successfully')).toBeInTheDocument();
    });
  });
});
```

---

## Additional Notes

### Performance Optimization

1. **Lazy Loading**: Use React.lazy() for heavy components
2. **Image Optimization**: Use Next.js Image component or similar
3. **Debouncing**: Debounce search inputs and live preview updates
4. **Pagination**: Implement infinite scroll or pagination for lists

### Accessibility

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **ARIA Labels**: Add proper ARIA labels to buttons and form inputs
3. **Color Contrast**: Ensure text has sufficient contrast (WCAG AA)
4. **Screen Reader Testing**: Test with screen readers (NVDA, JAWS, VoiceOver)

### Security

1. **Input Validation**: Validate all user inputs on frontend before submission
2. **XSS Prevention**: Sanitize any user-generated content displayed
3. **CSRF Protection**: Include CSRF tokens in all mutation requests
4. **Rate Limiting**: Implement rate limiting on public lead form

### Mobile Responsiveness

All components should be mobile-first and fully responsive:
- Use Tailwind's responsive classes (sm:, md:, lg:, xl:)
- Test on real devices (iOS Safari, Android Chrome)
- Ensure touch targets are at least 44x44px
- Optimize for slow network connections

---

## Questions or Issues?

If you encounter any issues or have questions about the backend APIs:

1. Check the Swagger documentation at `/api/docs`
2. Review the backend source code in `src/landing-pages/`, `src/leads/`, `src/analytics/`
3. Contact the backend team for API clarifications

---

**Document Version**: 1.0
**Last Updated**: 2025-12-23
**Epic**: Epic 10 - Agent Landing Page Builder
**Status**: Backend Complete, Frontend Implementation Needed
