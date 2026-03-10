import type { NotificationPreferences } from '../types/profile'

export type UpdatePreferencesPayload = {
  timezone: string
  preferences: NotificationPreferences
}

type UpdatePreferencesResponse = {
  success: true
  message: string
}

let storedPreferences: UpdatePreferencesPayload = {
  timezone: 'Asia/Kolkata',
  preferences: {
    overspeed: true,
    idling: true,
    geofence: true,
    stop: true,
    deviceOffline: true,
  },
}

class ProfileService {
  async updatePreferences(payload: UpdatePreferencesPayload): Promise<UpdatePreferencesResponse> {
    // TODO: Replace with REST call (e.g. PATCH /profile/preferences)
    storedPreferences = { ...payload }
    return {
      success: true,
      message: 'Preferences updated successfully',
    }
  }

  async getPreferences(): Promise<UpdatePreferencesPayload> {
    // TODO: Replace with REST call (e.g. GET /profile/preferences)
    return storedPreferences
  }
}

export const profileService = new ProfileService()
