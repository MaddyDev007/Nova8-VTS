export type GeocodingResult = {
  address: string
}

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'
const REQUEST_INTERVAL_MS = 1100
const CACHE_PRECISION = 5

const resultCache = new Map<string, GeocodingResult>()
const inFlightRequests = new Map<string, Promise<GeocodingResult>>()

let requestQueue: Promise<void> = Promise.resolve()
let lastRequestAt = 0

function normalizeCoordinate(value: number): string {
  return value.toFixed(CACHE_PRECISION)
}

function makeCacheKey(lat: number, lon: number): string {
  return `${normalizeCoordinate(lat)},${normalizeCoordinate(lon)}`
}

function fallbackAddress(lat: number, lon: number): GeocodingResult {
  void lat
  void lon
  return {
    address: 'Address unavailable',
  }
}

async function throttleRequests(): Promise<void> {
  requestQueue = requestQueue.then(async () => {
    const elapsed = Date.now() - lastRequestAt
    const waitMs = Math.max(0, REQUEST_INTERVAL_MS - elapsed)

    if (waitMs > 0) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, waitMs)
      })
    }

    lastRequestAt = Date.now()
  })

  return requestQueue
}

async function fetchAddress(lat: number, lon: number): Promise<GeocodingResult> {
  await throttleRequests()

  const url = new URL(NOMINATIM_REVERSE_URL)
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))
  url.searchParams.set('format', 'json')

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return fallbackAddress(lat, lon)
    }

    const data = (await response.json()) as { display_name?: unknown }
    const resolvedAddress =
      typeof data.display_name === 'string' && data.display_name.trim().length > 0
        ? data.display_name
        : fallbackAddress(lat, lon).address

    return { address: resolvedAddress }
  } catch {
    return fallbackAddress(lat, lon)
  }
}

export async function getAddressFromCoordinates(lat: number, lon: number): Promise<GeocodingResult> {
  const key = makeCacheKey(lat, lon)

  const cachedResult = resultCache.get(key)
  if (cachedResult) {
    return cachedResult
  }

  const activeRequest = inFlightRequests.get(key)
  if (activeRequest) {
    return activeRequest
  }

  const request = fetchAddress(lat, lon)
    .then((result) => {
      resultCache.set(key, result)
      inFlightRequests.delete(key)
      return result
    })
    .catch(() => {
      const fallback = fallbackAddress(lat, lon)
      resultCache.set(key, fallback)
      inFlightRequests.delete(key)
      return fallback
    })

  inFlightRequests.set(key, request)

  return request
}
