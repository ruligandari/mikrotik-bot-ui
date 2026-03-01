import React, { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Activity, Sliders, LogOut, Menu, X, ShieldCheck, CreditCard, Settings, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Card, Badge, Button, Modal } from '../ui/DataDisplay'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface SidebarItemProps {
    to: string
    icon: React.ElementType
    label: string
    active?: boolean
    onClick?: () => void
}

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: SidebarItemProps) => (
    <Link
        to={to}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
        <span className="font-medium">{label}</span>
    </Link>
)

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)
    const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
        }
        return 'dark'
    })

    React.useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

    const location = useLocation()
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const menuItems = [
        { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
        { to: '/customers', icon: Users, label: 'Customers' },
        { to: '/sessions', icon: Activity, label: 'Active Sessions' },
        { to: '/throttled', icon: Sliders, label: 'Throttled' },
        { to: '/billing', icon: CreditCard, label: 'Billing' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ]

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true)
    }

    const confirmLogout = () => {
        logout()
        navigate('/login')
        setIsLogoutModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 border-r border-border bg-card/30 backdrop-blur-xl p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">MikroTik<span className="text-primary">.Pro</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            active={location.pathname === item.to || (item.to !== '/overview' && location.pathname.startsWith(item.to))}
                        />
                    ))}
                </nav>

                <div className="space-y-2 mb-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full group"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        ) : (
                            <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        )}
                        <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>

                <div className="pt-6 border-t border-border mt-auto">
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-40 px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <span className="font-bold tracking-tight text-lg">MikroTik.Pro</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                    <button onClick={handleLogoutClick} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around px-2 pb-safe">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.to || (item.to !== '/overview' && location.pathname.startsWith(item.to));

                    // Shorten labels specifically for smaller screens
                    let mobileLabel = item.label;
                    if (mobileLabel === 'Active Sessions') mobileLabel = 'Sessions';

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "scale-110 drop-shadow-md" : "")} />
                            <span className="text-[10px] font-medium leading-none tracking-tight">{mobileLabel}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full lg:pt-0 pt-16 pb-20 lg:pb-0 overflow-x-hidden animate-in fade-in duration-500">
                <div className="max-w-[1600px] mx-auto min-h-full">
                    {children}
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
            >
                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Are you sure you want to log out? You will need to sign in again to access the dashboard.
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmLogout}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
