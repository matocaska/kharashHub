import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { User, Mail, Shield, Moon, Sun, Bell, LogOut, Check } from 'lucide-react'
import Input from '../components/Input'

function Settings() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('profile') // profile, preferences, security

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    })
    const [isSaved, setIsSaved] = useState(false)

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        // In a real app, this would call an API update
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your account preferences
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'profile'
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'preferences'
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Bell className="w-5 h-5" />
                        Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'security'
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Shield className="w-5 h-5" />
                        Security
                    </button>
                </div>

                {/* Settings Content */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-slate-700">
                                        {profileData.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors">
                                            Change Avatar
                                        </button>
                                        <p className="text-xs text-slate-400 mt-1">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        {isSaved ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Saved!
                                            </>
                                        ) : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Appearance</h3>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                                                }`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Notifications</h3>
                                    <div className="space-y-3">
                                        {['Budget Alerts', 'Monthly Reports', 'New Features'].map(item => (
                                            <label key={item} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                                <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex gap-3">
                                    <Shield className="w-6 h-6 text-amber-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-amber-800 dark:text-amber-500">Demo Security Note</h4>
                                        <p className="text-sm text-amber-700 dark:text-amber-600 mt-1">
                                            This is a demo application. Passwords are not encrypted in localStorage. Do not use real passwords.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 text-danger hover:text-danger-dark font-medium px-4 py-2 border border-danger-light/30 rounded-lg hover:bg-danger-light/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out of All Sessions
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
