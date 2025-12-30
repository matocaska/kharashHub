import React, { forwardRef } from 'react'

const Input = forwardRef(({ label, type = 'text', error, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    className={`
            w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 
            text-slate-900 dark:text-slate-100 placeholder-slate-400
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
                            ? 'border-danger focus:ring-danger/20 focus:border-danger'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-primary-500/20 focus:border-primary-500'
                        }
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-danger animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
