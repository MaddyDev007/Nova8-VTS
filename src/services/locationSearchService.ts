import type { GeofenceSearchResult } from '../types/geofence'

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search'
const RESULT_LIMIT = 5
const DEBOUNCE_MS = 350

let debounceTimer: number | undefined
let pendingResolve: ((results: GeofenceSearchResult[]) => void) | null = null
let activeController: AbortController | null = null

function normalizeQuery(query: string): string {
  return query.trim()
}

async function fetchLocations(query: string): Promise<GeofenceSearchResult[]> {
  const url = new URL(NOMINATIM_SEARCH_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', String(RESULT_LIMIT))

  try {
    activeController = new AbortController()

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: activeController.signal,
    })

    if (!response.ok) {
      return []
    }

    const rawData = (await response.json()) as Array<{
      display_name?: unknown
      lat?: unknown
      lon?: unknown
    }>

    return rawData
      .map((item) => ({
        displayName: typeof item.display_name === 'string' ? item.display_name : 'Unknown location',
        lat: Number(item.lat),
        lon: Number(item.lon),
      }))
      .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lon))
      .slice(0, RESULT_LIMIT)
  } catch {
    return []
  } finally {
    activeController = null
  }
}

export function searchLocation(query: string): Promise<GeofenceSearchResult[]> {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return Promise.resolve([])
  }

  if (debounceTimer) {
    window.clearTimeout(debounceTimer)
  }

  if (pendingResolve) {
    pendingResolve([])
    pendingResolve = null
  }

  if (activeController) {
    activeController.abort()
    activeController = null
  }

  return new Promise<GeofenceSearchResult[]>((resolve) => {
    pendingResolve = resolve

    debounceTimer = window.setTimeout(async () => {
      pendingResolve = null

      // TODO: Replace with backend endpoint (e.g. GET /locations/search?q=...)
      const results = await fetchLocations(normalizedQuery)
      resolve(results)
    }, DEBOUNCE_MS)
  })
}
