import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
    LayoutDashboard,
    Wallet,
    PieChart,
    Settings,
    LogOut,
    Menu, // Hamburger icon
    X // Close icon
} from 'lucide-react'

function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Wallet, label: 'Transactions', path: '/transactions' },
        { icon: PieChart, label: 'Budget & Goals', path: '/budget' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
    transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Content */}
            <aside className={sidebarClasses}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                                ExpenseTrack
                            </span>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="ml-auto md:hidden p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Menu
                        </div>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()} // Close sidebar on mobile nav
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                `}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${location.pathname === item.path
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                                    }`} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-danger-light/10 hover:text-danger dark:hover:text-danger-light transition-all duration-200 group"
                        >
                            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-danger dark:text-slate-500 dark:group-hover:text-danger-light transition-colors" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
