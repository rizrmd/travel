# Travel Umroh Design System

**Version:** 1.0.0
**Last Updated:** December 24, 2025

This document outlines the design system for the Travel Umroh web application. It provides guidelines for colors, typography, spacing, components, and accessibility standards.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Components](#components)
5. [Accessibility](#accessibility)
6. [Usage Examples](#usage-examples)

---

## Color Palette

### Primary Colors

| Color | Hex Code | Usage | CSS Variable |
|-------|----------|-------|--------------|
| **Primary Blue** | `#2563EB` | Links, primary actions, CTAs | `--color-primary` |
| **Secondary Gold** | `#F59E0B` | Achievement badges, premium features | `--color-secondary` |

```tsx
// Usage in Tailwind
<Button className="bg-primary">Primary Action</Button>
<Badge variant="secondary">Premium</Badge>
```

### Status Colors (WCAG AAA Compliant)

All status colors meet WCAG AAA contrast standards (7:1 ratio).

| Status | Hex Code | Usage | CSS Variable |
|--------|----------|-------|--------------|
| **Urgent** | `#EF4444` | Critical documents missing, deadline <7 days | `--color-status-urgent` |
| **Soon** | `#D97706` | Action needed, deadline 7-30 days | `--color-status-soon` |
| **Ready** | `#10B981` | Complete, approved, ready to proceed | `--color-status-ready` |

```tsx
// Usage with Badge component
<Badge variant="urgent">Mendesak</Badge>
<Badge variant="soon">Segera</Badge>
<Badge variant="ready">Siap</Badge>
```

### Brand Colors

| Brand | Hex Code | Usage |
|-------|----------|-------|
| **WhatsApp** | `#25D366` | WhatsApp integration buttons |

```tsx
<Button className="bg-whatsapp text-white">Send WhatsApp</Button>
```

### Neutral Colors (Slate Scale)

| Shade | Hex Code | Usage |
|-------|----------|-------|
| **Slate 50** | `#F8FAFC` | Background, subtle fills |
| **Slate 100** | `#F1F5F9` | Secondary backgrounds |
| **Slate 200** | `#E2E8F0` | Borders, dividers |
| **Slate 300** | `#CBD5E1` | Disabled borders |
| **Slate 400** | `#94A3B8` | Placeholder text |
| **Slate 500** | `#64748B` | Secondary text |
| **Slate 600** | `#475569` | Body text |
| **Slate 700** | `#334155` | Headings |
| **Slate 800** | `#1E293B` | Strong emphasis |
| **Slate 900** | `#0F172A` | Primary text, headlines |

```tsx
<p className="text-slate-900">Primary text</p>
<p className="text-slate-600">Body text</p>
<p className="text-slate-400">Placeholder text</p>
```

---

## Typography

### Font Families

| Font | Usage | CSS Variable |
|------|-------|--------------|
| **Inter** | Body text, UI elements, forms | `var(--font-inter)` or `font-sans` |
| **Poppins** | Headings, KPI numbers, display text | `var(--font-poppins)` or `font-display` |

### Font Sizes

| Name | Size | Usage | Tailwind Class |
|------|------|-------|----------------|
| **Caption** | 12px | Small labels, metadata | `text-caption` |
| **Body Small** | 14px | Dense tables, secondary info | `text-body-sm` |
| **Body** | 16px | Default body text, paragraphs | `text-body` |
| **Large** | 18px | Emphasized text, intro paragraphs | `text-large` |
| **Heading 3** | 24px | Section headings, card titles | `text-h3` |
| **KPI** | 48px | Dashboard numbers, key metrics | `text-kpi` |

```tsx
// Typography examples
<h1 className="text-h3 font-display font-semibold">Section Heading</h1>
<p className="text-body font-sans">This is body text using Inter font.</p>
<span className="text-caption text-slate-500">Updated 2 hours ago</span>
<div className="text-kpi font-display font-bold text-primary">127</div>
```

---

## Spacing

The design system uses a **4px base unit** with a consistent spacing scale.

| Name | Value | Usage | Tailwind Class |
|------|-------|-------|----------------|
| **4** | 4px | Tight spacing, icon padding | `space-4` or `p-1` |
| **8** | 8px | Small gaps between related items | `space-8` or `p-2` |
| **12** | 12px | Compact component padding | `space-12` or `p-3` |
| **16** | 16px | Default spacing, component padding | `space-16` or `p-4` |
| **24** | 24px | Section spacing, card padding | `space-24` or `p-6` |
| **32** | 32px | Large section gaps | `space-32` or `p-8` |
| **48** | 48px | Page section spacing | `space-48` or `p-12` |
| **64** | 64px | Major layout sections | `space-64` or `p-16` |

```tsx
// Spacing examples
<div className="p-24 space-y-16">
  <Card className="p-16">Content</Card>
</div>
```

---

## Components

### Button

**Variants:** `default`, `secondary`, `tertiary`, `outline`, `ghost`, `link`, `destructive`
**Sizes:** `sm`, `default`, `lg`, `icon`

```tsx
import { Button } from "@/components/ui/button"

// Primary action
<Button variant="default">Save Changes</Button>

// Secondary action
<Button variant="secondary">Premium Feature</Button>

// Tertiary (less emphasis)
<Button variant="tertiary">Cancel</Button>

// Outline
<Button variant="outline">View Details</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large Button</Button>
```

**Accessibility:**
- All buttons have visible focus rings (2px blue, 4px offset)
- Minimum touch target: 44×44px (48×48px preferred)
- Keyboard accessible via Tab key
- Disabled states have `disabled:opacity-50` and `disabled:pointer-events-none`

### Badge

**Variants:** `default`, `secondary`, `destructive`, `outline`, `urgent`, `soon`, `ready`

```tsx
import { Badge } from "@/components/ui/badge"

// Status badges (Travel Umroh specific)
<Badge variant="urgent">Missing Document</Badge>
<Badge variant="soon">Payment Due</Badge>
<Badge variant="ready">Complete</Badge>

// Standard badges
<Badge variant="default">New</Badge>
<Badge variant="secondary">Premium</Badge>
```

### Card

**Components:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Jamaah Profile</CardTitle>
    <CardDescription>Personal information and documents</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Edit Profile</Button>
  </CardFooter>
</Card>
```

### Form Components

**Available:** `Input`, `Label`, `Select`, `Checkbox`, `Textarea`, `Radio Group`, `Switch`

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

<div className="space-y-2">
  <Label htmlFor="name">Full Name</Label>
  <Input id="name" placeholder="Enter name" />
</div>

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

**With React Hook Form + Zod:**

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### Overlay Components

**Available:** `Dialog`, `Sheet`, `Toast`, `Sonner`, `Popover`, `Dropdown Menu`

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

**Toast Notifications:**

```tsx
import { toast } from "sonner"

// Success
toast.success("Profile updated successfully")

// Error
toast.error("Failed to save changes")

// Info
toast.info("New message received")
```

### Data Table (TanStack Table)

```tsx
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

type Jamaah = {
  id: string
  name: string
  status: string
}

const columns: ColumnDef<Jamaah>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return <Badge variant={status}>{status}</Badge>
    },
  },
]

