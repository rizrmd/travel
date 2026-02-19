# Production Pipeline Management - Customizable Design

**Date:** December 25, 2024
**Purpose:** Design customizable production pipeline system for multi-tenant SaaS
**Key Insight:** Each agency may have slightly different operational workflows
**Requirement:** Pipeline must be configurable per tenant/agency

---

## Executive Summary

Traditional pipeline systems have **fixed stages** that all tenants must follow. However, travel agencies have different operational processes:

- **Agency A** may require **Vaksin Certificate** verification
- **Agency B** may skip SISKOPATUH (handles manually)
- **Agency C** may add **Medical Clearance** stage before visa
- **Agency D** may have **Custom Merchandise** stage (prayer mats, bags, etc.)

**Solution:** Build a **Pipeline Configuration System** where Super Admin can customize stages per tenant, and each agency can enable/disable/reorder stages based on their workflow.

---

## 1. Architecture: Three-Layer Pipeline System

### Layer 1: Global Pipeline Template (Super Admin)

**Purpose:** Define all possible pipeline stages that can be used across the platform

```typescript
// Global pipeline stage library
export interface GlobalPipelineStage {
  id: string
  code: string  // e.g., 'document-ktp', 'visa-application'
  category: 'document' | 'government' | 'travel' | 'logistics' | 'custom'
  name: string
  description: string
  defaultSLA: number  // hours
  defaultResponsibleRole: string
  icon: string
  color: string
  isCore: boolean  // Core stages cannot be deleted
  isOptional: boolean  // Can agencies skip this?
  configFields?: {
    fieldName: string
    fieldType: 'text' | 'date' | 'number' | 'select' | 'checkbox'
    required: boolean
    options?: string[]  // for select type
  }[]
  createdAt: string
  createdBy: string  // Super admin
}

// Examples of global stages
const globalStages: GlobalPipelineStage[] = [
  {
    id: 'gs-1',
    code: 'document-ktp',
    category: 'document',
    name: 'KTP Collection',
    description: 'Collect and verify KTP from jamaah',
    defaultSLA: 72,  // 3 days
    defaultResponsibleRole: 'document-admin',
    icon: 'id-card',
    color: 'blue',
    isCore: true,  // Cannot be deleted
    isOptional: false,
    configFields: [
      { fieldName: 'nikValidation', fieldType: 'checkbox', required: false },
      { fieldName: 'photoQualityCheck', fieldType: 'checkbox', required: false }
    ]
  },
  {
    id: 'gs-2',
    code: 'document-passport',
    category: 'document',
    name: 'Passport Verification',
    description: 'Verify passport validity (min 6 months)',
    defaultSLA: 48,
    defaultResponsibleRole: 'document-admin',
    icon: 'passport',
    color: 'blue',
    isCore: true,
    isOptional: false
  },
  {
    id: 'gs-3',
    code: 'document-vaksin',
    category: 'document',
    name: 'Vaksin Certificate',
    description: 'Verify Meningitis and COVID-19 vaccination',
    defaultSLA: 120,
    defaultResponsibleRole: 'health-admin',
    icon: 'syringe',
    color: 'green',
    isCore: false,  // Optional - some agencies may not require
    isOptional: true
  },
  {
    id: 'gs-4',
    code: 'siskopatuh-submission',
    category: 'government',
    name: 'SISKOPATUH Submission',
    description: 'Submit jamaah data to government system',
    defaultSLA: 24,
    defaultResponsibleRole: 'siskopatuh-admin',
    icon: 'building',
    color: 'purple',
    isCore: true,
    isOptional: false
  },
  {
    id: 'gs-5',
    code: 'medical-clearance',
    category: 'custom',
    name: 'Medical Clearance',
    description: 'Medical checkup for elderly jamaah (65+)',
    defaultSLA: 168,  // 7 days
    defaultResponsibleRole: 'health-admin',
    icon: 'stethoscope',
    color: 'red',
    isCore: false,
    isOptional: true,  // Only some agencies require this
    configFields: [
      { fieldName: 'ageThreshold', fieldType: 'number', required: true },
      { fieldName: 'clinicName', fieldType: 'text', required: false }
    ]
  },
  {
    id: 'gs-6',
    code: 'visa-application',
    category: 'government',
    name: 'Visa Application',
    description: 'Submit visa application to Saudi embassy',
    defaultSLA: 240,  // 10 days
    defaultResponsibleRole: 'visa-admin',
    icon: 'stamp',
    color: 'orange',
    isCore: true,
    isOptional: false
  },
  {
    id: 'gs-7',
    code: 'uniform-order',
    category: 'logistics',
    name: 'Uniform Order',
    description: 'Order ihram, gamis, and travel gear',
    defaultSLA: 168,
    defaultResponsibleRole: 'logistics-admin',
    icon: 'shopping-bag',
    color: 'teal',
    isCore: true,
    isOptional: false
  },
  {
    id: 'gs-8',
    code: 'custom-merchandise',
    category: 'custom',
    name: 'Custom Merchandise',
    description: 'Order prayer mats, bags, name tags',
    defaultSLA: 120,
    defaultResponsibleRole: 'logistics-admin',
    icon: 'gift',
    color: 'pink',
    isCore: false,
    isOptional: true,  // Only premium agencies offer this
    configFields: [
      { fieldName: 'includePrayerMat', fieldType: 'checkbox', required: false },
      { fieldName: 'includeTravelBag', fieldType: 'checkbox', required: false },
      { fieldName: 'brandingOption', fieldType: 'select', required: false,
        options: ['None', 'Agency Logo', 'Custom Design'] }
    ]
  },
  {
    id: 'gs-9',
    code: 'flight-booking',
    category: 'travel',
    name: 'Flight Booking',
    description: 'Book roundtrip flights to Saudi Arabia',
    defaultSLA: 72,
    defaultResponsibleRole: 'travel-admin',
    icon: 'plane',
    color: 'sky',
    isCore: true,
    isOptional: false
  },
  {
    id: 'gs-10',
    code: 'pre-departure-briefing',
    category: 'custom',
    name: 'Pre-Departure Briefing',
    description: 'Manasik training and travel orientation',
    defaultSLA: 48,
    defaultResponsibleRole: 'operations-manager',
    icon: 'presentation',
    color: 'indigo',
    isCore: false,
    isOptional: true,
    configFields: [
      { fieldName: 'sessionDuration', fieldType: 'number', required: false },
      { fieldName: 'venue', fieldType: 'text', required: false }
    ]
  }
]
```

