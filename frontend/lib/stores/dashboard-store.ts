import { create } from 'zustand'
import { Status } from '@/components/domain/dashboard/status-badge'

export type FilterStatus = 'all' | Status

interface DashboardState {
  filterStatus: FilterStatus
  selectedJamaah: string[]
  setFilterStatus: (status: FilterStatus) => void
  toggleJamaah: (id: string) => void
  selectAllVisible: (ids: string[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  filterStatus: 'all',
  selectedJamaah: [],

  setFilterStatus: (status) => set({ filterStatus: status }),

  toggleJamaah: (id) =>
    set((state) => ({
      selectedJamaah: state.selectedJamaah.includes(id)
        ? state.selectedJamaah.filter((jamaahId) => jamaahId !== id)
        : [...state.selectedJamaah, id],
    })),

  selectAllVisible: (ids) =>
    set((state) => {
      const allSelected = ids.every((id) => state.selectedJamaah.includes(id))
      if (allSelected) {
        // Deselect all visible
        return {
          selectedJamaah: state.selectedJamaah.filter((id) => !ids.includes(id)),
        }
      } else {
        // Select all visible
        const newSelected = [...state.selectedJamaah]
        ids.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        return { selectedJamaah: newSelected }
      }
    }),

  clearSelection: () => set({ selectedJamaah: [] }),

  isSelected: (id) => get().selectedJamaah.includes(id),
}))
