import { Status } from "@/components/domain/dashboard/status-badge"

export interface Jamaah {
  id: string
  name: string
  nik: string
  package: string
  status: Status
}