---

### Layer 2: Tenant Pipeline Configuration

**Purpose:** Each tenant/agency configures which stages they use and in what order

```typescript
export interface TenantPipelineConfig {
  id: string
  tenantId: string
  tenantName: string
  version: number  // Pipeline version for change tracking
  isActive: boolean

  // Ordered list of enabled stages
  stages: {
    stageId: string  // References GlobalPipelineStage.id
    order: number    // Display order (1, 2, 3, ...)
    enabled: boolean
    customName?: string  // Override default name
    customSLA?: number   // Override default SLA
    responsibleRole: string
    mandatoryForDeparture: boolean  // Must complete before departure?

    // Custom configuration per stage
    config?: Record<string, any>  // Matches configFields from global stage

    // Conditional logic
    conditions?: {
      type: 'age' | 'package-type' | 'destination' | 'custom'
      operator: 'equals' | 'greater-than' | 'less-than' | 'contains'
      value: any
    }[]
  }[]

  // Stage dependencies (Stage B cannot start until Stage A is complete)
  dependencies?: {
    stageId: string
    dependsOn: string[]  // Array of stage IDs
  }[]

  // Automation rules
  automations?: {
    stageId: string
    triggerEvent: 'stage-complete' | 'stage-delayed' | 'stage-blocked'
    action: 'send-notification' | 'assign-task' | 'escalate'
    config: Record<string, any>
  }[]

  createdAt: string
  updatedAt: string
  createdBy: string
}

// Example: Agency A Configuration (Premium Agency)
const agencyAConfig: TenantPipelineConfig = {
  id: 'tpc-1',
  tenantId: 'tenant-agency-a',
  tenantName: 'PT Travel Berkah Umroh',
  version: 2,
  isActive: true,
  stages: [
    // 1. Document Collection
    {
      stageId: 'gs-1',  // KTP
      order: 1,
      enabled: true,
      responsibleRole: 'document-admin',
      mandatoryForDeparture: true
    },
    {
      stageId: 'gs-2',  // Passport
      order: 2,
      enabled: true,
      responsibleRole: 'document-admin',
      mandatoryForDeparture: true
    },
    {
      stageId: 'gs-3',  // Vaksin
      order: 3,
      enabled: true,  // Agency A requires vaksin
      customName: 'Sertifikat Vaksin (Wajib)',
      responsibleRole: 'document-admin',
      mandatoryForDeparture: true,
      config: {
        nikValidation: true,
        photoQualityCheck: true
      }
    },
    // 2. Medical Clearance (conditional)
    {
      stageId: 'gs-5',  // Medical Clearance
      order: 4,
      enabled: true,
      responsibleRole: 'health-admin',
      mandatoryForDeparture: false,
      conditions: [
        { type: 'age', operator: 'greater-than', value: 65 }  // Only for 65+
      ],
      config: {
        ageThreshold: 65,
        clinicName: 'Klinik Umroh Sehat'
      }
    },
    // 3. Government Submissions
    {
      stageId: 'gs-4',  // SISKOPATUH
      order: 5,
      enabled: true,
      responsibleRole: 'siskopatuh-admin',
      mandatoryForDeparture: true
    },
    {
      stageId: 'gs-6',  // Visa
      order: 6,
      enabled: true,
      responsibleRole: 'visa-admin',
      mandatoryForDeparture: true
    },
    // 4. Logistics
    {
      stageId: 'gs-7',  // Uniform
      order: 7,
      enabled: true,
      responsibleRole: 'logistics-admin',
      mandatoryForDeparture: true
    },
    {
      stageId: 'gs-8',  // Custom Merchandise
      order: 8,
      enabled: true,  // Premium feature
      customName: 'Paket Merchandise VIP',
      responsibleRole: 'logistics-admin',
      mandatoryForDeparture: false,
      config: {
        includePrayerMat: true,
        includeTravelBag: true,
        brandingOption: 'Agency Logo'
      }
    },
    // 5. Travel Arrangements
    {
      stageId: 'gs-9',  // Flight
      order: 9,
      enabled: true,
      responsibleRole: 'travel-admin',
      mandatoryForDeparture: true
    },
    // 6. Pre-Departure
    {
      stageId: 'gs-10',  // Briefing
      order: 10,
      enabled: true,
      customSLA: 72,  // 3 days instead of default 2 days
      responsibleRole: 'operations-manager',
      mandatoryForDeparture: true,
      config: {
        sessionDuration: 240,  // 4 hours
        venue: 'Kantor Pusat PT Travel Berkah'
      }
    }
  ],
  dependencies: [
    {
      stageId: 'gs-6',  // Visa cannot start until...
      dependsOn: ['gs-1', 'gs-2', 'gs-3']  // KTP, Passport, Vaksin complete
    },
    {
      stageId: 'gs-9',  // Flight booking cannot start until...
      dependsOn: ['gs-6']  // Visa approved
    }
  ],
  automations: [
    {
      stageId: 'gs-6',
      triggerEvent: 'stage-delayed',
      action: 'send-notification',
      config: {
        delayThreshold: 48,  // hours
        recipients: ['visa-admin', 'operations-manager'],
        channel: 'whatsapp',
        message: 'Visa processing delayed for {jamaah_name}'
      }
    }
  ],
  createdAt: '2024-12-01',
  updatedAt: '2024-12-15',
  createdBy: 'super-admin-id'
}

// Example: Agency B Configuration (Budget Agency)
const agencyBConfig: TenantPipelineConfig = {
  id: 'tpc-2',
  tenantId: 'tenant-agency-b',
  tenantName: 'CV Umroh Hemat',
  version: 1,
  isActive: true,
  stages: [
    // Simpler pipeline - only essentials
    {
      stageId: 'gs-1',  // KTP
      order: 1,
      enabled: true,
      responsibleRole: 'admin',  // Single admin handles all
      mandatoryForDeparture: true
    },
    {
      stageId: 'gs-2',  // Passport
      order: 2,
      enabled: true,
      responsibleRole: 'admin',
      mandatoryForDeparture: true
    },
    // No vaksin verification (jamaah responsible)
    {
      stageId: 'gs-3',  // Vaksin
      order: 3,
      enabled: false  // Disabled for this agency
    },
    // No medical clearance
    {
      stageId: 'gs-5',
      order: 4,
      enabled: false
    },
    // No SISKOPATUH (handled manually outside system)
    {
      stageId: 'gs-4',
      order: 5,
      enabled: false
    },
    {
      stageId: 'gs-6',  // Visa
      order: 6,
      enabled: true,
      responsibleRole: 'admin',
      mandatoryForDeparture: true
    },
    {
      stageId: 'gs-7',  // Uniform
      order: 7,
      enabled: true,
      responsibleRole: 'admin',
      mandatoryForDeparture: true
    },
    // No custom merchandise
    {
      stageId: 'gs-8',
      order: 8,
      enabled: false
    },
    {
      stageId: 'gs-9',  // Flight
      order: 9,
      enabled: true,
      responsibleRole: 'admin',
      mandatoryForDeparture: true
    },
    // No pre-departure briefing
    {
      stageId: 'gs-10',
      order: 10,
      enabled: false
    }
  ],
  dependencies: [
    {
      stageId: 'gs-6',  // Visa
      dependsOn: ['gs-1', 'gs-2']  // Only KTP and Passport
    }
  ],
  automations: [],
  createdAt: '2024-11-20',
  updatedAt: '2024-11-20',
  createdBy: 'super-admin-id'
}
```

