import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const TransactionContext = createContext()

export const useTransactions = () => {
    const context = useContext(TransactionContext)
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider')
    }
    return context
}

export const TransactionProvider = ({ children }) => {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        if (user) {
            const savedTransactions = localStorage.getItem(`transactions_${user.id}`)
            if (savedTransactions) {
                setTransactions(JSON.parse(savedTransactions))
            }
        }
    }, [user])

    const saveTransactions = (newTransactions) => {
        if (user) {
            localStorage.setItem(`transactions_${user.id}`, JSON.stringify(newTransactions))
            setTransactions(newTransactions)
        }
    }

    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now().toString(),
            ...transaction,
            date: transaction.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        }
        const updatedTransactions = [...transactions, newTransaction]
        saveTransactions(updatedTransactions)
        return newTransaction
    }

    const updateTransaction = (id, updates) => {
        const updatedTransactions = transactions.map(t =>
            t.id === id ? { ...t, ...updates } : t
        )
        saveTransactions(updatedTransactions)
    }

    const deleteTransaction = (id) => {
        const updatedTransactions = transactions.filter(t => t.id !== id)
        saveTransactions(updatedTransactions)
    }

    const bulkUpdateCategory = (oldCategory, newCategory) => {
        const updatedTransactions = transactions.map(t =>
            t.category === oldCategory ? { ...t, category: newCategory } : t
        )
        saveTransactions(updatedTransactions)
    }

    const getTransactionsByType = (type) => {
        return transactions.filter(t => t.type === type)
    }

    const getTransactionsByCategory = (category) => {
        return transactions.filter(t => t.category === category)
    }

    const getTransactionsByDateRange = (startDate, endDate) => {
        return transactions.filter(t => {
            const transactionDate = new Date(t.date)
            return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate)
        })
    }

    const getTotalIncome = (month = null, year = null) => {
        let filtered = transactions.filter(t => t.type === 'income')

        if (month !== null && year !== null) {
            filtered = filtered.filter(t => {
                const date = new Date(t.date)
                return date.getMonth() === month && date.getFullYear() === year
            })
        }

        return filtered.reduce((sum, t) => sum + parseFloat(t.amount), 0)
    }

    const getTotalExpenses = (month = null, year = null) => {
        let filtered = transactions.filter(t => t.type === 'expense')

        if (month !== null && year !== null) {
            filtered = filtered.filter(t => {
                const date = new Date(t.date)
                return date.getMonth() === month && date.getFullYear() === year
            })
        }

        return filtered.reduce((sum, t) => sum + parseFloat(t.amount), 0)
    }

    const getBalance = () => {
        return getTotalIncome() - getTotalExpenses()
    }

    const getCategoryTotals = (type = 'expense', month = null, year = null) => {
        let filtered = transactions.filter(t => t.type === type)

        if (month !== null && year !== null) {
            filtered = filtered.filter(t => {
                const date = new Date(t.date)
                return date.getMonth() === month && date.getFullYear() === year
            })
        }

        const categoryTotals = {}
        filtered.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount)
        })

        return categoryTotals
    }

    return (
        <TransactionContext.Provider value={{
            transactions,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            bulkUpdateCategory,
            getTransactionsByType,
            getTransactionsByCategory,
            getTransactionsByDateRange,
            getTotalIncome,
            getTotalExpenses,
            getBalance,
            getCategoryTotals
        }}>
            {children}
        </TransactionContext.Provider>
    )
}
