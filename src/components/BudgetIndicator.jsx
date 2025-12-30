import React from 'react'

function BudgetIndicator({ spent, total, label }) {
    const percentage = Math.min((spent / total) * 100, 100)
    const remaining = total - spent

    let colorClass = 'bg-primary-500'
    if (percentage >= 100) colorClass = 'bg-danger'
    else if (percentage >= 80) colorClass = 'bg-warning'

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Monthly Budget</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {remaining >= 0 ? 'Remaining' : 'Over budget'}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${Math.max(0, remaining).toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500 ml-1">
                        / ${total.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
        </div>
    )
}

export default BudgetIndicator
