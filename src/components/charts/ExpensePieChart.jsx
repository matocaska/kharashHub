import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useBudget } from '../../context/BudgetContext'

function ExpensePieChart({ data }) {
    const { categories } = useBudget()
    // Process data for the chart
    const chartData = data
        .filter(item => item.value > 0)
        .map(item => ({
            ...item,
            color: categories[item.name]?.color || '#cbd5e1'
        }))
        .sort((a, b) => b.value - a.value)

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white capitalize">{data.name}</p>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                        ${data.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {((data.value / data.total) * 100).toFixed(1)}% of total
                    </p>
                </div>
            )
        }
        return null
    }

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <p>No expense data to display</p>
            </div>
        )
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ExpensePieChart