---

### Layer 3: Jamaah Pipeline Status (Runtime)

**Purpose:** Track actual progress of each jamaah through their agency's configured pipeline

```typescript
export interface JamaahPipelineStatus {
  id: string
  jamaahId: string
  tenantId: string
  pipelineConfigId: string  // References TenantPipelineConfig.id
  pipelineVersion: number   // Lock to version when jamaah created

  currentStage: string  // Current stage ID
  currentStageStatus: 'on-track' | 'at-risk' | 'delayed' | 'blocked' | 'completed'
  overallProgress: number  // 0-100%

  // Track each stage instance
  stageInstances: {
    stageId: string
    stageName: string
    status: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'failed'
    assignedTo?: string  // Admin user ID
    startedAt?: string
    completedAt?: string
    slaDeadline: string
    isOverdue: boolean
    daysOverdue?: number

    // Stage-specific data
    data?: Record<string, any>  // E.g., { nikValidation: true, photoQuality: 'good' }

    // Blockers
    blockers?: {
      reason: string
      createdAt: string
      createdBy: string
      resolved: boolean
      resolvedAt?: string
    }[]

    // Notes and comments
    notes?: {
      text: string
      createdAt: string
      createdBy: string
    }[]
  }[]

  // Metadata
  createdAt: string
  updatedAt: string
}
```

