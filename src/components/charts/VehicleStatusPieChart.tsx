import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTheme } from '@hooks/useTheme'

type VehicleStatusPieDatum = {
  name: 'moving' | 'idling' | 'stopped' | 'offline'
  value: number
}

type VehicleStatusPieChartProps = {
  data?: VehicleStatusPieDatum[]
}

const defaultData: VehicleStatusPieDatum[] = [
  { name: 'moving', value: 64 },
  { name: 'idling', value: 22 },
  { name: 'stopped', value: 18 },
  { name: 'offline', value: 35 },
]

const statusColors: Record<VehicleStatusPieDatum['name'], string> = {
  moving: '#22c55e',
  idling: '#eab308',
  stopped: '#ef4444',
  offline: '#94a3b8',
}

export function VehicleStatusPieChart({ data = defaultData }: VehicleStatusPieChartProps) {
  const { isDark } = useTheme()
  const axisColor = isDark ? '#cbd5e1' : '#334155'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1'

  return (
    <article className='rounded-2xl border border-white/30 bg-white/55 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#1e293b]/70 dark:shadow-black/20'>
      <header className='mb-3'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>Vehicle Status</h3>
      </header>

      <div className='h-[300px] w-full min-w-0'>
        <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={statusColors[entry.name]} />
              ))}
            </Pie>
            <Legend formatter={(value) => <span style={{ color: axisColor }}>{value}</span>} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: 10,
                color: axisColor,
              }}
              formatter={(value) => [`${value ?? 0}`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
