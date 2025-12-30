import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Bell, Search, Menu } from 'lucide-react'

function Header({ onMenuClick }) {
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0 md:bg-white/80 md:dark:bg-slate-800/80 md:backdrop-blur-sm">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar (Hidden on small mobile) */}
            <div className="hidden sm:flex items-center flex-1 max-w-md ml-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-slate-200 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Free Plan
                        </p>
                    </div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium text-sm sm:text-base ring-2 ring-white dark:ring-slate-800 shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
