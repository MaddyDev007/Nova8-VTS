import type { Geofence } from '../types/geofence'
import { apiClient } from '../api/apiClient'

export type CreateGeofenceInput = {
  name: string
  address: string
  lat: number
  lon: number
  radius: number
  isStop?: boolean
}

export type UpdateGeofenceInput = Partial<CreateGeofenceInput>

export type GeofenceServiceResponse = {
  success: true
  message: string
}

class GeofenceService {
  async getGeofences(): Promise<Geofence[]> {
    return apiClient.get<Geofence[]>('/geofences')
  }

  async createGeofence(
    geofenceData: CreateGeofenceInput,
  ): Promise<{ success: true; message: string; geofence: Geofence }> {
    return apiClient.post<{ success: true; message: string; geofence: Geofence }>('/geofences', geofenceData)
  }

  async updateGeofence(
    geofenceId: string,
    updatedData: UpdateGeofenceInput,
  ): Promise<{ success: true; message: string; geofence: Geofence }> {
    return apiClient.put<{ success: true; message: string; geofence: Geofence }>(
      `/geofences/${geofenceId}`,
      updatedData,
    )
  }

  async deleteGeofence(id: string): Promise<GeofenceServiceResponse> {
    return apiClient.delete<GeofenceServiceResponse>(`/geofences/${id}`)
  }
}

export const geofenceService = new GeofenceService()
