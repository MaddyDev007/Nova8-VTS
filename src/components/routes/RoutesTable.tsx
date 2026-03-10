import { useMemo, useState } from 'react'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { RouteMiniMap } from '@components/routes/RouteMiniMap'
import { Pagination } from '@components/ui/Pagination'
import { useNavigate } from 'react-router-dom'
import type { Route } from '../../types/route'

type RoutesTableProps = {
  routes: Route[]
  searchTerm?: string
  onEdit: (route: Route) => void
  onDelete: (route: Route) => void
}

export function RoutesTable({ routes, searchTerm = '', onEdit, onDelete }: RoutesTableProps) {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const filteredRoutes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return routes
    }

    return routes.filter((route) => {
      const matchesRoute = route.name.toLowerCase().includes(query)
      const matchesVehicle = (route.assignedVehicleName ?? 'unassigned').toLowerCase().includes(query)
      return matchesRoute || matchesVehicle
    })
  }, [routes, searchTerm])

  const paginatedRoutes = useMemo(() => {
    const startIndex = (page - 1) * limit
    return filteredRoutes.slice(startIndex, startIndex + limit)
  }, [filteredRoutes, limit, page])

  return (
    <section className='rounded-2xl border border-white/30 bg-white/55 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[1250px] border-collapse text-sm'>
          <thead>
            <tr className='border-b border-slate-200 text-left text-xs uppercase tracking-[0.1em] text-slate-500 dark:border-slate-700 dark:text-slate-400'>
              <th className='px-3 py-2 font-semibold'>Route Name</th>
              <th className='px-3 py-2 font-semibold'>Assigned Vehicle</th>
              <th className='px-3 py-2 font-semibold'>Stops Count</th>
              <th className='px-3 py-2 font-semibold'>Status</th>
              <th className='px-3 py-2 font-semibold'>Map Preview</th>
              <th className='px-3 py-2 text-right font-semibold'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoutes.length ? (
              paginatedRoutes.map((route) => (
                <tr
                  key={route.id}
                  onClick={() => navigate(`/routes/${route.id}`)}
                  className='cursor-pointer border-b border-slate-200/70 transition hover:bg-blue-50/60 dark:border-slate-700/70 dark:hover:bg-slate-800/60'
                >
                  <td className='px-3 py-3 font-medium text-slate-900 dark:text-slate-100'>{route.name}</td>
                  <td className='px-3 py-3 text-slate-700 dark:text-slate-200'>
                    {route.assignedVehicleName ?? 'Unassigned'}
                  </td>
                  <td className='px-3 py-3 text-slate-700 dark:text-slate-200'>{route.stopsCount}</td>
                  <td className='px-3 py-3'>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        route.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {route.status === 'active' ? 'Active' : 'Idle'}
                    </span>
                  </td>
                  <td className='px-3 py-3'>
                    <RouteMiniMap
                      startStop={route.startStop}
                      endStop={route.endStop}
                      intermediateStops={route.intermediateStops}
                    />
                  </td>
                  <td className='px-3 py-3 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        type='button'
                        onClick={(event) => {
                          event.stopPropagation()
                          onEdit(route)
                        }}
                        className='inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-600 dark:text-slate-100 dark:hover:border-[#38bdf8] dark:hover:text-[#38bdf8]'
                      >
                        <FiEdit size={14} />
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={(event) => {
                          event.stopPropagation()
                          onDelete(route)
                        }}
                        className='inline-flex items-center gap-1 rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:border-rose-500 hover:text-rose-600 dark:border-rose-500/60 dark:text-rose-300 dark:hover:border-rose-400 dark:hover:text-rose-200'
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='px-3 py-6 text-center text-sm text-slate-600 dark:text-slate-300'>
                  No routes match the current search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        total={filteredRoutes.length}
        onPageChange={setPage}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit)
          setPage(1)
        }}
      />
    </section>
  )
}
