"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

/**
 * Custom Tooltip Component
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-12">
      <p className="text-body-sm font-medium text-slate-900 mb-8">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-8 text-body-sm">
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-900">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * Line Chart Component
 */
interface LineChartData {
  name: string
  [key: string]: string | number
}

interface LineChartComponentProps {
  /**
   * Chart data
   */
  data: LineChartData[]
  /**
   * Lines to display with their config
   */
  lines: Array<{
    dataKey: string
    name: string
    color: string
  }>
  /**
   * Chart title
   */
  title?: string
  /**
   * Chart height
   * @default 300
   */
  height?: number
  /**
   * Show grid
   * @default true
   */
  showGrid?: boolean
  /**
   * Show legend
   * @default true
   */
  showLegend?: boolean
  /**
   * Additional className
   */
  className?: string
}

export function LineChartComponent({
  data,
  lines,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
}: LineChartComponentProps) {
  return (
    <Card className={cn("p-24", className)}>
      {title && (
        <h3 className="text-lg font-display font-semibold text-slate-900 mb-16">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

/**
 * Bar Chart Component
 */
interface BarChartData {
  name: string
  [key: string]: string | number
}

interface BarChartComponentProps {
  /**
   * Chart data
   */
  data: BarChartData[]
  /**
   * Bars to display with their config
   */
  bars: Array<{
    dataKey: string
    name: string
    color: string
  }>
  /**
   * Chart title
   */
  title?: string
  /**
   * Chart height
   * @default 300
   */
  height?: number
  /**
   * Show grid
   * @default true
   */
  showGrid?: boolean
  /**
   * Show legend
   * @default true
   */
  showLegend?: boolean
  /**
   * Bar layout
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal"
  /**
   * Additional className
   */
  className?: string
}

export function BarChartComponent({
  data,
  bars,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  layout = "vertical",
  className,
}: BarChartComponentProps) {
  return (
    <Card className={cn("p-24", className)}>
      {title && (
        <h3 className="text-lg font-display font-semibold text-slate-900 mb-16">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={layout}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
          <XAxis
            type={layout === "vertical" ? "category" : "number"}
            dataKey={layout === "vertical" ? "name" : undefined}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type={layout === "vertical" ? "number" : "category"}
            dataKey={layout === "horizontal" ? "name" : undefined}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

/**
 * Pie Chart Component
 */
interface PieChartData {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

interface PieChartComponentProps {
  /**
   * Chart data
   */
  data: PieChartData[]
  /**
   * Chart title
   */
  title?: string
  /**
   * Chart height
   * @default 300
   */
  height?: number
  /**
   * Show legend
   * @default true
   */
  showLegend?: boolean
  /**
   * Show labels on pie slices
   * @default false
   */
  showLabels?: boolean
  /**
   * Inner radius for donut chart (0-100)
   * @default 0
   */
  innerRadius?: number
  /**
   * Additional className
   */
  className?: string
}

export function PieChartComponent({
  data,
  title,
  height = 300,
  showLegend = true,
  showLabels = false,
  innerRadius = 0,
  className,
}: PieChartComponentProps) {
  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`
  }

  return (
    <Card className={cn("p-24", className)}>
      {title && (
        <h3 className="text-lg font-display font-semibold text-slate-900 mb-16">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderLabel : undefined}
            outerRadius={80}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

/**
 * Simple Trend Chart - Minimal line chart for small spaces
 */
interface TrendChartProps {
  /**
   * Chart data (y values)
   */
  data: number[]
  /**
   * Color of the line
   * @default "#2563eb"
   */
  color?: string
  /**
   * Chart height
   * @default 60
   */
  height?: number
  /**
   * Show positive trend (green) or negative (red)
   */
  trend?: "up" | "down" | "neutral"
  /**
   * Additional className
   */
  className?: string
}

export function TrendChart({
  data,
  color = "#2563eb",
  height = 60,
  trend,
  className,
}: TrendChartProps) {
  const chartData = data.map((value, index) => ({ value }))

  // Auto-detect trend color
  const trendColor = React.useMemo(() => {
    if (trend === "up") return "#10b981"
    if (trend === "down") return "#ef4444"
    return color
  }, [trend, color])

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={trendColor}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
