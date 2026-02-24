'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  CreditCard,
  AlertTriangle,
  Info,
  Bell,
  BellOff,
  Trash2,
  Mail,
  MessageCircle,
  Smartphone,
  CheckCircle2
} from 'lucide-react'
import {
  mockNotifications,
  getUnreadCount,
  groupNotificationsByDate,
  formatRelativeTime,
  defaultNotificationPreferences,
  type NotificationType
} from '@/lib/data/mock-notifications'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<NotificationType | 'all'>('all')
  const [preferences, setPreferences] = useState(defaultNotificationPreferences)
  const { toast } = useToast()

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter)

  const groupedNotifications = groupNotificationsByDate(filteredNotifications)
  const unreadCount = getUnreadCount()

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'payment':
        return <CreditCard className="h-5 w-5 text-emerald-600" />
      case 'update':
        return <Info className="h-5 w-5 text-amber-600" />
      case 'important':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBgColor = (type: NotificationType, read: boolean) => {
    const opacity = read ? '50' : '100'
    switch (type) {
      case 'document':
        return `bg-blue-${opacity}`
      case 'payment':
        return `bg-emerald-${opacity}`
      case 'update':
        return `bg-amber-${opacity}`
      case 'important':
        return `bg-red-${opacity}`
      default:
        return `bg-gray-${opacity}`
    }
  }

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    )

    // Navigate to action URL if exists
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
    toast({
      title: 'Semua Ditandai Terbaca',
      description: 'Semua notifikasi telah ditandai sebagai terbaca',
    })
  }

  const handleClearAll = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
      setNotifications([])
      toast({
        title: 'Notifikasi Dihapus',
        description: 'Semua notifikasi telah dihapus',
      })
    }
  }

  const handleSavePreferences = () => {
    toast({
      title: 'Preferensi Disimpan',
      description: 'Pengaturan notifikasi Anda berhasil disimpan',
    })
  }

  const renderNotificationGroup = (title: string, notifications: any[]) => {
    if (notifications.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">{title}</h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-emerald-600' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${
                    notification.type === 'document' ? 'bg-blue-100' :
                    notification.type === 'payment' ? 'bg-emerald-100' :
                    notification.type === 'update' ? 'bg-amber-100' :
                    'bg-red-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.timestamp)}
                      </p>
                      {notification.actionUrl && (
                        <Badge variant="outline" className="text-xs">
                          Lihat Detail
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <AppLayout
    >
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Notifikasi</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Belum Dibaca</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <BellOff className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">7 Hari Terakhir</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => {
                    const notifDate = new Date(n.timestamp)
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    return notifDate >= weekAgo
                  }).length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Label className="text-sm font-semibold">Filter:</Label>
              <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Notifikasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Notifikasi</SelectItem>
                  <SelectItem value="document">Dokumen</SelectItem>
                  <SelectItem value="payment">Pembayaran</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="important">Penting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Tandai Semua Terbaca
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Semua
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div>
          {renderNotificationGroup('Hari Ini', groupedNotifications.today)}
          {renderNotificationGroup('Kemarin', groupedNotifications.yesterday)}
          {renderNotificationGroup('Minggu Lalu', groupedNotifications.lastWeek)}
          {renderNotificationGroup('Lebih Lama', groupedNotifications.older)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Tidak Ada Notifikasi</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'Anda belum memiliki notifikasi'
                : `Tidak ada notifikasi dengan tipe ${filter}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Preferences */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pengaturan Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-semibold">Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi melalui email
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.email}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, email: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-semibold">Notifikasi WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi melalui WhatsApp
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.whatsapp}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, whatsapp: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-semibold">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima notifikasi push di browser
                  </p>
                  <Badge variant="secondary" className="mt-1">Coming Soon</Badge>
                </div>
              </div>
              <Switch
                checked={preferences.push}
                disabled
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, push: checked }))
                }
              />
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={handleSavePreferences}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Simpan Pengaturan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
