import React from 'react'
import { useBudget } from '../context/BudgetContext'
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Trash2, Edit2 } from 'lucide-react'

function TransactionList({ transactions, title = "Recent Transactions", limit = 5 }) {
    const { categories } = useBudget()
    const displayTransactions = transactions.slice(0, limit)

    if (transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MoreHorizontal className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No transactions yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Start by adding your first income or expense.</p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View All
                </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {displayTransactions.map((transaction) => {
                    const category = categories[transaction.category] || { icon: 'HelpCircle', color: '#cbd5e1' } // Fallback
                    // Dynamic Icon component
                    const IconComponent = category.icon // This would be a string name in a real app, mapping needed or use string if using library that supports it

                    return (
                        <div key={transaction.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center gap-4 group">
                            {/* Icon */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                                {/* Fallback layout for icon - in real app would map string to component */}
                                <div className="font-bold text-xs">{transaction.category.substring(0, 2).toUpperCase()}</div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 dark:text-white truncate">
                                    {transaction.note || transaction.category}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                            </div>

                            {/* Actions (hover only) */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-light/10 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TransactionList
