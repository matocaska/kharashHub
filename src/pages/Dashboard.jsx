import React, { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../context/TransactionContext'
import { useBudget } from '../context/BudgetContext'
import StatCard from '../components/StatCard'
import BudgetIndicator from '../components/BudgetIndicator'
import TransactionList from '../components/TransactionList'
import TransactionModal from '../components/TransactionModal'
import ExpensePieChart from '../components/charts/ExpensePieChart'
import IncomeVsExpenseChart from '../components/charts/IncomeVsExpenseChart'
import TrendsChart from '../components/charts/TrendsChart'
import FinancialInsights from '../components/FinancialInsights'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, PieChart as PieIcon, BarChart3, LineChart } from 'lucide-react'

function Dashboard() {
    const { user } = useAuth()
    const {
        transactions,
        addTransaction,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getCategoryTotals
    } = useTransactions()
    const { monthlyBudget, getBudgetUsagePercentage } = useBudget()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeChart, setActiveChart] = useState('trends') // trends, distribution, comparison

    const income = getTotalIncome()
    const expenses = getTotalExpenses()
    const balance = getBalance()
    const budgetUsage = getBudgetUsagePercentage(expenses)

    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
        // Pie Chart Data: Expense Distribution
        const categoryTotals = getCategoryTotals('expense')
        const distributionData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

        // Bar Chart Data: Income vs Expense (Last 6 months simulated for now, normally would be grouped by month)
        const comparisonData = [
            { name: 'Income', income: income, expense: 0 },
            { name: 'Expense', income: 0, expense: expenses }
        ] // In a real app, this would be an array of months

        // Line Chart Data: Trends (Daily Balance)
        // Sort transactions by date ascending
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
        let runningBalance = 0
        const trendsData = sortedTx.map(t => {
            const amount = t.type === 'income' ? t.amount : -t.amount
            runningBalance += amount
            return {
                date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                balance: runningBalance
            }
        })

        return { distributionData, comparisonData, trendsData }
    }, [transactions, getCategoryTotals, income, expenses])

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Overview of your financial health
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Balance"
                    value={`$${balance.toLocaleString()}`}
                    icon={Wallet}
                    type="primary"
                    trend={12}
                />
                <StatCard
                    title="Monthly Income"
                    value={`$${income.toLocaleString()}`}
                    icon={TrendingUp}
                    type="success"
                    trend={8}
                />
                <StatCard
                    title="Monthly Expenses"
                    value={`$${expenses.toLocaleString()}`}
                    icon={TrendingDown}
                    type="danger"
                    trend={-5}
                />
                <StatCard
                    title="Savings Goal"
                    value="$2,400"
                    icon={PiggyBank}
                    type="warning"
                    trend={null}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Charts, Budget, Insights) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Chart Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white">Financial Insights</h3>

                            {/* Chart Tabs */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                <button
                                    onClick={() => setActiveChart('trends')}
                                    className={`p-2 rounded-md transition-all ${activeChart === 'trends' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    title="Balance Trends"
                                >
                                    <LineChart className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setActiveChart('distribution')}
                                    className={`p-2 rounded-md transition-all ${activeChart === 'distribution' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    title="Expense Breakdown"
                                >
                                    <PieIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setActiveChart('comparison')}
                                    className={`p-2 rounded-md transition-all ${activeChart === 'comparison' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    title="Income vs Expense"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chart Render Area */}
                        <div className="h-64 animate-in fade-in duration-300 flex items-center justify-center">
                            {activeChart === 'trends' && <TrendsChart data={chartData.trendsData} />}
                            {activeChart === 'distribution' && <ExpensePieChart data={chartData.distributionData} />}
                            {activeChart === 'comparison' && <IncomeVsExpenseChart data={chartData.comparisonData} />}
                        </div>
                    </div>

                    {/* New Unit: Smart Insights */}
                    <FinancialInsights />

                    <BudgetIndicator
                        spent={expenses}
                        total={monthlyBudget || 2000}
                        label="Monthly Budget"
                    />
                </div>

                {/* Right Column (Transactions) */}
                <div className="lg:col-span-1">
                    <TransactionList transactions={transactions} limit={6} />
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={addTransaction}
            />
        </div>
    )
}

export default Dashboard
