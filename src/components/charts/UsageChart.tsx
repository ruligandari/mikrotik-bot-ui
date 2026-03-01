import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

interface UsageChartProps {
    data: { username: string; usage_gb: number }[]
}

export default function UsageChart({ data }: UsageChartProps) {
    return (
        <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis
                        dataKey="username"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        tickFormatter={(value) => `${value}GB`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 8 }}
                        contentStyle={{
                            backgroundColor: '#121216',
                            border: '1px solid #27272a',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Bar
                        dataKey="usage_gb"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill="url(#barGradient)"
                                className="hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
