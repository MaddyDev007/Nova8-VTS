import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { Sidebar } from '@components/navigation/Sidebar'
import { Topbar } from '@components/navigation/Topbar'
import { useNotificationListener } from '@hooks/useNotificationListener'

export function DashboardLayout({ children }: PropsWithChildren) {
  useNotificationListener()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div
      className={`grid h-screen grid-rows-[64px_1fr] overflow-hidden bg-gray-50 text-slate-900 dark:bg-[#0f172a] dark:text-slate-100 ${
        isSidebarCollapsed ? 'grid-cols-[80px_1fr]' : 'grid-cols-[260px_1fr]'
      }`}
    >
      <div className='row-span-2'>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      <Topbar />

      <main className='overflow-y-auto p-5'>{children}</main>
    </div>
  )
}
