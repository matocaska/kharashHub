import React, { useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useBudget } from '../context/BudgetContext'
import { TrendingUp, AlertCircle, Award, Target } from 'lucide-react'

function FinancialInsights() {
    const { getTotalIncome, getTotalExpenses, getCategoryTotals } = useTransactions()
    const { monthlyBudget } = useBudget()

    const income = getTotalIncome()
    const expenses = getTotalExpenses()

    const insights = useMemo(() => {
        // 1. Calculate Health Score (0-100)
        let score = 0
        let healthStatus = 'Needs Attention'
        let healthColor = 'text-danger'

        if (income > 0) {
            const savingsRate = ((income - expenses) / income) * 100
            const budgetAdherence = Math.max(0, ((monthlyBudget - expenses) / monthlyBudget) * 100)

            // Simple algorithm: 60% weight on savings rate, 40% on budget adherence
            // Capped at 100
            score = Math.min(100, Math.max(0, (savingsRate * 1.2) + (budgetAdherence * 0.4)))

            if (score >= 80) {
                healthStatus = 'Excellent'
                healthColor = 'text-emerald-600 dark:text-emerald-400'
            } else if (score >= 50) {
                healthStatus = 'Good'
                healthColor = 'text-primary-600 dark:text-primary-400'
            } else if (score >= 30) {
                healthStatus = 'Fair'
                healthColor = 'text-warning'
            }
        }

        // 2. Identify Top Expense Category
        const categoryTotals = getCategoryTotals('expense')
        let topCategory = { name: 'None', amount: 0 }
        Object.entries(categoryTotals).forEach(([name, amount]) => {
            if (amount > topCategory.amount) {
                topCategory = { name, amount }
            }
        })

        // 3. Projected Savings (Simple linear projection if mid-month, but for now just raw savings)
        const currentSavings = income - expenses

        return {
            score: Math.round(score),
            healthStatus,
            healthColor,
            topCategory,
            currentSavings,
            savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0
        }
    }, [income, expenses, monthlyBudget, getCategoryTotals])

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                AI Financial Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">

                {/* Health Score */}
                <div className="flex flex-col items-center justify-center text-center p-2">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-100 dark:text-slate-700"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * insights.score) / 100}
                                className={`${insights.healthColor} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className={`absolute text-2xl font-bold ${insights.healthColor}`}>
                            {insights.score}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Financial Health Score</p>
                    <p className={`text-sm font-bold mt-1 ${insights.healthColor}`}>{insights.healthStatus}</p>
                </div>

                {/* Top Spending */}
                <div className="flex flex-col items-center justify-center text-center p-2 pt-6 md:pt-2">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Top Expense Category</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {insights.topCategory.name}
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        ${insights.topCategory.amount.toLocaleString()} spent
                    </p>
                    <p className="text-xs text-slate-400 mt-2 max-w-[150px]">
                        Try reducing spend here to boost your score.
                    </p>
                </div>

                {/* Savings Goal */}
                <div className="flex flex-col items-center justify-center text-center p-2 pt-6 md:pt-2">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                        <Target className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Savings Rate</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {insights.savingsRate}%
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        ${Math.max(0, insights.currentSavings).toLocaleString()} saved
                    </p>
                    <p className="text-xs text-slate-400 mt-2 max-w-[150px]">
                        {insights.savingsRate > 20 ? 'Great job! You\'re building wealth.' : 'Aim for at least 20% savings.'}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default FinancialInsights
