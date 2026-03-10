import type { Geofence } from '../types/geofence'

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

let mockGeofences: Geofence[] = [
  {
    id: 'geo-1',
    name: 'Central Depot',
    address: 'Connaught Place, New Delhi',
    lat: 28.6315,
    lon: 77.2167,
    radius: 250,
    isStop: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'geo-2',
    name: 'School Zone',
    address: 'Lajpat Nagar, New Delhi',
    lat: 28.5677,
    lon: 77.2431,
    radius: 300,
    isStop: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'geo-3',
    name: 'Fuel Station',
    address: 'Karol Bagh, New Delhi',
    lat: 28.6519,
    lon: 77.1909,
    radius: 180,
    isStop: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
]

class GeofenceService {
  async getGeofences(): Promise<Geofence[]> {
    // TODO: Replace with REST call (e.g. GET /geofences)
    return mockGeofences
  }

  async createGeofence(
    geofenceData: CreateGeofenceInput,
  ): Promise<{ success: true; message: string; geofence: Geofence }> {
    // TODO: Replace with REST call (e.g. POST /geofences)
    const now = new Date().toISOString()
    const nextGeofence: Geofence = {
      id: `geo-${Date.now()}`,
      ...geofenceData,
      isStop: geofenceData.isStop ?? false,
      createdAt: now,
      updatedAt: now,
    }

    mockGeofences = [nextGeofence, ...mockGeofences]

    return {
      success: true,
      message: 'Geofence created successfully',
      geofence: nextGeofence,
    }
  }

  async updateGeofence(
    geofenceId: string,
    updatedData: UpdateGeofenceInput,
  ): Promise<{ success: true; message: string; geofence: Geofence }> {
    // TODO: Replace with REST call (e.g. PUT /geofences/:id)
    const geofenceIndex = mockGeofences.findIndex((geofence) => geofence.id === geofenceId)

    if (geofenceIndex < 0) {
      throw new Error('Geofence not found')
    }

    const current = mockGeofences[geofenceIndex]
    const next: Geofence = {
      ...current,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    }

    mockGeofences = [
      ...mockGeofences.slice(0, geofenceIndex),
      next,
      ...mockGeofences.slice(geofenceIndex + 1),
    ]

    return {
      success: true,
      message: 'Geofence updated successfully',
      geofence: next,
    }
  }

  async deleteGeofence(id: string): Promise<GeofenceServiceResponse> {
    // TODO: Replace with REST call (e.g. DELETE /geofences/:id)
    const exists = mockGeofences.some((geofence) => geofence.id === id)

    if (!exists) {
      throw new Error('Geofence not found')
    }

    mockGeofences = mockGeofences.filter((geofence) => geofence.id !== id)

    return {
      success: true,
      message: 'Geofence deleted successfully',
    }
  }
}

export const geofenceService = new GeofenceService()
