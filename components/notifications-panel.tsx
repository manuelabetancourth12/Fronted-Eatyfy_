"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { fetchNotifications } from "@/lib/api-client"
import { Bell, Check } from "lucide-react"

interface Notification {
  id: string
  title: string
  description: string
  date: string
  read: boolean
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      // TODO: fetch notifications from backend
      const data = await fetchNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("[v0] Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  if (loading) {
    return <div className="text-sm text-[var(--color-muted-foreground)]">Cargando notificaciones...</div>
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-2" />
        <p className="text-sm text-[var(--color-muted-foreground)]">No tienes notificaciones nuevas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border ${
            notification.read
              ? "bg-white border-[var(--color-border)]"
              : "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{notification.title}</h4>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-2">{notification.description}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{notification.date}</p>
            </div>
            {!notification.read && (
              <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)} className="shrink-0">
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
