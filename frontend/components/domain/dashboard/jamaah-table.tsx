"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, Eye, Pencil } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { JamaahCard } from "./jamaah-card"
import { Jamaah } from "@/lib/types/jamaah"
import { cn } from "@/lib/utils"

interface JamaahTableProps {
  data: Jamaah[]
  selectedIds: string[]
  onToggleJamaah: (id: string) => void
  onSelectAll: (ids: string[]) => void
}

export function JamaahTable({
  data,
  selectedIds,
  onToggleJamaah,
  onSelectAll,
}: JamaahTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'status', desc: false },
    { id: 'name', desc: false },
  ])

  const handleView = (jamaah: Jamaah) => {
    window.location.href = `/jamaah/${jamaah.id}`
  }

  const handleEdit = (jamaah: Jamaah) => {
    window.location.href = `/jamaah/${jamaah.id}/edit`
  }

  const handleRowClick = (jamaah: Jamaah) => {
    window.location.href = `/jamaah/${jamaah.id}`
  }

  const columns: ColumnDef<Jamaah>[] = [
    {
      id: 'select',
      header: ({ table }) => {
        const visibleIds = table.getRowModel().rows.map((row) => row.original.id)
        const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))
        const someSelected = visibleIds.some((id) => selectedIds.includes(id)) && !allSelected

        return (
          <Checkbox
            checked={someSelected ? "indeterminate" : allSelected}
            onCheckedChange={() => onSelectAll(visibleIds)}
            aria-label="Select all visible jamaah"
            className="h-20 w-20"
          />
        )
      },
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.id)}
          onCheckedChange={() => onToggleJamaah(row.original.id)}
          aria-label={`Select ${row.original.name}`}
          className="h-20 w-20"
        />
      ),
      size: 48,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-8 hover:text-slate-900 transition-colors"
          >
            Nama
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-16 w-16" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-16 w-16" />
            ) : null}
          </button>
        )
      },
      cell: ({ row }) => (
        <button
          onClick={() => handleRowClick(row.original)}
          className="font-medium text-slate-900 hover:text-blue-600 hover:underline text-left"
        >
          {row.getValue('name')}
        </button>
      ),
    },
    {
      accessorKey: 'nik',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-8 hover:text-slate-900 transition-colors"
          >
            NIK
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-16 w-16" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-16 w-16" />
            ) : null}
          </button>
        )
      },
      cell: ({ row }) => <div className="text-slate-600">{row.getValue('nik')}</div>,
    },
    {
      accessorKey: 'package',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-8 hover:text-slate-900 transition-colors"
          >
            Paket
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-16 w-16" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-16 w-16" />
            ) : null}
          </button>
        )
      },
      cell: ({ row }) => <div className="text-slate-600">{row.getValue('package')}</div>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-8 hover:text-slate-900 transition-colors"
          >
            Status
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-16 w-16" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-16 w-16" />
            ) : null}
          </button>
        )
      },
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      sortingFn: (rowA, rowB) => {
        const statusOrder = { urgent: 0, soon: 1, ready: 2 }
        return statusOrder[rowA.original.status] - statusOrder[rowB.original.status]
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1 items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original)}
            aria-label={`View ${row.original.name}`}
            className="h-9 w-9"
          >
            <Eye className="h-[16px] w-[16px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            aria-label={`Edit ${row.original.name}`}
            className="h-9 w-9"
          >
            <Pencil className="h-[16px] w-[16px]" />
          </Button>
        </div>
      ),
      size: 100,
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
    <>
      {/* Desktop Table View (≥1024px) */}
      <div className="hidden lg:block rounded-lg border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={selectedIds.includes(row.original.id) && 'selected'}
                  className={cn(
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                    'hover:bg-slate-100 transition-colors'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (<1024px) */}
      <div className="lg:hidden space-y-16">
        {data.length > 0 ? (
          data.map((jamaah) => (
            <JamaahCard
              key={jamaah.id}
              jamaah={jamaah}
              isSelected={selectedIds.includes(jamaah.id)}
              onToggle={() => onToggleJamaah(jamaah.id)}
              onView={() => handleView(jamaah)}
              onEdit={() => handleEdit(jamaah)}
            />
          ))
        ) : (
          <div className="text-center py-48 text-slate-500">No results.</div>
        )}
      </div>
    </>
  )
}