---

## 2. UI/UX: Pipeline Configuration Interface

### A. Super Admin - Global Stage Library

```typescript
// Page: /super-admin/pipeline/global-stages

<div className="space-y-24">
  <div className="flex justify-between items-center">
    <h1>Global Pipeline Stage Library</h1>
    <Button onClick={() => setShowCreateStage(true)}>
      <Plus className="mr-8" />
      Create New Stage
    </Button>
  </div>

  {/* Filter by category */}
  <Tabs defaultValue="all">
    <TabsList>
      <TabsTrigger value="all">All Stages</TabsTrigger>
      <TabsTrigger value="document">Document</TabsTrigger>
      <TabsTrigger value="government">Government</TabsTrigger>
      <TabsTrigger value="travel">Travel</TabsTrigger>
      <TabsTrigger value="logistics">Logistics</TabsTrigger>
      <TabsTrigger value="custom">Custom</TabsTrigger>
    </TabsList>

    <TabsContent value="all">
      <div className="grid grid-cols-3 gap-16">
        {globalStages.map(stage => (
          <Card key={stage.id} className={`border-${stage.color}-500`}>
            <CardHeader className={`bg-${stage.color}-50`}>
              <div className="flex items-center gap-12">
                <div className={`h-40 w-40 rounded-full bg-${stage.color}-100 flex items-center justify-center`}>
                  <Icon name={stage.icon} className={`text-${stage.color}-600`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{stage.name}</CardTitle>
                  <Badge variant={stage.isCore ? 'default' : 'secondary'}>
                    {stage.isCore ? 'Core' : 'Optional'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-16">
              <p className="text-sm text-muted-foreground mb-12">
                {stage.description}
              </p>
              <div className="space-y-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Default SLA:</span>
                  <span className="font-medium">{stage.defaultSLA} hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{stage.defaultResponsibleRole}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{stage.category}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used by:</span>
                  <span className="font-medium">12 agencies</span>
                </div>
              </div>
              <Separator className="my-12" />
              <div className="flex gap-8">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="mr-8 h-14 w-14" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={stage.isCore}
                >
                  <Trash className="mr-8 h-14 w-14" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  </Tabs>

  {/* Create/Edit Stage Modal */}
  <Dialog open={showCreateStage} onOpenChange={setShowCreateStage}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create Global Pipeline Stage</DialogTitle>
      </DialogHeader>
      <form className="space-y-16">
        <div className="grid grid-cols-2 gap-16">
          <div>
            <Label>Stage Code *</Label>
            <Input placeholder="e.g., document-ktp" />
          </div>
          <div>
            <Label>Category *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Stage Name *</Label>
          <Input placeholder="e.g., KTP Collection" />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea placeholder="Describe what this stage involves..." />
        </div>

        <div className="grid grid-cols-3 gap-16">
          <div>
            <Label>Default SLA (hours) *</Label>
            <Input type="number" placeholder="72" />
          </div>
          <div>
            <Label>Icon</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id-card">ID Card</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="syringe">Syringe</SelectItem>
                {/* ... more icons */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                {/* ... more colors */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div className="flex items-center space-x-8">
            <Checkbox id="isCore" />
            <Label htmlFor="isCore">Core Stage (cannot be deleted)</Label>
          </div>
          <div className="flex items-center space-x-8">
            <Checkbox id="isOptional" />
            <Label htmlFor="isOptional">Optional (agencies can skip)</Label>
          </div>
        </div>

        <div>
          <Label>Custom Configuration Fields</Label>
          <p className="text-sm text-muted-foreground mb-12">
            Define custom fields that agencies can configure for this stage
          </p>
          <Button variant="outline" size="sm">
            <Plus className="mr-8 h-14 w-14" />
            Add Configuration Field
          </Button>
          {/* Field builder... */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateStage(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Stage</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</div>
```

