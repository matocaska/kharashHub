import React, { useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import { useTransactions } from '../context/TransactionContext'
import { Save, Edit2, AlertTriangle, CheckCircle2, Plus, Trash2, X } from 'lucide-react'
import Input from '../components/Input'

function Budget() {
    const {
        monthlyBudget,
        categoryBudgets,
        categories,
        updateMonthlyBudget,
        updateCategoryBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        getBudgetUsagePercentage,
        getCategoryBudgetUsage
    } = useBudget()
    const { getCategoryTotals, getTotalExpenses, bulkUpdateCategory } = useTransactions()

    const [isEditingTotal, setIsEditingTotal] = useState(false)
    const [tempTotalBudget, setTempTotalBudget] = useState(monthlyBudget)
    const [editingCategory, setEditingCategory] = useState(null)
    const [tempCategoryBudget, setTempCategoryBudget] = useState('')

    // New Category State
    // Category Form State
    const [categoryForm, setCategoryForm] = useState({
        isOpen: false,
        mode: 'add', // 'add' or 'edit'
        oldName: '',
        name: '',
        color: '#3b82f6'
    })
    const [formError, setFormError] = useState('')

    const categoryTotals = getCategoryTotals('expense')
    const totalExpenses = getTotalExpenses()
    const totalUsage = getBudgetUsagePercentage(totalExpenses)

    const handleUpdateTotal = () => {
        updateMonthlyBudget(Number(tempTotalBudget))
        setIsEditingTotal(false)
    }

    const handleUpdateCategory = (category) => {
        updateCategoryBudget(category, Number(tempCategoryBudget))
        setEditingCategory(null)
    }

    const startEditingCategory = (category, currentBudget) => {
        setEditingCategory(category)
        setTempCategoryBudget(currentBudget || 0)
    }

    const openAddCategory = () => {
        setCategoryForm({
            isOpen: true,
            mode: 'add',
            oldName: '',
            name: '',
            color: '#3b82f6'
        })
        setFormError('')
    }

    const openEditCategory = (name, color) => {
        setCategoryForm({
            isOpen: true,
            mode: 'edit',
            oldName: name,
            name: name,
            color: color
        })
        setFormError('')
    }

    const handleSaveCategory = (e) => {
        e.preventDefault()
        const name = categoryForm.name.trim()

        if (!name) {
            setFormError('Category name is required')
            return
        }

        if (categoryForm.mode === 'add' && categories[name]) {
            setFormError('Category already exists')
            return
        }

        if (categoryForm.mode === 'edit' && name !== categoryForm.oldName && categories[name]) {
            setFormError('Category name already taken')
            return
        }

        if (categoryForm.mode === 'add') {
            addCategory(name, categoryForm.color)
        } else {
            // mode === 'edit'
            updateCategory(categoryForm.oldName, name, categoryForm.color, categories[categoryForm.oldName]?.icon || 'Circle')
            // Sync transactions if name changed
            if (name !== categoryForm.oldName) {
                bulkUpdateCategory(categoryForm.oldName, name)
            }
        }

        setCategoryForm(prev => ({ ...prev, isOpen: false }))
    }

    const handleDeleteCategory = (category) => {
        if (window.confirm(`Are you sure you want to delete ${category}? This will remove its budget limit.`)) {
            deleteCategory(category)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Budget & Goals
                </h1>
                <div className="flex justify-between items-end">
                    <p className="text-slate-500 dark:text-slate-400">
                        Set limits and track your spending discipline
                    </p>
                    <button
                        onClick={openAddCategory}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Add/Edit Category Modal */}
            {categoryForm.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {categoryForm.mode === 'add' ? 'Add New Category' : 'Edit Category'}
                            </h3>
                            <button
                                onClick={() => setCategoryForm(prev => ({ ...prev, isOpen: false }))}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveCategory} className="space-y-4">
                            <Input
                                label="Category Name"
                                value={categoryForm.name}
                                onChange={(e) => {
                                    setCategoryForm(prev => ({ ...prev, name: e.target.value }))
                                    setFormError('')
                                }}
                                placeholder="e.g. Subscriptions"
                                autoFocus
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Color Tag
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setCategoryForm(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${categoryForm.color === color ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {formError && <p className="text-sm text-danger">{formError}</p>}

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                            >
                                {categoryForm.mode === 'add' ? 'Create Category' : 'Save Changes'}
                            </button>

                            {categoryForm.mode === 'edit' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleDeleteCategory(categoryForm.oldName)
                                        setCategoryForm(prev => ({ ...prev, isOpen: false }))
                                    }}
                                    className="w-full py-2.5 text-danger hover:bg-danger-light/10 rounded-xl font-medium transition-colors border border-transparent hover:border-danger/20"
                                >
                                    Delete Category
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Monthly Total Budget Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Total Monthly Budget</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Overall spending limit</p>
                        </div>
                    </div>

                    {isEditingTotal ? (
                        <div className="flex items-center gap-2">
                            <div className="w-32">
                                <Input
                                    type="number"
                                    value={tempTotalBudget}
                                    onChange={(e) => setTempTotalBudget(e.target.value)}
                                    className="py-1 px-2 text-right"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleUpdateTotal}
                                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${monthlyBudget.toLocaleString()}
                            </span>
                            <button
                                onClick={() => {
                                    setTempTotalBudget(monthlyBudget)
                                    setIsEditingTotal(true)
                                }}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Total Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600 dark:text-slate-400">
                            Spent: ${totalExpenses.toLocaleString()}
                        </span>
                        <span className={`${totalUsage > 100 ? 'text-danger' : 'text-slate-600 dark:text-slate-400'}`}>
                            {Math.round(totalUsage)}% Used
                        </span>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${totalUsage > 100 ? 'bg-danger' :
                                totalUsage > 80 ? 'bg-warning' : 'bg-primary-500'
                                }`}
                            style={{ width: `${Math.min(totalUsage, 100)}%` }}
                        />
                    </div>
                    {totalUsage > 80 && (
                        <div className="flex items-center gap-2 text-sm text-warning mt-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>
                                {totalUsage > 100
                                    ? 'You have exceeded your monthly budget!'
                                    : 'You are approaching your monthly limit.'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Budgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categories).map(([category, config]) => {
                    const spent = categoryTotals[category] || 0
                    const budget = categoryBudgets[category] || 0
                    const usage = budget > 0 ? (spent / budget) * 100 : 0
                    const isOverBudget = usage > 100
                    const isWarning = usage > 80 && !isOverBudget

                    return (
                        <div key={category} className="group bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                                        style={{ backgroundColor: `${config.color}15`, color: config.color }}
                                    >
                                        {/* Icon placeholder using first letter */}
                                        <span className="font-bold">{category.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{category}</h3>
                                            <button
                                                onClick={() => openEditCategory(category, config.color)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary-600 transition-all focus:opacity-100"
                                                title="Edit Category Details"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Spent: ${spent.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {editingCategory === category ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={tempCategoryBudget}
                                            onChange={(e) => setTempCategoryBudget(e.target.value)}
                                            className="w-20 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdateCategory(category)}
                                            className="p-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                                        >
                                            <Save className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <div
                                            className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer group flex items-center justify-end gap-1"
                                            onClick={() => startEditingCategory(category, budget)}
                                            title="Click to set budget limit"
                                        >
                                            ${budget.toLocaleString()}
                                            <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-primary-500 transition-colors" />
                                        </div>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">Limit</p>
                                    </div>
                                )}
                            </div>

                            {/* Category Progress Bar */}
                            {
                                budget > 0 ? (
                                    <div className="space-y-1">
                                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-danger' :
                                                    isWarning ? 'bg-warning' :
                                                        'bg-slate-400 dark:bg-slate-500' // Neutral color for individual categories unless warnings
                                                    }`}
                                                style={{
                                                    width: `${Math.min(usage, 100)}%`,
                                                    backgroundColor: !isOverBudget && !isWarning ? config.color : undefined
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className={`${isOverBudget ? 'text-danger font-medium' : 'text-slate-400'}`}>
                                                {Math.round(usage)}%
                                            </span>
                                            <span className="text-slate-400">
                                                ${Math.max(0, budget - spent).toLocaleString()} left
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditingCategory(category, 0)}
                                            className="flex-1 py-1.5 text-xs font-medium text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 transition-colors"
                                        >
                                            Set Budget
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category)}
                                            className="px-2 py-1.5 text-slate-400 hover:text-danger hover:bg-danger-light/10 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 transition-colors"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default Budget
