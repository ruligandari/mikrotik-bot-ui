import React, { useState } from 'react'
import { ShieldCheck, User, Lock, Save, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Card, Button } from '../components/ui/DataDisplay'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
    const logout = useAuthStore(state => state.logout)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        new_username: '',
        new_password: '',
        confirm_password: ''
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            return toast.error('Passwords do not match')
        }

        if (!formData.new_username && !formData.new_password) {
            return toast.error('Please fill at least one field')
        }

        setIsLoading(true)
        try {
            const payload: any = {}
            if (formData.new_username) payload.new_username = formData.new_username
            if (formData.new_password) {
                payload.new_password = formData.new_password
                payload.confirm_password = formData.confirm_password
            }

            await api.post('/api/v1/auth/update-admin', payload)

            toast.success('Credentials updated! Please login again.')

            // Auto logout since credentials changed
            setTimeout(() => {
                logout()
                navigate('/login')
            }, 2000)
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to update credentials')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your admin access and security credentials.</p>
            </div>

            <Card className="p-0 overflow-hidden border-primary/10 shadow-2xl">
                <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Admin Credentials</h2>
                        <p className="text-xs text-muted-foreground">Updating these will require you to log in again.</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            New Admin Username
                        </label>
                        <input
                            type="text"
                            placeholder="Leave blank to keep current"
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={formData.new_username}
                            onChange={e => setFormData({ ...formData, new_username: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 6 characters"
                                    className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    value={formData.new_password}
                                    onChange={e => setFormData({ ...formData, new_password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat new password"
                                    className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    value={formData.confirm_password}
                                    onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-warning/5 border border-warning/10 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <p className="text-xs text-warning/80 leading-relaxed font-medium">
                            <b>Important:</b> After saving, you will be automatically logged out and must use your new credentials to access the system again.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full py-4 text-base font-bold shadow-xl shadow-primary/30"
                            isLoading={isLoading}
                        >
                            <Save className="w-5 h-5" />
                            Update Credentials
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