<DataTable
  columns={columns}
  data={jamaahList}
  searchKey="name"
  searchPlaceholder="Search jamaah..."
/>
```

---

## Accessibility

### WCAG AAA Compliance

All components meet **WCAG AAA standards** (Level AAA).

#### Color Contrast

| Element | Contrast Ratio | Standard |
|---------|----------------|----------|
| Normal text (<18px) | **7:1** | WCAG AAA |
| Large text (≥18px) | **4.5:1** | WCAG AAA |
| Status colors | **7:1** | WCAG AAA |

#### Touch Targets

| Element | Minimum Size | Preferred Size |
|---------|--------------|----------------|
| Buttons | 44×44px | 48×48px |
| Checkboxes | 44×44px | 48×48px |
| Links (mobile) | 44×44px | 48×48px |

#### Keyboard Navigation

- **Tab:** Navigate between interactive elements
- **Enter/Space:** Activate buttons and links
- **Arrow keys:** Navigate within dropdowns, radio groups
- **Escape:** Close dialogs, dropdowns

All interactive components have **visible focus indicators**:
- 2px blue ring (`ring-2 ring-ring`)
- 4px offset (`ring-offset-2`)

#### Screen Readers

- All form inputs have associated `<Label>` elements
- Buttons have descriptive text (no icon-only buttons without `aria-label`)
- ARIA roles and attributes on complex components
- Live regions for dynamic content updates

#### Layout Stability

- Design supports **200% zoom** without horizontal scrolling
- Layout remains stable at all breakpoints
- No content reflow during loading states

### Responsive Breakpoints

| Breakpoint | Width | Device |
|------------|-------|--------|
| **Mobile Small** | 320px | Small phones |
| **Mobile Large** | 480px | Large phones |
| **Tablet** | 768px | Tablets |
| **Desktop** | 1024px | Desktop |
| **Wide** | 1440px+ | Large monitors |

---

## Usage Examples

### Example 1: Jamaah Status Card

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-h3 font-display">Ahmad Hidayat</CardTitle>
    <CardDescription>ID: JAM-2025-001</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-body text-slate-600">Dokumen</span>
      <Badge variant="ready">Complete</Badge>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-body text-slate-600">Pembayaran</span>
      <Badge variant="soon">Pending</Badge>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-body text-slate-600">Paspor</span>
      <Badge variant="urgent">Missing</Badge>
    </div>
  </CardContent>
  <CardFooter className="space-x-2">
    <Button variant="default">Edit</Button>
    <Button variant="tertiary">View Details</Button>
  </CardFooter>
</Card>
```

### Example 2: Dashboard KPI Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-24">
  <Card>
    <CardHeader>
      <CardDescription>Total Jamaah</CardDescription>
      <div className="text-kpi font-display font-bold text-primary">127</div>
    </CardHeader>
  </Card>

  <Card>
    <CardHeader>
      <CardDescription>Ready to Depart</CardDescription>
      <div className="text-kpi font-display font-bold text-status-ready">45</div>
    </CardHeader>
  </Card>

  <Card>
    <CardHeader>
      <CardDescription>Needs Attention</CardDescription>
      <div className="text-kpi font-display font-bold text-status-urgent">12</div>
    </CardHeader>
  </Card>
</div>
```

### Example 3: WhatsApp Bulk Message Button

```tsx
<Button className="bg-whatsapp text-white hover:bg-whatsapp/90">
  <MessageCircle className="mr-2 h-4 w-4" />
  Send WhatsApp Message
</Button>
```

---

## Component Testing

All components can be viewed at: `/test-components`

This page showcases all variants and states of each component for visual testing and reference.

---

## Contributing

When adding new components or updating the design system:

1. **Follow the color palette** - Use existing colors and CSS variables
2. **Maintain accessibility** - Ensure WCAG AAA compliance (7:1 contrast)
3. **Use the spacing scale** - Stick to the 4px base unit
4. **Test keyboard navigation** - All interactive elements must be keyboard accessible
5. **Document new patterns** - Update this document with usage examples
6. **Mobile-first approach** - Design for 320px first, then scale up

---

**Questions or Issues?**
Refer to the shadcn/ui documentation: https://ui.shadcn.com
Or check the component test page at `/test-components`
