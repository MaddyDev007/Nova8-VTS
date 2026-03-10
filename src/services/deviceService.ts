import type { Device } from '../types/device'

export type CreateDeviceInput = {
  deviceId: string
  imei: string
  assignedVehicleId?: string
  assignedVehicleName?: string
}

export type UpdateDeviceInput = Partial<CreateDeviceInput>

export type DeviceServiceResponse = {
  success: true
  message: string
}

let mockDevices: Device[] = [
  {
    id: 'dev-rec-001',
    deviceId: 'VTU_001',
    imei: '867451234567890',
    assignedVehicleId: 'veh-1',
    assignedVehicleName: 'VTS Vehicle 1',
    status: 'assigned',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'dev-rec-002',
    deviceId: 'VTU_002',
    imei: '867451234567891',
    assignedVehicleId: 'veh-2',
    assignedVehicleName: 'VTS Vehicle 2',
    status: 'assigned',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'dev-rec-003',
    deviceId: 'VTU_003',
    imei: '867451234567892',
    assignedVehicleId: undefined,
    assignedVehicleName: undefined,
    status: 'unassigned',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'dev-rec-004',
    deviceId: 'VTU_004',
    imei: '867451234567893',
    assignedVehicleId: undefined,
    assignedVehicleName: undefined,
    status: 'unassigned',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
]

function normalizeStatus(device: Omit<Device, 'status'> & { status?: Device['status'] }): Device {
  const isAssigned = Boolean(device.assignedVehicleName)

  return {
    ...device,
    status: isAssigned ? 'assigned' : 'unassigned',
  }
}

class DeviceService {
  private getDeviceIndexByUid(deviceUid: string): number {
    return mockDevices.findIndex((device) => device.deviceId === deviceUid)
  }

  async getDevices(): Promise<Device[]> {
    // TODO: Replace with REST call (e.g. GET /devices)
    return mockDevices.map((device) => normalizeStatus(device))
  }

  async createDevice(deviceData: CreateDeviceInput): Promise<{ success: true; message: string; device: Device }> {
    // TODO: Replace with REST call (e.g. POST /devices)
    const now = new Date().toISOString()
    const nextDevice = normalizeStatus({
      id: `dev-rec-${Date.now()}`,
      deviceId: deviceData.deviceId,
      imei: deviceData.imei,
      assignedVehicleId: deviceData.assignedVehicleId,
      assignedVehicleName: deviceData.assignedVehicleName,
      createdAt: now,
      updatedAt: now,
    })

    mockDevices = [nextDevice, ...mockDevices]

    return {
      success: true,
      message: 'Device created successfully',
      device: nextDevice,
    }
  }

  async updateDevice(
    deviceRecordId: string,
    updatedData: UpdateDeviceInput,
  ): Promise<{ success: true; message: string; device: Device }> {
    // TODO: Replace with REST call (e.g. PUT /devices/:id)
    const deviceIndex = mockDevices.findIndex((device) => device.id === deviceRecordId)

    if (deviceIndex < 0) {
      throw new Error('Device not found')
    }

    const current = mockDevices[deviceIndex]
    const next = normalizeStatus({
      ...current,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    })

    mockDevices = [
      ...mockDevices.slice(0, deviceIndex),
      next,
      ...mockDevices.slice(deviceIndex + 1),
    ]

    return {
      success: true,
      message: 'Device updated successfully',
      device: next,
    }
  }

  async deleteDevice(deviceRecordId: string): Promise<DeviceServiceResponse> {
    // TODO: Replace with REST call (e.g. DELETE /devices/:id)
    const targetDevice = mockDevices.find((device) => device.id === deviceRecordId)

    if (!targetDevice) {
      throw new Error('Device not found')
    }

    const normalizedDevice = normalizeStatus(targetDevice)
    if (normalizedDevice.status === 'assigned') {
      throw new Error('Device is assigned to a vehicle and cannot be deleted.')
    }

    mockDevices = mockDevices.filter((device) => device.id !== deviceRecordId)

    return {
      success: true,
      message: 'Device deleted successfully',
    }
  }

  async getUnassignedDevices(): Promise<Device[]> {
    // TODO: Replace with REST call (e.g. GET /devices?status=unassigned)
    return mockDevices
      .map((device) => normalizeStatus(device))
      .filter((device) => device.status === 'unassigned')
  }

  async getDeviceByUid(deviceUid: string): Promise<Device | null> {
    // TODO: Replace with REST call (e.g. GET /devices/by-uid/:deviceUid)
    const device = mockDevices.find((item) => item.deviceId === deviceUid)
    return device ? normalizeStatus(device) : null
  }

  async assignDeviceToVehicle(deviceUid: string, vehicleId: string, vehicleName: string): Promise<void> {
    // TODO: Replace with REST call (e.g. POST /devices/:deviceUid/assign)
    const deviceIndex = this.getDeviceIndexByUid(deviceUid)
    if (deviceIndex < 0) {
      throw new Error('Selected device does not exist')
    }

    const current = normalizeStatus(mockDevices[deviceIndex])
    if (current.status === 'assigned' && current.assignedVehicleId !== vehicleId) {
      throw new Error('Selected device is already assigned to another vehicle')
    }

    mockDevices = [
      ...mockDevices.slice(0, deviceIndex),
      normalizeStatus({
        ...current,
        assignedVehicleId: vehicleId,
        assignedVehicleName: vehicleName,
        updatedAt: new Date().toISOString(),
      }),
      ...mockDevices.slice(deviceIndex + 1),
    ]
  }

  async unassignDeviceFromVehicle(deviceUid: string): Promise<void> {
    // TODO: Replace with REST call (e.g. POST /devices/:deviceUid/unassign)
    const deviceIndex = this.getDeviceIndexByUid(deviceUid)
    if (deviceIndex < 0) {
      return
    }

    const current = normalizeStatus(mockDevices[deviceIndex])
    mockDevices = [
      ...mockDevices.slice(0, deviceIndex),
      normalizeStatus({
        ...current,
        assignedVehicleId: undefined,
        assignedVehicleName: undefined,
        updatedAt: new Date().toISOString(),
      }),
      ...mockDevices.slice(deviceIndex + 1),
    ]
  }
}

export const deviceService = new DeviceService()
