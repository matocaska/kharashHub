import React, { useState, useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useBudget } from '../context/BudgetContext'
import TransactionModal from '../components/TransactionModal'
import {
    Plus,
    Search,
    Filter,
    Download,
    Trash2,
    Edit2,
    ChevronLeft,
    ChevronRight,
    MoreVertical
} from 'lucide-react'

function Transactions() {
    const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
    const { categories } = useBudget()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)

    // Filters state
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all') // all, income, expense
    const [categoryFilter, setCategoryFilter] = useState('all')

    // Pagination (simple client-side)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const handleSave = (data) => {
        if (editingTransaction) {
            updateTransaction(editingTransaction.id, data)
        } else {
            addTransaction(data)
        }
        setEditingTransaction(null)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id)
        }
    }

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setEditingTransaction(null)
        setIsModalOpen(true)
    }

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.amount.toString().includes(searchTerm)
                const matchesType = typeFilter === 'all' || t.type === typeFilter
                const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter

                return matchesSearch && matchesType && matchesCategory
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
    }, [transactions, searchTerm, typeFilter, categoryFilter])

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Transactions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your income and expenses
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-slate-200"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none"
                    >
                        <option value="all">All Categories</option>
                        {Object.keys(categories).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Note</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((transaction) => {
                                    const category = categories[transaction.category] || { icon: 'HelpCircle', color: '#cbd5e1' } // Fallback
                                    return (
                                        <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                                    >
                                                        {transaction.category.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {transaction.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                                {transaction.note || '-'}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-semibold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(transaction)}
                                                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-light/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                                <Search className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p>No transactions found</p>
                                            {transactions.length === 0 && (
                                                <button
                                                    onClick={handleAdd}
                                                    className="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                                                >
                                                    Create your first transaction
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingTransaction(null)
                }}
                onSave={handleSave}
                initialData={editingTransaction}
            />
        </div>
    )
}

export default Transactions
