"use client"

import * as React from "react"
import { ArrowUpDown, MoreVertical, Eye } from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MenuPopover } from "@/components/overlays/tooltips-popovers"
import { formatCurrency, formatPercentage } from "@/lib/utils/currency"
import { cn } from "@/lib/utils"

export interface AgentPerformance {
  id: string
  name: string
  email: string
  totalJamaah: number
  completedJamaah: number
  revenue: number
  conversionRate: number
  avgResponseTime: string
  lastActive: string
}

interface PerformanceTableProps {
  data: AgentPerformance[]
  onViewDetails?: (agent: AgentPerformance) => void
  onEdit?: (agent: AgentPerformance) => void
  onDelete?: (agent: AgentPerformance) => void
}

export function PerformanceTable({
  data,
  onViewDetails,
  onEdit,
  onDelete,
}: PerformanceTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns: ColumnDef<AgentPerformance>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Nama Agen
            <ArrowUpDown className="ml-8 h-16 w-16" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div>
            <p className="font-medium text-slate-900">{row.original.name}</p>
            <p className="text-body-sm text-slate-600">{row.original.email}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "totalJamaah",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Total Jamaah
            <ArrowUpDown className="ml-8 h-16 w-16" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const completed = row.original.completedJamaah
        const total = row.original.totalJamaah
        return (
          <div>
            <p className="font-medium text-slate-900">{total}</p>
            <p className="text-body-sm text-slate-600">
              {completed} selesai
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "revenue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Pendapatan
            <ArrowUpDown className="ml-8 h-16 w-16" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <p className="font-medium text-slate-900">
            {formatCurrency(row.original.revenue)}
          </p>
        )
      },
    },
    {
      accessorKey: "conversionRate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Konversi
            <ArrowUpDown className="ml-8 h-16 w-16" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const rate = row.original.conversionRate
        return (
          <Badge
            variant={rate >= 75 ? "default" : rate >= 60 ? "secondary" : "outline"}
            className={cn(
              rate >= 75 && "bg-green-600 hover:bg-green-700",
              rate >= 60 && rate < 75 && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {formatPercentage(rate)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "avgResponseTime",
      header: "Waktu Respon",
      cell: ({ row }) => {
        return (
          <p className="text-body-sm text-slate-600">
            {row.original.avgResponseTime}
          </p>
        )
      },
    },
    {
      accessorKey: "lastActive",
      header: "Terakhir Aktif",
      cell: ({ row }) => {
        return (
          <p className="text-body-sm text-slate-600">
            {row.original.lastActive}
          </p>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const agent = row.original

        return (
          <MenuPopover
            trigger={
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-16 w-16" />
              </Button>
            }
            actions={[
              {
                label: "Lihat Detail",
                icon: Eye,
                onClick: () => onViewDetails?.(agent),
              },
              ...(onEdit
                ? [
                    {
                      label: "Edit",
                      onClick: () => onEdit(agent),
                    },
                  ]
                : []),
              ...(onDelete
                ? [
                    {
                      label: "Hapus",
                      onClick: () => onDelete(agent),
                      destructive: true,
                    },
                  ]
                : []),
            ]}
          />
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-96 text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
