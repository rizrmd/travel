"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Phone,
  MessageCircle,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Stamp,
  ShoppingBag,
  Plane,
} from "lucide-react"
import { adminMenuItems } from "@/lib/navigation/menu-items"
import { mockDailyTasks, DailyTask } from "@/lib/data/mock-pipeline"
import { cn } from "@/lib/utils"

// Priority colors
const priorityConfig: Record<DailyTask['priority'], { color: string; icon: any }> = {
  urgent: { color: 'red', icon: AlertCircle },
  high: { color: 'orange', icon: AlertCircle },
  normal: { color: 'blue', icon: Clock },
  low: { color: 'slate', icon: Clock },
}

// Status colors
const statusConfig: Record<DailyTask['status'], { color: string; label: string }> = {
  pending: { color: 'slate', label: 'Pending' },
  'in-progress': { color: 'blue', label: 'In Progress' },
  completed: { color: 'green', label: 'Completed' },
  blocked: { color: 'red', label: 'Blocked' },
}

export default function PipelineTasksPage() {
  const [selectedRole, setSelectedRole] = useState<string>('all')

  const allTasks = useMemo(() => mockDailyTasks, [])

  const tasksByColumn = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    let filtered = allTasks
    if (selectedRole !== 'all') {
      filtered = allTasks.filter(task => task.assignedRole === selectedRole)
    }

    return {
      urgent: filtered.filter(task =>
        task.status !== 'completed' &&
        (task.priority === 'urgent' || new Date(task.dueAt) < now)
      ),
      today: filtered.filter(task =>
        task.status !== 'completed' &&
        task.priority !== 'urgent' &&
        task.dueAt === today
      ),
      upcoming: filtered.filter(task =>
        task.status !== 'completed' &&
        task.priority !== 'urgent' &&
        task.dueAt > today &&
        task.dueAt <= tomorrow
      ),
      blocked: filtered.filter(task => task.status === 'blocked'),
    }
  }, [allTasks, selectedRole])

  const roleStats = useMemo(() => {
    const roles = ['document-admin', 'siskopatuh-admin', 'visa-admin', 'logistics-admin', 'travel-admin']
    return roles.map(role => {
      const tasks = allTasks.filter(t => t.assignedRole === role)
      const urgent = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
      const pending = tasks.filter(t => t.status === 'pending').length
      return { role, total: tasks.length, urgent, pending }
    })
  }, [allTasks])

  const TaskCard = ({ task }: { task: DailyTask }) => {
    const priorityInfo = priorityConfig[task.priority]
    const statusInfo = statusConfig[task.status]
    const PriorityIcon = priorityInfo.icon

    return (
      <Card className="mb-12 hover:shadow-md transition-shadow">
        <CardContent className="p-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-900">{task.jamaahName}</p>
              <p className="text-xs text-slate-600 mt-2">{task.taskType}</p>
            </div>
            <Badge
              variant={task.priority === 'urgent' ? 'destructive' : 'outline'}
              className="text-xs"
            >
              <PriorityIcon className="h-[10px] w-[10px] mr-4" />
              {task.priority.toUpperCase()}
            </Badge>
          </div>

          {/* Stage */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-8">
            <FileText className="h-[12px] w-[12px]" />
            <span>{task.stageName}</span>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between text-xs mb-12">
            <span className="text-slate-500">Due:</span>
            <span className={cn(
              "font-medium",
              new Date(task.dueAt) < new Date() ? "text-red-600" : "text-slate-900"
            )}>
              {new Date(task.dueAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Notes */}
          {task.notes && (
            <p className="text-xs text-slate-600 bg-slate-50 p-8 rounded mb-12">
              {task.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-8">
            <Button variant="outline" size="sm" className="flex-1 h-[32px] text-xs">
              <Phone className="h-[12px] w-[12px] mr-4" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-[32px] text-xs">
              <MessageCircle className="h-[12px] w-[12px] mr-4" />
              WhatsApp
            </Button>
            <Link href={`/jamaah/${task.jamaahId}`}>
              <Button variant="ghost" size="sm" className="h-[32px] px-8">
                <Eye className="h-[12px] w-[12px]" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ColumnHeader = ({ title, count, color }: { title: string; count: number; color: string }) => (
    <div className={cn("p-12 rounded-t-lg border-b-2", `border-${color}-500 bg-${color}-50`)}>
      <div className="flex items-center justify-between">
        <h3 className={cn("font-semibold text-sm", `text-${color}-700`)}>{title}</h3>
        <Badge className={cn(`bg-${color}-600 text-white`)}>
          {count}
        </Badge>
      </div>
    </div>
  )

  return (
    <AppLayout
      userName="Mbak Rina"
      userRole="Admin Operations"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pipeline", href: "/dashboard/pipeline" },
        { label: "Task Queue", href: "/dashboard/pipeline/tasks", isCurrentPage: true },
      ]}
      menuItems={adminMenuItems}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Admin Task Queue
            </h1>
            <p className="mt-8 text-slate-600">
              Daily tasks organized by priority and deadline
            </p>
          </div>
          <Link href="/dashboard/pipeline">
            <Button variant="outline">
              Back to Pipeline
            </Button>
          </Link>
        </div>

        {/* Role Filter Tabs */}
        <Tabs value={selectedRole} onValueChange={setSelectedRole}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="all">All ({allTasks.length})</TabsTrigger>
            <TabsTrigger value="document-admin">
              Documents ({roleStats.find(r => r.role === 'document-admin')?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="siskopatuh-admin">
              SISKOPATUH ({roleStats.find(r => r.role === 'siskopatuh-admin')?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="visa-admin">
              Visa ({roleStats.find(r => r.role === 'visa-admin')?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="logistics-admin">
              Logistics ({roleStats.find(r => r.role === 'logistics-admin')?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="travel-admin">
              Travel ({roleStats.find(r => r.role === 'travel-admin')?.total || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Daily Metrics Summary */}
        <div className="grid grid-cols-4 gap-16">
          <Card>
            <CardHeader className="pb-8">
              <CardTitle className="text-xs font-medium text-red-600">URGENT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{tasksByColumn.urgent.length}</div>
              <p className="text-xs text-slate-500 mt-2">Overdue or critical</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-8">
              <CardTitle className="text-xs font-medium text-blue-600">TODAY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{tasksByColumn.today.length}</div>
              <p className="text-xs text-slate-500 mt-2">Due today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-8">
              <CardTitle className="text-xs font-medium text-slate-600">UPCOMING</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{tasksByColumn.upcoming.length}</div>
              <p className="text-xs text-slate-500 mt-2">Due tomorrow</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-8">
              <CardTitle className="text-xs font-medium text-orange-600">BLOCKED</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{tasksByColumn.blocked.length}</div>
              <p className="text-xs text-slate-500 mt-2">Needs intervention</p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Urgent Column */}
          <div className="bg-white rounded-lg border">
            <ColumnHeader title="URGENT" count={tasksByColumn.urgent.length} color="red" />
            <div className="p-12 max-h-[600px] overflow-y-auto">
              {tasksByColumn.urgent.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <CheckCircle2 className="h-[32px] w-[32px] mx-auto mb-8" />
                  <p className="text-xs">No urgent tasks</p>
                </div>
              ) : (
                tasksByColumn.urgent.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>

          {/* Today Column */}
          <div className="bg-white rounded-lg border">
            <ColumnHeader title="TODAY" count={tasksByColumn.today.length} color="blue" />
            <div className="p-12 max-h-[600px] overflow-y-auto">
              {tasksByColumn.today.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <Clock className="h-[32px] w-[32px] mx-auto mb-8" />
                  <p className="text-xs">No tasks due today</p>
                </div>
              ) : (
                tasksByColumn.today.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>

          {/* Upcoming Column */}
          <div className="bg-white rounded-lg border">
            <ColumnHeader title="UPCOMING" count={tasksByColumn.upcoming.length} color="slate" />
            <div className="p-12 max-h-[600px] overflow-y-auto">
              {tasksByColumn.upcoming.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <Clock className="h-[32px] w-[32px] mx-auto mb-8" />
                  <p className="text-xs">No upcoming tasks</p>
                </div>
              ) : (
                tasksByColumn.upcoming.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>

          {/* Blocked Column */}
          <div className="bg-white rounded-lg border">
            <ColumnHeader title="BLOCKED" count={tasksByColumn.blocked.length} color="orange" />
            <div className="p-12 max-h-[600px] overflow-y-auto">
              {tasksByColumn.blocked.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <CheckCircle2 className="h-[32px] w-[32px] mx-auto mb-8" />
                  <p className="text-xs">No blocked tasks</p>
                </div>
              ) : (
                tasksByColumn.blocked.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
