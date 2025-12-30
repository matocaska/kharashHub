import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
