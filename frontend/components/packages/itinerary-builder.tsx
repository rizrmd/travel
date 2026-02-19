"use client"

import { useState } from "react"
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

interface ItineraryBuilderProps {
  value: ItineraryDay[]
  onChange: (itinerary: ItineraryDay[]) => void
  maxDays?: number
}

export function ItineraryBuilder({ value, onChange, maxDays = 30 }: ItineraryBuilderProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: value.length + 1,
      title: '',
      activities: ['']
    }
    onChange([...value, newDay])
    setExpandedDays(new Set([...expandedDays, newDay.day]))
  }

  const removeDay = (index: number) => {
    const newItinerary = value.filter((_, i) => i !== index)
    // Renumber days
    const renumbered = newItinerary.map((day, i) => ({ ...day, day: i + 1 }))
    onChange(renumbered)
  }

  const updateDayTitle = (index: number, title: string) => {
    const newItinerary = [...value]
    newItinerary[index] = { ...newItinerary[index], title }
    onChange(newItinerary)
  }

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...value]
    newItinerary[dayIndex] = {
      ...newItinerary[dayIndex],
      activities: [...newItinerary[dayIndex].activities, '']
    }
    onChange(newItinerary)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, activity: string) => {
    const newItinerary = [...value]
    const newActivities = [...newItinerary[dayIndex].activities]
    newActivities[activityIndex] = activity
    newItinerary[dayIndex] = { ...newItinerary[dayIndex], activities: newActivities }
    onChange(newItinerary)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newItinerary = [...value]
    const newActivities = newItinerary[dayIndex].activities.filter((_, i) => i !== activityIndex)
    // Keep at least one activity
    newItinerary[dayIndex] = {
      ...newItinerary[dayIndex],
      activities: newActivities.length > 0 ? newActivities : ['']
    }
    onChange(newItinerary)
  }

  const moveDay = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return
    }

    const newItinerary = [...value]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newItinerary[index], newItinerary[targetIndex]] = [
      newItinerary[targetIndex],
      newItinerary[index]
    ]

    // Renumber days
    const renumbered = newItinerary.map((day, i) => ({ ...day, day: i + 1 }))
    onChange(renumbered)
  }

  const toggleExpand = (day: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(day)) {
      newExpanded.delete(day)
    } else {
      newExpanded.add(day)
    }
    setExpandedDays(newExpanded)
  }

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Itinerary Perjalanan</Label>
          <p className="text-sm text-slate-600 mt-4">
            Susun jadwal perjalanan hari demi hari
          </p>
        </div>
        <Badge variant="outline">
          {value.length} Hari
        </Badge>
      </div>

      {/* Days List */}
      <div className="space-y-12">
        {value.map((day, index) => {
          const isExpanded = expandedDays.has(day.day)
          const isFirst = index === 0
          const isLast = index === value.length - 1

          return (
            <Card
              key={day.day}
              className={cn(
                "transition-all",
                isExpanded ? "border-blue-300 shadow-md" : "border-slate-200"
              )}
            >
              <CardHeader className="pb-12">
                <div className="flex items-center gap-12">
                  <GripVertical className="h-20 w-20 text-slate-400 cursor-move" />

                  <div
                    className="flex items-center gap-12 flex-1 cursor-pointer"
                    onClick={() => toggleExpand(day.day)}
                  >
                    <Badge className="bg-blue-600 text-white font-bold min-w-[60px] justify-center">
                      Day {day.day}
                    </Badge>
                    <div className="flex-1">
                      {day.title ? (
                        <p className="font-medium text-slate-900">{day.title}</p>
                      ) : (
                        <p className="text-slate-400 italic">Belum ada judul...</p>
                      )}
                      {!isExpanded && day.activities.length > 0 && (
                        <p className="text-xs text-slate-500">
                          {day.activities.filter(a => a.trim()).length} aktivitas
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDay(index, 'up')}
                      disabled={isFirst}
                      className="h-32 w-32 p-0"
                    >
                      <ChevronUp className="h-16 w-16" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDay(index, 'down')}
                      disabled={isLast}
                      className="h-32 w-32 p-0"
                    >
                      <ChevronDown className="h-16 w-16" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(index)}
                      className="h-32 w-32 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-16 w-16" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-16 pt-0">
                  {/* Day Title */}
                  <div className="space-y-8">
                    <Label htmlFor={`day-${day.day}-title`} className="text-sm">
                      Judul Hari {day.day}
                    </Label>
                    <Input
                      id={`day-${day.day}-title`}
                      value={day.title}
                      onChange={(e) => updateDayTitle(index, e.target.value)}
                      placeholder="e.g., Keberangkatan Jakarta - Jeddah"
                      className="font-medium"
                    />
                  </div>

                  {/* Activities */}
                  <div className="space-y-8">
                    <Label className="text-sm">Aktivitas</Label>
                    <div className="space-y-8">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-center gap-8">
                          <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                            {actIndex + 1}
                          </div>
                          <Input
                            value={activity}
                            onChange={(e) => updateActivity(index, actIndex, e.target.value)}
                            placeholder="e.g., Berkumpul di Bandara Soekarno-Hatta"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(index, actIndex)}
                            disabled={day.activities.length === 1}
                            className="h-32 w-32 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-16 w-16" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addActivity(index)}
                      className="w-full"
                    >
                      <Plus className="h-14 w-14 mr-8" />
                      Tambah Aktivitas
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Add Day Button */}
      {value.length < maxDays && (
        <Button
          type="button"
          variant="outline"
          onClick={addDay}
          className="w-full h-48 border-dashed border-2 hover:border-blue-400 hover:bg-blue-50"
        >
          <Plus className="h-16 w-16 mr-8" />
          Tambah Hari {value.length + 1}
        </Button>
      )}

      {value.length === 0 && (
        <Card className="p-48 text-center border-dashed">
          <p className="text-slate-500 mb-16">Belum ada itinerary</p>
          <Button type="button" onClick={addDay}>
            <Plus className="h-16 w-16 mr-8" />
            Tambah Hari Pertama
          </Button>
        </Card>
      )}

      {/* Summary */}
      {value.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-16">
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-8">Ringkasan Itinerary:</p>
              <ul className="space-y-4">
                <li>📅 Total: <strong>{value.length} hari</strong></li>
                <li>
                  ✅ Aktivitas: <strong>
                    {value.reduce((sum, day) => sum + day.activities.filter(a => a.trim()).length, 0)} aktivitas
                  </strong>
                </li>
                <li>
                  📝 Status: <strong>
                    {value.every(d => d.title && d.activities.some(a => a.trim()))
                      ? 'Lengkap'
                      : 'Belum lengkap - ada hari yang kosong'}
                  </strong>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
