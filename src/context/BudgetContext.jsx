import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { INITIAL_CATEGORIES } from '../utils/constants'

const BudgetContext = createContext()

export const useBudget = () => {
    const context = useContext(BudgetContext)
    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider')
    }
    return context
}

export const BudgetProvider = ({ children }) => {
    const { user } = useAuth()
    const [monthlyBudget, setMonthlyBudget] = useState(0)
    const [categoryBudgets, setCategoryBudgets] = useState({})
    const [savingsGoal, setSavingsGoal] = useState(0)
    // Initialize categories with constants if not found in local storage
    const [categories, setCategories] = useState(INITIAL_CATEGORIES)

    useEffect(() => {
        if (user) {
            const savedBudget = localStorage.getItem(`budget_${user.id}`)
            if (savedBudget) {
                const budgetData = JSON.parse(savedBudget)
                setMonthlyBudget(budgetData.monthlyBudget || 0)
                setCategoryBudgets(budgetData.categoryBudgets || {})
                setSavingsGoal(budgetData.savingsGoal || 0)
                // Load saved categories or use initial ones
                if (budgetData.categories && Object.keys(budgetData.categories).length > 0) {
                    setCategories(budgetData.categories)
                } else {
                    setCategories(INITIAL_CATEGORIES)
                }
            } else {
                setCategories(INITIAL_CATEGORIES)
            }
        }
    }, [user])

    const saveBudgetData = (budget, catBudgets, goal, cats) => {
        if (user) {
            const budgetData = {
                monthlyBudget: budget,
                categoryBudgets: catBudgets,
                savingsGoal: goal,
                categories: cats
            }
            localStorage.setItem(`budget_${user.id}`, JSON.stringify(budgetData))
        }
    }

    const updateMonthlyBudget = (amount) => {
        setMonthlyBudget(amount)
        saveBudgetData(amount, categoryBudgets, savingsGoal, categories)
    }

    const updateCategoryBudget = (category, amount) => {
        const updatedCategoryBudgets = { ...categoryBudgets, [category]: amount }
        setCategoryBudgets(updatedCategoryBudgets)
        saveBudgetData(monthlyBudget, updatedCategoryBudgets, savingsGoal, categories)
    }

    const updateSavingsGoal = (amount) => {
        setSavingsGoal(amount)
        saveBudgetData(monthlyBudget, categoryBudgets, amount, categories)
    }

    const addCategory = (name, color, icon = 'Circle') => {
        if (categories[name]) return // Prevent duplicates
        const newCategories = { ...categories, [name]: { icon, color } }
        setCategories(newCategories)
        saveBudgetData(monthlyBudget, categoryBudgets, savingsGoal, newCategories)
    }

    const updateCategory = (oldName, newName, color, icon) => {
        const newCategories = { ...categories }

        // If name changed, delete old and add new
        if (oldName !== newName) {
            delete newCategories[oldName]
            newCategories[newName] = { icon, color }

            // Also need to migrate budgets for this category
            const newCategoryBudgets = { ...categoryBudgets }
            if (newCategoryBudgets[oldName]) {
                newCategoryBudgets[newName] = newCategoryBudgets[oldName]
                delete newCategoryBudgets[oldName]
                setCategoryBudgets(newCategoryBudgets)
            }
        } else {
            newCategories[oldName] = { icon, color }
        }

        setCategories(newCategories)
        // Note: We might want to migrate transactions too, but for MVP we might skip or handle it
        saveBudgetData(monthlyBudget, categoryBudgets, savingsGoal, newCategories)
    }

    const deleteCategory = (name) => {
        const newCategories = { ...categories }
        delete newCategories[name]
        setCategories(newCategories)

        const newCategoryBudgets = { ...categoryBudgets }
        delete newCategoryBudgets[name]
        setCategoryBudgets(newCategoryBudgets)

        saveBudgetData(monthlyBudget, newCategoryBudgets, savingsGoal, newCategories)
    }

    const getBudgetUsagePercentage = (spent) => {
        if (monthlyBudget === 0) return 0
        return (spent / monthlyBudget) * 100
    }

    const getCategoryBudgetUsage = (category, spent) => {
        const budget = categoryBudgets[category]
        if (!budget || budget === 0) return 0
        return (spent / budget) * 100
    }

    const isBudgetWarning = (percentage) => {
        return percentage >= 80 && percentage < 100
    }

    const isBudgetExceeded = (percentage) => {
        return percentage >= 100
    }

    return (
        <BudgetContext.Provider value={{
            categories,
            monthlyBudget,
            categoryBudgets,
            savingsGoal,
            updateMonthlyBudget,
            updateCategoryBudget,
            updateSavingsGoal,
            addCategory,
            updateCategory,
            deleteCategory,
            getBudgetUsagePercentage,
            getCategoryBudgetUsage,
            isBudgetWarning,
            isBudgetExceeded
        }}>
            {children}
        </BudgetContext.Provider>
    )
}
