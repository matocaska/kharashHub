import React, { useState, useEffect } from 'react'
import { X, Calendar, DollarSign, FileText, Check } from 'lucide-react'
import { TRANSACTION_TYPES } from '../utils/constants'
import { useBudget } from '../context/BudgetContext'
import Input from './Input'

function TransactionModal({ isOpen, onClose, onSave, initialData = null }) {
    const { categories } = useBudget()
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: '',
        type: TRANSACTION_TYPES.EXPENSE
    })
    const [error, setError] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                amount: Math.abs(initialData.amount)
            })
        } else {
            setFormData({
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                note: '',
                type: TRANSACTION_TYPES.EXPENSE
            })
        }
    }, [initialData, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
            setError('Please enter a valid amount')
            return
        }

        onSave({
            ...formData,
            amount: Number(formData.amount)
        })
        onClose()
    }

    const handleTypeChange = (type) => {
        setFormData(prev => ({ ...prev, type }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Type Selector */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <button
                            type="button"
                            onClick={() => handleTypeChange(TRANSACTION_TYPES.EXPENSE)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${formData.type === TRANSACTION_TYPES.EXPENSE
                                ? 'bg-white dark:bg-slate-600 text-danger shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange(TRANSACTION_TYPES.INCOME)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${formData.type === TRANSACTION_TYPES.INCOME
                                ? 'bg-white dark:bg-slate-600 text-emerald-600 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Amount
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => {
                                        setFormData({ ...formData, amount: e.target.value })
                                        setError('')
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 text-lg font-semibold rounded-xl border bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 transition-all ${error
                                        ? 'border-danger focus:ring-danger/20'
                                        : 'border-slate-200 dark:border-slate-600 focus:ring-primary-500/20 focus:border-primary-500'
                                        } dark:text-white`}
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-sm text-danger mt-1.5">{error}</p>}
                        </div>

                        {/* Category Grid */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                Category
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {Object.entries(categories).map(([key, config]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: key })}
                                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${formData.category === key
                                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-1 ring-primary-600'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${formData.category === key ? 'bg-white dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-700'
                                            }`}>
                                            {/* Would use dynamic icon here */}
                                            <span className="text-xs font-bold">{key.substr(0, 1)}</span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center">
                                            {key}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date & Note */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                            <Input
                                label="Note (Optional)"
                                placeholder="e.g. Lunch with team"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transform active:scale-[0.98]"
                    >
                        <Check className="w-5 h-5" />
                        {initialData ? 'Save Changes' : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TransactionModal
