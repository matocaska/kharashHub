import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

function StatCard({ title, value, type = 'neutral', icon: Icon, trend }) {
    const getColors = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-white dark:bg-slate-800',
                    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                    trendColor: 'text-emerald-600 dark:text-emerald-400'
                }
            case 'danger':
                return {
                    bg: 'bg-white dark:bg-slate-800',
                    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
                    iconColor: 'text-rose-600 dark:text-rose-400',
                    trendColor: 'text-rose-600 dark:text-rose-400'
                }
            case 'warning':
                return {
                    bg: 'bg-white dark:bg-slate-800',
                    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    trendColor: 'text-amber-600 dark:text-amber-400'
                }
            case 'primary':
                return {
                    bg: 'bg-primary-600 dark:bg-primary-700',
                    iconBg: 'bg-white/20',
                    iconColor: 'text-white',
                    textColor: 'text-white',
                    subTextColor: 'text-primary-100',
                    trendColor: 'text-white'
                }
            default:
                return {
                    bg: 'bg-white dark:bg-slate-800',
                    iconBg: 'bg-slate-100 dark:bg-slate-700/50',
                    iconColor: 'text-slate-600 dark:text-slate-400',
                    trendColor: 'text-slate-600 dark:text-slate-400'
                }
        }
    }

    const colors = getColors()
    const isPrimary = type === 'primary'

    return (
        <div className={`p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:shadow-card-hover ${colors.bg}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium mb-1 ${isPrimary ? colors.subTextColor : 'text-slate-500 dark:text-slate-400'}`}>
                        {title}
                    </p>
                    <h3 className={`text-2xl font-bold ${isPrimary ? colors.textColor : 'text-slate-900 dark:text-white'}`}>
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.iconColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="flex items-center mt-4">
                    <span className={`flex items-center text-sm font-medium ${colors.trendColor}`}>
                        {trend > 0 ? (
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : trend < 0 ? (
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                        ) : (
                            <Minus className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(trend)}%
                    </span>
                    <span className={`text-xs ml-2 ${isPrimary ? colors.subTextColor : 'text-slate-400 dark:text-slate-500'}`}>
                        vs last month
                    </span>
                </div>
            )}
        </div>
    )
}

export default StatCard