---

### B. Super Admin - Tenant Pipeline Configuration

```typescript
// Page: /super-admin/tenants/{tenantId}/pipeline

<div className="space-y-24">
  <div className="flex justify-between items-center">
    <div>
      <h1>Pipeline Configuration</h1>
      <p className="text-muted-foreground">
        Configure production pipeline for {tenant.name}
      </p>
    </div>
    <div className="flex gap-8">
      <Button variant="outline">
        <Copy className="mr-8" />
        Copy from Template
      </Button>
      <Button variant="outline">
        <History className="mr-8" />
        Version History
      </Button>
      <Button onClick={savePipelineConfig}>
        <Save className="mr-8" />
        Save Configuration
      </Button>
    </div>
  </div>

  {/* Pipeline Builder - Drag and Drop */}
  <Card>
    <CardHeader>
      <CardTitle>Pipeline Stages</CardTitle>
      <p className="text-sm text-muted-foreground">
        Drag stages from the library to build the pipeline. Reorder as needed.
      </p>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-5 gap-16">
        {/* Left: Available Stages */}
        <div className="col-span-2 border rounded-lg p-16">
          <h3 className="font-semibold mb-12">Available Stages</h3>
          <div className="space-y-8">
            {availableStages.map(stage => (
              <div
                key={stage.id}
                draggable
                onDragStart={(e) => handleDragStart(e, stage)}
                className="p-12 border rounded-md cursor-move hover:bg-gray-50"
              >
                <div className="flex items-center gap-8">
                  <GripVertical className="h-16 w-16 text-gray-400" />
                  <Icon name={stage.icon} />
                  <div>
                    <p className="font-medium text-sm">{stage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage.category} • SLA: {stage.defaultSLA}h
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Pipeline */}
        <div className="col-span-3 border rounded-lg p-16 bg-gray-50">
          <h3 className="font-semibold mb-12">Active Pipeline ({activePipeline.length} stages)</h3>

          <div
            className="space-y-8 min-h-[400px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {activePipeline.length === 0 ? (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Drag stages here to build pipeline
              </div>
            ) : (
              activePipeline.map((stage, index) => (
                <div key={stage.stageId} className="bg-white p-12 border rounded-md">
                  <div className="flex items-start gap-12">
                    {/* Order number */}
                    <div className="flex items-center gap-8">
                      <div className="h-32 w-32 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {stage.order}
                      </div>
                      <GripVertical className="h-16 w-16 text-gray-400 cursor-move" />
                    </div>

                    {/* Stage info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-8 mb-8">
                        <Icon name={stage.icon} />
                        <h4 className="font-semibold">{stage.customName || stage.name}</h4>
                        {!stage.enabled && (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                        {stage.mandatoryForDeparture && (
                          <Badge variant="destructive">Mandatory</Badge>
                        )}
                      </div>

                      {/* Quick config */}
                      <div className="grid grid-cols-2 gap-8 text-sm">
                        <div>
                          <Label className="text-xs">SLA</Label>
                          <Input
                            type="number"
                            value={stage.customSLA || stage.defaultSLA}
                            onChange={(e) => updateStageSLA(stage.stageId, e.target.value)}
                            className="h-32"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Responsible Role</Label>
                          <Select
                            value={stage.responsibleRole}
                            onValueChange={(value) => updateStageRole(stage.stageId, value)}
                          >
                            <SelectTrigger className="h-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="document-admin">Document Admin</SelectItem>
                              <SelectItem value="visa-admin">Visa Admin</SelectItem>
                              <SelectItem value="logistics-admin">Logistics Admin</SelectItem>
                              {/* ... more roles */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Advanced config */}
                      {stage.configFields && (
                        <details className="mt-12">
                          <summary className="text-sm text-blue-600 cursor-pointer">
                            Advanced Configuration
                          </summary>
                          <div className="mt-8 space-y-8">
                            {stage.configFields.map(field => (
                              <div key={field.fieldName}>
                                <Label className="text-xs">{field.fieldName}</Label>
                                {renderConfigField(stage.stageId, field)}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStageEnabled(stage.stageId)}
                      >
                        {stage.enabled ? <EyeOff className="h-16 w-16" /> : <Eye className="h-16 w-16" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStageUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-16 w-16" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStageDown(index)}
                        disabled={index === activePipeline.length - 1}
                      >
                        <ChevronDown className="h-16 w-16" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(stage.stageId)}
                      >
                        <Trash className="h-16 w-16 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Dependencies */}
                  {stage.dependencies && stage.dependencies.length > 0 && (
                    <div className="mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <span className="text-yellow-800 font-medium">Dependencies:</span>
                      <span className="ml-8">
                        Cannot start until {stage.dependencies.map(d => getStageName(d)).join(', ')} complete
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Dependencies Configuration */}
  <Card>
    <CardHeader>
      <CardTitle>Stage Dependencies</CardTitle>
      <p className="text-sm text-muted-foreground">
        Define which stages must be completed before others can start
      </p>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stage</TableHead>
            <TableHead>Depends On</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activePipeline.filter(s => s.enabled).map(stage => (
            <TableRow key={stage.stageId}>
              <TableCell>{stage.customName || stage.name}</TableCell>
              <TableCell>
                <MultiSelect
                  value={getDependencies(stage.stageId)}
                  onChange={(deps) => updateDependencies(stage.stageId, deps)}
                  options={activePipeline
                    .filter(s => s.stageId !== stage.stageId && s.enabled)
                    .map(s => ({ value: s.stageId, label: s.customName || s.name }))}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearDependencies(stage.stageId)}
                >
                  Clear
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  {/* Automation Rules */}
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Automation Rules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure automatic actions when certain events occur
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-8" />
          Add Rule
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      {/* Automation rules list... */}
    </CardContent>
  </Card>

  {/* Preview */}
  <Card>
    <CardHeader>
      <CardTitle>Pipeline Preview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-8 overflow-x-auto pb-16">
        {activePipeline.filter(s => s.enabled).map((stage, index) => (
          <>
            <div key={stage.stageId} className="flex flex-col items-center min-w-[120px]">
              <div className={`h-48 w-48 rounded-full bg-${stage.color}-100 flex items-center justify-center mb-8`}>
                <Icon name={stage.icon} className={`h-24 w-24 text-${stage.color}-600`} />
              </div>
              <p className="text-sm font-medium text-center">{stage.customName || stage.name}</p>
              <p className="text-xs text-muted-foreground">{stage.customSLA || stage.defaultSLA}h</p>
            </div>
            {index < activePipeline.filter(s => s.enabled).length - 1 && (
              <ChevronRight className="h-24 w-24 text-gray-400 flex-shrink-0" />
            )}
          </>
        ))}
      </div>
    </CardContent>
  </Card>
</div>
```

