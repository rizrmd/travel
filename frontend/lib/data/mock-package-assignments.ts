// Mock data for package assignments (which agents can sell which packages)

export interface PackageAssignment {
  id: string
  packageId: string
  agentId: string
  assignedAt: string
  assignedBy: string // Admin/Owner who assigned
}

// Mock package assignments
// Agent "agent-1" (Ibu Siti) can sell packages 1, 2, 3
// Agent "agent-2" can sell packages 2, 4
export const mockPackageAssignments: PackageAssignment[] = [
  {
    id: 'pa-1',
    packageId: '1', // Umroh Reguler 9 Hari
    agentId: 'agent-1', // Ibu Siti
    assignedAt: '2024-12-01',
    assignedBy: 'admin-1',
  },
  {
    id: 'pa-2',
    packageId: '2', // Umroh VIP 12 Hari
    agentId: 'agent-1', // Ibu Siti
    assignedAt: '2024-12-01',
    assignedBy: 'admin-1',
  },
  {
    id: 'pa-3',
    packageId: '3', // Umroh Plus Turki
    agentId: 'agent-1', // Ibu Siti
    assignedAt: '2024-12-05',
    assignedBy: 'admin-1',
  },
  {
    id: 'pa-4',
    packageId: '2', // Umroh VIP 12 Hari
    agentId: 'agent-2',
    assignedAt: '2024-12-02',
    assignedBy: 'admin-1',
  },
  {
    id: 'pa-5',
    packageId: '4', // Umroh Plus Dubai
    agentId: 'agent-2',
    assignedAt: '2024-12-02',
    assignedBy: 'admin-1',
  },
]

// Get packages assigned to a specific agent
export function getAssignedPackages(agentId: string): string[] {
  return mockPackageAssignments
    .filter(assignment => assignment.agentId === agentId)
    .map(assignment => assignment.packageId)
}

// Get agents assigned to a specific package
export function getAssignedAgents(packageId: string): string[] {
  return mockPackageAssignments
    .filter(assignment => assignment.packageId === packageId)
    .map(assignment => assignment.agentId)
}

// Check if agent has access to package
export function hasPackageAccess(agentId: string, packageId: string): boolean {
  return mockPackageAssignments.some(
    assignment => assignment.agentId === agentId && assignment.packageId === packageId
  )
}

// Get assignment statistics
export function getAssignmentStats() {
  const totalAssignments = mockPackageAssignments.length
  const uniquePackages = new Set(mockPackageAssignments.map(a => a.packageId)).size
  const uniqueAgents = new Set(mockPackageAssignments.map(a => a.agentId)).size

  return {
    totalAssignments,
    uniquePackages,
    uniqueAgents,
  }
}
