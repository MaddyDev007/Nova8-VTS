import type { Route, RouteStop } from '../types/route'

const STOP_POOL: RouteStop[] = [
  { id: 'stp-1', name: 'Central Depot', lat: 28.6315, lon: 77.2167 },
  { id: 'stp-2', name: 'School Zone', lat: 28.5677, lon: 77.2431 },
  { id: 'stp-3', name: 'Karol Bagh Stop', lat: 28.6519, lon: 77.1909 },
  { id: 'stp-4', name: 'Dwarka Terminal', lat: 28.5921, lon: 77.046 },
  { id: 'stp-5', name: 'Noida Hub', lat: 28.5355, lon: 77.391 },
  { id: 'stp-6', name: 'Gurgaon Crossing', lat: 28.4595, lon: 77.0266 },
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateMockRoutes(): Route[] {
  return Array.from({ length: 12 }, (_, index) => {
    const start = STOP_POOL[index % STOP_POOL.length]
    const end = STOP_POOL[(index + 2) % STOP_POOL.length]
    const intermediateCount = (index % 3) + 1
    const intermediateStops = Array.from({ length: intermediateCount }, (_, innerIndex) => {
      return STOP_POOL[(index + innerIndex + 1) % STOP_POOL.length]
    }).filter((stop) => stop.id !== start.id && stop.id !== end.id)

    const assignedVehicleId = index % 2 === 0 ? `veh-${(index % 8) + 1}` : undefined
    const assignedVehicleName = assignedVehicleId ? `VTS Vehicle ${(index % 8) + 1}` : undefined

    return {
      id: `route-${String(index + 1).padStart(3, '0')}`,
      name: `Route ${String.fromCharCode(65 + (index % 26))}-${index + 1}`,
      startStop: start,
      endStop: end,
      intermediateStops,
      assignedVehicleId,
      assignedVehicleName,
      stopsCount: 2 + intermediateStops.length,
      status: assignedVehicleId ? 'active' : 'idle',
      createdAt: new Date(Date.now() - randomInt(1, 20) * 24 * 60 * 60 * 1000).toISOString(),
    }
  })
}

let mockRoutes: Route[] = generateMockRoutes()

export type DeleteRouteResponse = {
  success: true
  message: string
}

export type UpdateRouteInput = {
  name?: string
  startStop?: RouteStop
  endStop?: RouteStop
  intermediateStops?: RouteStop[]
  assignedVehicleId?: string
  assignedVehicleName?: string
}

export type UpdateRouteResponse = {
  success: true
  message: string
  route: Route
}

export type CreateRouteInput = {
  name: string
  startStop: RouteStop
  endStop: RouteStop
  intermediateStops: RouteStop[]
  assignedVehicleId?: string
  assignedVehicleName?: string
}

export type CreateRouteResponse = {
  success: true
  message: string
  route: Route
}

class RouteService {
  async getRoutes(): Promise<Route[]> {
    // TODO: Replace with REST call (e.g. GET /routes)
    return mockRoutes
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    // TODO: Replace with REST call (e.g. GET /routes/:routeId)
    return mockRoutes.find((route) => route.id === routeId) ?? null
  }

  async createRoute(routeData: CreateRouteInput): Promise<CreateRouteResponse> {
    // TODO: Replace with REST call (e.g. POST /routes)
    const nextRoute: Route = {
      id: `route-${Date.now()}`,
      name: routeData.name,
      startStop: routeData.startStop,
      endStop: routeData.endStop,
      intermediateStops: routeData.intermediateStops,
      assignedVehicleId: routeData.assignedVehicleId,
      assignedVehicleName: routeData.assignedVehicleName,
      stopsCount: 2 + routeData.intermediateStops.length,
      status: routeData.assignedVehicleId ? 'active' : 'idle',
      createdAt: new Date().toISOString(),
    }

    mockRoutes = [nextRoute, ...mockRoutes]

    return {
      success: true,
      message: 'Route created successfully',
      route: nextRoute,
    }
  }

  async updateRoute(routeId: string, updatedData: UpdateRouteInput): Promise<UpdateRouteResponse> {
    // TODO: Replace with REST call (e.g. PATCH /routes/:id)
    const routeIndex = mockRoutes.findIndex((route) => route.id === routeId)

    if (routeIndex < 0) {
      throw new Error('Route not found')
    }

    const current = mockRoutes[routeIndex]
    const next: Route = {
      ...current,
      ...updatedData,
      assignedVehicleId:
        updatedData.assignedVehicleId !== undefined ? updatedData.assignedVehicleId : current.assignedVehicleId,
      assignedVehicleName:
        updatedData.assignedVehicleName !== undefined
          ? updatedData.assignedVehicleName
          : current.assignedVehicleName,
      intermediateStops:
        updatedData.intermediateStops !== undefined ? updatedData.intermediateStops : current.intermediateStops,
      startStop: updatedData.startStop ?? current.startStop,
      endStop: updatedData.endStop ?? current.endStop,
      stopsCount:
        (updatedData.startStop ?? current.startStop ? 1 : 0) +
        (updatedData.endStop ?? current.endStop ? 1 : 0) +
        (updatedData.intermediateStops ?? current.intermediateStops).length,
      status:
        (updatedData.assignedVehicleId !== undefined
          ? updatedData.assignedVehicleId
          : current.assignedVehicleId)
          ? 'active'
          : 'idle',
    }

    mockRoutes = [...mockRoutes.slice(0, routeIndex), next, ...mockRoutes.slice(routeIndex + 1)]

    return {
      success: true,
      message: 'Route updated successfully',
      route: next,
    }
  }

  async deleteRoute(routeId: string): Promise<DeleteRouteResponse> {
    // TODO: Replace with REST call (e.g. DELETE /routes/:id)
    const exists = mockRoutes.some((item) => item.id === routeId)
    if (!exists) {
      throw new Error('Route not found')
    }

    mockRoutes = mockRoutes.filter((item) => item.id !== routeId)

    return {
      success: true,
      message: 'Route deleted successfully',
    }
  }
}

export const routeService = new RouteService()
