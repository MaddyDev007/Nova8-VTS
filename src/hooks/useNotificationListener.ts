import { useEffect } from 'react'
import { useNotificationStore } from '@store/notificationStore'

const EVENT_INTERVAL_MS = 15000

export function useNotificationListener() {
  const isLoaded = useNotificationStore((state) => state.isLoaded)
  const loadNotifications = useNotificationStore((state) => state.loadNotifications)
  const addNotification = useNotificationStore((state) => state.addNotification)

  useEffect(() => {
    if (isLoaded) {
      return
    }

    void loadNotifications()
  }, [isLoaded, loadNotifications])

  useEffect(() => {
    // TODO: Replace interval simulation with WebSocket event subscription.
    const intervalId = window.setInterval(() => {
      void addNotification()
    }, EVENT_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [addNotification])
}
