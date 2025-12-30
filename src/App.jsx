import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TransactionProvider } from './context/TransactionContext'
import { BudgetProvider } from './context/BudgetContext'
import AppRoutes from './AppRoutes'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <TransactionProvider>
                    <BudgetProvider>
                        <Router>
                            <AppRoutes />
                        </Router>
                    </BudgetProvider>
                </TransactionProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
