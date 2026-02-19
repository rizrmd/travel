'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plane,
  Hotel,
  MapPin,
  Clock,
  Download,
  Calendar,
  Phone,
  Wifi,
  Utensils,
  Dumbbell,
  AlertCircle
} from 'lucide-react'
import { mockItinerary } from '@/lib/data/mock-itinerary'
import { useToast } from '@/hooks/use-toast'

export default function ItineraryPage() {
  const itinerary = mockItinerary
  const [selectedDay, setSelectedDay] = useState(1)
  const { toast } = useToast()

  const handleDownloadItinerary = () => {
    toast({
      title: 'Download Dimulai',
      description: 'Itinerary berhasil didownload',
    })
  }

  return (
    <AppLayout
      userRole="jamaah"
    >
      {/* Package Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informasi Paket</CardTitle>
            <Button onClick={handleDownloadItinerary}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nama Paket</p>
                <p className="text-xl font-bold">{itinerary.packageName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Durasi</p>
                  <p className="font-semibold">{itinerary.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maskapai</p>
                  <p className="font-semibold">{itinerary.airline.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Keberangkatan</p>
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-emerald-600" />
                    <p className="font-semibold">
                      {new Date(itinerary.departureDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Flight {itinerary.airline.outboundFlight}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Kepulangan</p>
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold">
                      {new Date(itinerary.returnDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Flight {itinerary.airline.returnFlight}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hotel className="h-5 w-5 text-amber-600" />
                  <p className="font-semibold">Hotel Makkah</p>
                </div>
                <p className="font-medium mb-1">{itinerary.hotelMakkah.name}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {itinerary.hotelMakkah.distance}
                </p>
                <div className="flex flex-wrap gap-1">
                  {itinerary.hotelMakkah.facilities.map((facility, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hotel className="h-5 w-5 text-emerald-600" />
                  <p className="font-semibold">Hotel Madinah</p>
                </div>
                <p className="font-medium mb-1">{itinerary.hotelMadinah.name}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {itinerary.hotelMadinah.distance}
                </p>
                <div className="flex flex-wrap gap-1">
                  {itinerary.hotelMadinah.facilities.map((facility, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card className="mb-6 border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-2">Tanggal Penting</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-amber-700 mb-1">Medical Check</p>
                  <p className="font-semibold text-amber-900">
                    {new Date(itinerary.importantDates.medicalCheck).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-700 mb-1">Manasik</p>
                  <p className="font-semibold text-amber-900">
                    {new Date(itinerary.importantDates.manasik).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-700 mb-1">Keberangkatan</p>
                  <p className="font-semibold text-amber-900">
                    {new Date(itinerary.importantDates.departure).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day-by-Day Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={`day-${selectedDay}`} onValueChange={(v) => setSelectedDay(parseInt(v.replace('day-', '')))}>
            <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-6">
              {itinerary.days.map((day) => (
                <TabsTrigger key={day.day} value={`day-${day.day}`}>
                  Hari {day.day}
                </TabsTrigger>
              ))}
            </TabsList>

            {itinerary.days.map((day) => (
              <TabsContent key={day.day} value={`day-${day.day}`}>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-1">{day.title}</h3>
                  <p className="text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="space-y-4">
                  {day.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="relative pl-8 pb-6 border-l-2 border-emerald-200 last:border-l-0 last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white" />

                      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-emerald-600">
                              {activity.time}
                            </span>
                          </div>
                          {activity.location && (
                            <Badge variant="outline">
                              <MapPin className="h-3 w-3 mr-1" />
                              {activity.location}
                            </Badge>
                          )}
                        </div>

                        <h4 className="font-semibold text-lg mb-1">{activity.title}</h4>
                        <p className="text-muted-foreground mb-2">{activity.description}</p>

                        {activity.note && (
                          <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-800">{activity.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Hotel Information Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-amber-600" />
              Detail Hotel Makkah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg mb-1">{itinerary.hotelMakkah.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {itinerary.hotelMakkah.distance}
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold mb-2">Fasilitas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {itinerary.hotelMakkah.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {facility === 'WiFi Gratis' && <Wifi className="h-4 w-4 text-muted-foreground" />}
                      {facility === 'Buffet Breakfast' && <Utensils className="h-4 w-4 text-muted-foreground" />}
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold mb-1">Kontak Hotel:</p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {itinerary.hotelMakkah.contact}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-emerald-600" />
              Detail Hotel Madinah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg mb-1">{itinerary.hotelMadinah.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {itinerary.hotelMadinah.distance}
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold mb-2">Fasilitas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {itinerary.hotelMadinah.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {facility === 'WiFi Gratis' && <Wifi className="h-4 w-4 text-muted-foreground" />}
                      {facility === 'Buffet Breakfast' && <Utensils className="h-4 w-4 text-muted-foreground" />}
                      {facility === 'Gym' && <Dumbbell className="h-4 w-4 text-muted-foreground" />}
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold mb-1">Kontak Hotel:</p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {itinerary.hotelMadinah.contact}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