---

### C. Tenant Admin - View Their Pipeline

```typescript
// Page: /admin/settings/pipeline

<div className="space-y-24">
  <div className="flex justify-between items-center">
    <div>
      <h1>Your Production Pipeline</h1>
      <p className="text-muted-foreground">
        This is your agency's configured operational workflow
      </p>
    </div>
    <Badge variant="outline">
      Version {pipelineConfig.version}
    </Badge>
  </div>

  {/* Read-only view of pipeline */}
  <Card>
    <CardHeader>
      <CardTitle>Pipeline Stages ({pipelineConfig.stages.filter(s => s.enabled).length} active)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-12">
        {pipelineConfig.stages.filter(s => s.enabled).map((stage, index) => (
          <div key={stage.stageId} className="flex items-center gap-16 p-16 border rounded-lg">
            <div className="flex items-center gap-12">
              <div className="h-40 w-40 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <Icon name={stage.icon} className="h-24 w-24" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{stage.customName || stage.name}</h3>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </div>

            <div className="flex gap-16 text-sm">
              <div>
                <p className="text-muted-foreground">SLA</p>
                <p className="font-medium">{stage.customSLA || stage.defaultSLA} hours</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{stage.responsibleRole}</p>
              </div>
              {stage.mandatoryForDeparture && (
                <Badge variant="destructive">Mandatory</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

  {/* Request Changes */}
  <Card>
    <CardHeader>
      <CardTitle>Need to Modify Pipeline?</CardTitle>
      <p className="text-sm text-muted-foreground">
        Contact support to request pipeline configuration changes
      </p>
    </CardHeader>
    <CardContent>
      <Button variant="outline">
        <Mail className="mr-8" />
        Request Pipeline Change
      </Button>
    </CardContent>
  </Card>
</div>
```

---

## 3. Database Schema (Updated)

