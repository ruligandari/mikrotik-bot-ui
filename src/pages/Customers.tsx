import React, { useState } from 'react'
import {
    Search,
    Settings2,
    Trash2,
    Ban,
    ShieldCheck,
    Zap,
    History,
    MoreVertical,
    UserPlus
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUsers, useUserActions, useProfiles } from '../hooks/useUsers'
import { Card, Badge, Button, Modal } from '../components/ui/DataDisplay'

export default function Customers() {
    const navigate = useNavigate()
    const { data: users, isLoading } = useUsers()
    const { data: profiles, isLoading: isLoadingProfiles } = useProfiles()
    const { deleteUser, kickUser, setQuota, toggleFup, addUser } = useUserActions()
    const [searchTerm, setSearchTerm] = useState('')

    // Modal states
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false)
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [quotaValue, setQuotaValue] = useState(100)

    // Add User Form states
    const [newUser, setNewUser] = useState({ username: '', password: '', profile: 'default', whatsapp: '' })

    const filteredUsers = users?.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenQuotaModal = (username: string, currentLimit: number) => {
        setSelectedUser(username)
        setQuotaValue(currentLimit)
        setIsQuotaModalOpen(true)
    }

    const handleUpdateQuota = () => {
        if (selectedUser) {
            setQuota.mutate({ username: selectedUser, limit_gb: quotaValue })
            setIsQuotaModalOpen(false)
        }
    }

    const handleAddUser = () => {
        addUser.mutate(newUser, {
            onSuccess: () => {
                setIsAddUserModalOpen(false)
                setNewUser({ username: '', password: '', profile: 'default', whatsapp: '' })
            }
        })
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor all PPPoE users.</p>
                </div>
                <Button className="md:w-auto w-full" onClick={() => setIsAddUserModalOpen(true)}>
                    <UserPlus className="w-4 h-4" />
                    Add New User
                </Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border bg-card/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="muted">{filteredUsers?.length || 0} Total Users</Badge>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User info</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">FUP Monitoring</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Quota Limit</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="p-4 h-16 bg-muted/10"></td>
                                    </tr>
                                ))
                            ) : filteredUsers?.map((user) => (
                                <tr key={user.username} className="hover:bg-muted/20 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {user.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{user.username}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase">{user.package_name || 'No Package'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => toggleFup.mutate({ username: user.username, enabled: !user.enabled })}
                                            disabled={toggleFup.isPending}
                                            className="inline-block"
                                        >
                                            {user.enabled ? (
                                                <Badge variant="success" className="cursor-pointer hover:opacity-80 transition-opacity">
                                                    <ShieldCheck className="w-3 h-3" /> Enabled
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="cursor-pointer hover:opacity-80 transition-opacity">
                                                    <Ban className="w-3 h-3" /> Disabled
                                                </Badge>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-xs font-bold cursor-pointer hover:bg-muted/80 transition-colors"
                                            onClick={() => handleOpenQuotaModal(user.username, user.threshold_gb)}
                                        >
                                            {user.threshold_gb} GB
                                            <Settings2 className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {/* Desktop View: Show buttons */}
                                        <div className="hidden lg:flex items-center justify-end gap-2">
                                            <Button variant="outline" size="icon" title="Kick connection" onClick={() => kickUser.mutate(user.username)} isLoading={kickUser.isPending}>
                                                <Zap className="w-4 h-4 text-warning" />
                                            </Button>
                                            <Button variant="outline" size="icon" title="View details/History" onClick={() => navigate(`/customers/${user.username}`)}>
                                                <History className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button variant="destructive" size="icon" title="Delete user" onClick={() => {
                                                if (confirm(`Hapus user ${user.username}?`)) deleteUser.mutate(user.username)
                                            }} isLoading={deleteUser.isPending}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Mobile View: 3 Dots Menu */}
                                        <div className="lg:hidden relative flex justify-end">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === user.username ? null : user.username)}
                                                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {activeMenu === user.username && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-lg z-50 p-2 flex flex-col gap-1">
                                                    <button
                                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg text-left transition-colors"
                                                        onClick={() => { setActiveMenu(null); kickUser.mutate(user.username); }}
                                                    >
                                                        <Zap className="w-4 h-4 text-warning" /> Kick Session
                                                    </button>
                                                    <button
                                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg text-left transition-colors"
                                                        onClick={() => { setActiveMenu(null); navigate(`/customers/${user.username}`); }}
                                                    >
                                                        <History className="w-4 h-4 text-primary" /> Detail & History
                                                    </button>
                                                    <button
                                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-destructive/10 text-destructive rounded-lg text-left transition-colors"
                                                        onClick={() => {
                                                            setActiveMenu(null);
                                                            if (confirm(`Hapus user ${user.username}?`)) deleteUser.mutate(user.username);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete User
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers?.length === 0 && !isLoading && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Quota Settings Modal */}
            <Modal
                isOpen={isQuotaModalOpen}
                onClose={() => setIsQuotaModalOpen(false)}
                title="Set Data Quota Limit"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsQuotaModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateQuota} isLoading={setQuota.isPending}>Update Limit</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Adjust the FUP threshold for user <span className="text-foreground font-bold">{selectedUser}</span>.</p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Limit (GB)</label>
                        <input
                            type="number"
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-center text-2xl"
                            value={quotaValue}
                            onChange={(e) => setQuotaValue(Number(e.target.value))}
                        />
                    </div>
                </div>
            </Modal>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                title="Add New PPPoE User"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsAddUserModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddUser} isLoading={addUser.isPending}>Create User</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="e.g. pelanggan_01"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full bg-background border border-border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="••••••••"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp Number (Optional)</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="e.g. 62812345678"
                            value={newUser.whatsapp}
                            onChange={(e) => setNewUser({ ...newUser, whatsapp: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Service Profile</label>
                        <select
                            className="w-full bg-background border border-border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={newUser.profile}
                            onChange={(e) => setNewUser({ ...newUser, profile: e.target.value })}
                            disabled={isLoadingProfiles}
                        >
                            {isLoadingProfiles ? (
                                <option>Loading profiles...</option>
                            ) : (
                                profiles?.map(p => (
                                    <option key={p.profile} value={p.profile}>
                                        {p.package_name || p.profile} (Rp {p.price.toLocaleString()})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
