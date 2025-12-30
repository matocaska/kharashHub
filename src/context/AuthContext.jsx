import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on mount
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const login = (email, password) => {
        // Simple authentication for MVP (replace with real API later)
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const foundUser = users.find(u => u.email === email && u.password === password)

        if (foundUser) {
            const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
            setUser(userWithoutPassword)
            setIsAuthenticated(true)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            return { success: true }
        }

        return { success: false, error: 'Invalid email or password' }
    }

    const signup = (name, email, password) => {
        // Simple signup for MVP (replace with real API later)
        const users = JSON.parse(localStorage.getItem('users') || '[]')

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'User already exists' }
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password // In production, this should be hashed
        }

        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email }
        setUser(userWithoutPassword)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))

        return { success: true }
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