```sql
-- Global pipeline stage library (platform-level)
CREATE TABLE global_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,  -- document, government, travel, logistics, custom
  name VARCHAR(200) NOT NULL,
  description TEXT,
  default_sla_hours INT NOT NULL,
  default_responsible_role VARCHAR(100),
  icon VARCHAR(50),
  color VARCHAR(50),
  is_core BOOLEAN DEFAULT FALSE,  -- Cannot be deleted
  is_optional BOOLEAN DEFAULT TRUE,  -- Can agencies skip?
  config_fields JSONB,  -- Custom configuration schema
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tenant-specific pipeline configuration
CREATE TABLE tenant_pipeline_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  stages JSONB NOT NULL,  -- Array of configured stages with order, SLA, role, etc.
  dependencies JSONB,  -- Stage dependencies
  automations JSONB,  -- Automation rules
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, version)
);

-- Version history for pipeline changes
CREATE TABLE tenant_pipeline_config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  config_id UUID REFERENCES tenant_pipeline_configs(id),
  version INT NOT NULL,
  config_snapshot JSONB NOT NULL,  -- Full config at this version
  change_summary TEXT,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Runtime: Jamaah pipeline tracking
CREATE TABLE jamaah_pipeline_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jamaah_id UUID REFERENCES jamaah(id),
  tenant_id UUID REFERENCES tenants(id),
  pipeline_config_id UUID REFERENCES tenant_pipeline_configs(id),
  pipeline_version INT NOT NULL,  -- Lock to config version
  current_stage_id VARCHAR(100),
  current_stage_status VARCHAR(50),  -- on-track, at-risk, delayed, blocked, completed
  overall_progress DECIMAL(5,2),  -- 0-100
  stage_instances JSONB NOT NULL,  -- Array of stage instances with status
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stage instance history (audit trail)
CREATE TABLE pipeline_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jamaah_pipeline_id UUID REFERENCES jamaah_pipeline_status(id),
  stage_id VARCHAR(100) NOT NULL,
  stage_name VARCHAR(200),
  status VARCHAR(50),  -- pending, in-progress, completed, skipped, failed
  assigned_to UUID REFERENCES users(id),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  sla_deadline TIMESTAMP,
  data JSONB,  -- Stage-specific data
  blockers JSONB,  -- Array of blocker objects
  notes JSONB,  -- Array of note objects
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenant_pipeline_active ON tenant_pipeline_configs(tenant_id, is_active);
CREATE INDEX idx_jamaah_pipeline_status ON jamaah_pipeline_status(jamaah_id);
CREATE INDEX idx_jamaah_pipeline_current_stage ON jamaah_pipeline_status(current_stage_id, current_stage_status);
CREATE INDEX idx_pipeline_history ON pipeline_stage_history(jamaah_pipeline_id, stage_id);
```

---

## 4. API Endpoints (Updated)

```typescript
// Super Admin - Global Stage Management
GET    /api/super-admin/pipeline/global-stages
POST   /api/super-admin/pipeline/global-stages
PUT    /api/super-admin/pipeline/global-stages/:id
DELETE /api/super-admin/pipeline/global-stages/:id

// Super Admin - Tenant Pipeline Configuration
GET    /api/super-admin/tenants/:tenantId/pipeline/config
POST   /api/super-admin/tenants/:tenantId/pipeline/config
PUT    /api/super-admin/tenants/:tenantId/pipeline/config/:configId
GET    /api/super-admin/tenants/:tenantId/pipeline/config/history

// Tenant Admin - View Pipeline (read-only)
GET    /api/admin/pipeline/config
POST   /api/admin/pipeline/config/request-change  // Request from support

// Admin - Pipeline Dashboard (uses tenant's configured pipeline)
GET    /api/admin/pipeline/overview
GET    /api/admin/pipeline/stages/:stageCode
GET    /api/admin/pipeline/jamaah/:jamaahId

// Pipeline Operations (runtime)
POST   /api/admin/pipeline/jamaah/:jamaahId/advance-stage
POST   /api/admin/pipeline/jamaah/:jamaahId/add-blocker
POST   /api/admin/pipeline/jamaah/:jamaahId/resolve-blocker
```

---

## 5. Implementation Plan (Revised)

### Epic 16: Admin Production Pipeline Management (REVISED)

**Story 16.1: Global Pipeline Stage Library** (4 days)
- Create global_pipeline_stages table
- Build Super Admin UI for creating/managing stages
- Implement stage categories and configuration schema
- Create 10-15 default stages

**Story 16.2: Tenant Pipeline Configuration System** (5 days)
- Create tenant_pipeline_configs table
- Build drag-and-drop pipeline builder UI
- Implement stage enable/disable, reorder, custom SLA
- Stage dependency configuration
- Automation rules setup

