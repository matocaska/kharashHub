import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, AlertCircle, Wallet } from 'lucide-react'
import Input from '../components/Input'

function Login() {
    const [formData, setFormData] = useState({
        email: localStorage.getItem('remember_email') || '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Persist email
        if (name === 'email') {
            localStorage.setItem('remember_email', value)
        }

        // Clear error when user types
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Simulate network delay for better UX feel
            await new Promise(resolve => setTimeout(resolve, 800))

            const result = login(formData.email, formData.password)

            if (result.success) {
                navigate('/dashboard')
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100/50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome back
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Sign in to manage your finances
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-8 border border-slate-100 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-lg bg-danger-light/10 border border-danger-light/20 flex items-start gap-3 text-danger-dark dark:text-danger-light animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />

                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <div className="flex justify-end mt-1">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                w-full py-2.5 px-4 rounded-lg font-medium text-white
                bg-primary-600 hover:bg-primary-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                transition-all duration-200 shadow-lg shadow-primary-600/20
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center
              `}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
