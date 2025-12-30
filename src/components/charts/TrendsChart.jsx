import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'

function TrendsChart({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.stroke }}
                            />
                            <span className="text-slate-500 dark:text-slate-400 capitalize">
                                {entry.name}:
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                ${entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    if (data.length <= 1) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <p>Add more transactions to see trends</p>
            </div>
        )
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                        minTickGap={30}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                    {/* Optional: Add dotted lines for income/expense if needed, but balance is cleaner for "Trends" */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TrendsChart
