import { create } from 'zustand'
import { notificationService } from '@services/notificationService'
import type { Notification } from '../types/notification'

type NotificationStoreState = {
  notifications: Notification[]
  toasts: Notification[]
  unreadCount: number
  isLoaded: boolean
}

type NotificationStoreActions = {
  loadNotifications: () => Promise<void>
  addNotification: (notification?: Notification) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  dismissToast: (notificationId: string) => void
}

type NotificationStore = NotificationStoreState & NotificationStoreActions

const initialState: NotificationStoreState = {
  notifications: [],
  toasts: [],
  unreadCount: 0,
  isLoaded: false,
}

const vehicleSamples = ['VTS Vehicle 1', 'VTS Vehicle 2', 'VTS Vehicle 3', 'VTS Vehicle 4', 'VTS Vehicle 5']
const locationSamples = [
  'Sector 21, New Delhi',
  'Ring Road, New Delhi',
  'NH 48, Gurgaon',
  'MG Road, Bengaluru',
  'Infocity, Hyderabad',
]

const eventSamples: Array<{ type: Notification['type']; message: string }> = [
  { type: 'overspeed', message: 'Overspeed alert' },
  { type: 'geofence_enter', message: 'Vehicle entered geofence' },
  { type: 'geofence_exit', message: 'Vehicle exited geofence' },
  { type: 'idling', message: 'Vehicle idling detected' },
  { type: 'stop', message: 'Vehicle stop detected' },
]

function randomFromArray<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)]
}

function buildMockIncomingNotificationPayload() {
  const event = randomFromArray(eventSamples)
  const vehicleName = randomFromArray(vehicleSamples)
  const vehicleId = `veh-${vehicleSamples.indexOf(vehicleName) + 1}`
  const location = randomFromArray(locationSamples)

  return {
    type: event.type,
    vehicleId,
    vehicleName,
    message: `${event.message}: ${vehicleName}`,
    location,
  }
}

function countUnread(notifications: Notification[]): number {
  return notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0)
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  ...initialState,

  loadNotifications: async () => {
    const notifications = await notificationService.getNotifications()
    set({
      notifications,
      unreadCount: countUnread(notifications),
      isLoaded: true,
    })
  },

  addNotification: async (notification) => {
    const nextNotification =
      notification ?? (await notificationService.createNotification(buildMockIncomingNotificationPayload()))

    set((state) => {
      const notifications = [nextNotification, ...state.notifications]
      const toasts = [nextNotification, ...state.toasts].slice(0, 5)
      const unreadCount = nextNotification.read ? state.unreadCount : state.unreadCount + 1

      return {
        notifications,
        toasts,
        unreadCount,
      }
    })
  },

  markAsRead: async (notificationId) => {
    const updated = await notificationService.markAsRead(notificationId)
    if (!updated) {
      return
    }

    set((state) => {
      const target = state.notifications.find((item) => item.id === notificationId)
      if (!target) {
        return state
      }

      const notifications = state.notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item,
      )
      const unreadCount = target.read ? state.unreadCount : Math.max(0, state.unreadCount - 1)

      return {
        notifications,
        unreadCount,
      }
    })
  },

  markAllAsRead: async () => {
    const notifications = await notificationService.markAllAsRead()
    set({
      notifications,
      unreadCount: 0,
    })
  },

  dismissToast: (notificationId) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== notificationId),
    }))
  },
}))
