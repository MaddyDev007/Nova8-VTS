import type { Route, RouteStop } from '../types/route'
import { apiClient } from '../api/apiClient'

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
    return apiClient.get<Route[]>('/routes')
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    return apiClient.get<Route>(`/routes/${routeId}`)
  }

  async createRoute(routeData: CreateRouteInput): Promise<CreateRouteResponse> {
    return apiClient.post<CreateRouteResponse>('/routes', routeData)
  }

  async updateRoute(routeId: string, updatedData: UpdateRouteInput): Promise<UpdateRouteResponse> {
    return apiClient.patch<UpdateRouteResponse>(`/routes/${routeId}`, updatedData)
  }

  async deleteRoute(routeId: string): Promise<DeleteRouteResponse> {
    return apiClient.delete<DeleteRouteResponse>(`/routes/${routeId}`)
  }
}

export const routeService = new RouteService()