**Story 16.3: Pipeline Versioning & History** (2 days)
- Implement version control for pipeline changes
- Create history tracking
- Version comparison UI

**Story 16.4: Runtime Pipeline Engine** (4 days)
- Create jamaah_pipeline_status table
- Implement pipeline initialization when jamaah created
- Stage progression logic respecting dependencies
- SLA calculation and tracking

**Story 16.5: Manager Pipeline Dashboard** (5 days)
- Overview with customized stages
- Bottleneck detection based on tenant's pipeline
- Team performance by role
- Stage-by-stage metrics

**Story 16.6: Role-Based Admin Dashboards** (6 days)
- Document Admin Queue (if enabled)
- SISKOPATUH Admin Queue (if enabled)
- Visa Admin Queue (if enabled)
- Logistics Admin Queue (if enabled)
- Travel Admin Queue (if enabled)
- Dynamic dashboard based on tenant config

**Story 16.7: Jamaah Pipeline Detail View** (3 days)
- Timeline view with tenant's stages
- Stage history and audit trail
- Travel details integration
- Blocker management

**Story 16.8: Auto Reminder System** (4 days)
- Reminder engine based on configured SLAs
- Multi-channel notifications
- Escalation rules
- Template customization per stage

**Optional Story 16.9: Pipeline Templates** (2 days)
- Pre-built templates for common workflows
- "Copy from agency" feature
- Import/export pipeline configs

**Total Estimate:** 35 days → **5-6 weeks** with 2 developers

---

## 6. Benefits of Customizable Pipeline

### For Platform (Super Admin):
✅ **Flexibility:** Support diverse agency workflows
✅ **Scalability:** Add new stages without code changes
✅ **Competitive Advantage:** "Your workflow, not ours"
✅ **Easier Onboarding:** Match existing agency processes
✅ **Global Updates:** Add new stage, all tenants can opt-in

### For Agencies (Tenants):
✅ **Fit Their Process:** No forced workflow changes
✅ **Simplicity for Small Agencies:** Disable unnecessary stages
✅ **Premium Features for Large:** Add custom stages
✅ **Change as They Grow:** Start simple, add stages later
✅ **Compliance:** Add stages required by regulations

### For Admins (Operations):
✅ **Clear Workflow:** See only relevant stages
✅ **No Confusion:** Pipeline matches their real process
✅ **Accurate SLAs:** Based on their actual timelines
✅ **Less Training:** Familiar workflow

---

## 7. Example Use Cases

### Use Case 1: Small Budget Agency
- **Stages:** KTP → Passport → Visa → Uniform → Flight (5 stages)
- **Roles:** 1-2 admins handle everything
- **SLAs:** Relaxed (3-7 days per stage)
- **Custom:** None

### Use Case 2: Premium Full-Service Agency
- **Stages:** 12 stages including medical clearance, custom merchandise, pre-departure training
- **Roles:** 5-6 specialized admins
- **SLAs:** Tight (24-48 hours per stage)
- **Custom:** Prayer mat branding, VIP lounge access tracking

### Use Case 3: Corporate Umroh Provider
- **Stages:** Standard + Corporate invoice approval + Group coordination
- **Roles:** Finance admin, Group coordinator
- **Custom:** Approval workflow for HR departments

---

## 8. Migration Strategy

### Phase 1: Platform Setup (Week 1)
- Create global stage library with defaults
- Build Super Admin configuration UI

### Phase 2: Pilot Agencies (Week 2-3)
- Configure 2-3 agencies with different workflows
- Test customization features
- Gather feedback

### Phase 3: Rollout (Week 4-5)
- Configure remaining agencies
- Train support team on pipeline config
- Documentation and guides

### Phase 4: Optimization (Week 6+)
- Add requested custom stages
- Refine automation rules
- Performance tuning

---

## Conclusion

The **Customizable Pipeline System** transforms a rigid workflow into a flexible platform that adapts to each agency's unique processes. This significantly increases platform value and reduces onboarding friction.

**Key Success Metrics:**
- **Adoption:** 90%+ agencies actively use configured pipeline
- **Customization:** 70%+ agencies customize at least one stage
- **Efficiency:** 30% reduction in admin time per jamaah
- **Satisfaction:** 4.5/5 rating from agency admins

**Recommendation:** Implement as Enhanced Epic 16 with pipeline configuration as core feature, not afterthought.

---

**Document Status:** Ready for stakeholder review and implementation planning
**Next Steps:**
1. Review and approve customizable pipeline approach
2. Create global stage library with 15-20 default stages
3. Design pipeline builder UI mockups
4. Begin Epic 16 implementation
