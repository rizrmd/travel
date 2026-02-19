import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function TestComponentsPage() {
  return (
    <main className="min-h-screen p-24 space-y-12 bg-slate-50">
      <div>
        <h1 className="text-3xl font-bold mb-8">
          Travel Umroh Design System Components
        </h1>
      </div>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="tertiary">Tertiary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small Button</Button>
          <Button size="default">Default Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </section>

      {/* Badge Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badge Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="destructive">Destructive Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
        </div>
      </section>

      {/* Status Badge Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Status Badge Variants (Travel Umroh)</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="urgent">Mendesak (Urgent)</Badge>
          <Badge variant="soon">Segera (Soon)</Badge>
          <Badge variant="ready">Siap (Ready)</Badge>
        </div>
      </section>

      {/* Card Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jamaah Status</CardTitle>
              <CardDescription>Current progress overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Dokumen</span>
                  <Badge variant="ready">Complete</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pembayaran</span>
                  <Badge variant="soon">Pending</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Paspor</span>
                  <Badge variant="urgent">Missing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                Primary Action
              </Button>
              <Button className="w-full" variant="secondary">
                Secondary Action
              </Button>
              <Button className="w-full" variant="tertiary">
                Tertiary Action
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Accessibility Info */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility (WCAG AAA)</h2>
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>All buttons have focus visible states with ring indicators</li>
              <li>Color contrast meets WCAG AAA standards (7:1 for normal text)</li>
              <li>Touch targets meet minimum 44×44px requirements</li>
              <li>Keyboard navigation fully supported with Tab key</li>
              <li>Screen reader accessible with proper ARIA attributes</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
