import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Input from '../components/Input'

function ForgotPassword() {
    const [email, setEmail] = useState(localStorage.getItem('remember_email') || '')
    const [status, setStatus] = useState('idle') // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMessage('')

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // For demo purposes, we'll just succeed
            setStatus('success')
        } catch (err) {
            setErrorMessage('Something went wrong. Please try again.')
            setStatus('error')
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
                        Reset password
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        We'll send you instructions to reset your password
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-8 border border-slate-100 dark:border-slate-700">
                    {status === 'success' ? (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-light/10 text-success-dark dark:text-success-light mb-2">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Check your email</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We've sent a password reset link to <br />
                                    <span className="font-medium text-slate-900 dark:text-white">{email}</span>
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                            >
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 rounded-lg bg-danger-light/10 border border-danger-light/20 flex items-start gap-3 text-danger-dark dark:text-danger-light animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <Input
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`
                                    w-full py-2.5 px-4 rounded-lg font-medium text-white
                                    bg-primary-600 hover:bg-primary-700
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                                    transition-all duration-200 shadow-lg shadow-primary-600/20
                                    disabled:opacity-70 disabled:cursor-not-allowed
                                    flex items-center justify-center
                                `}
                            >
                                {status === 'loading' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Send reset link'
                                )}
                            </button>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to sign in
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
