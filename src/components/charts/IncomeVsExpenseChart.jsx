import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function IncomeVsExpenseChart({ data }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.fill }}
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

    if (data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <p>No transaction history available</p>
            </div>
        )
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={4} // Reduce gap between bars
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar
                        dataKey="income"
                        name="Income"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="expense"
                        name="Expense"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default IncomeVsExpenseChart
