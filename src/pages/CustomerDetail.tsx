import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Activity,
    ShieldAlert,
    ShieldCheck,
    ChevronRight,
    Database,
    Calendar,
    Clock,
    Zap,
    Ban,
    Trash2,
    History as HistoryIcon,
    Edit2
} from 'lucide-react'
import { useUserStatus, useUserActions, useUserLogs } from '../hooks/useUsers'
import { useBillingStatus } from '../hooks/useBilling'
import { Card, Badge, Button, StatCard, Modal } from '../components/ui/DataDisplay'
import { formatMonthYear } from '../utils/format'

export default function CustomerDetail() {
    const { username } = useParams<{ username: string }>()
    const navigate = useNavigate()
    const { data: status, isLoading } = useUserStatus(username || '')
    const { data: billing } = useBillingStatus(username || '')
    const { data: logs, isLoading: isLoadingLogs } = useUserLogs(username || '')
    const { kickUser, deleteUser, toggleFup, forceThrottle, forceNormal, updateUser } = useUserActions()

    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [editWhatsappValue, setEditWhatsappValue] = React.useState('')

    const handleOpenEdit = () => {
        if (status) {
            setEditWhatsappValue(status.whatsapp || '')
            setIsEditModalOpen(true)
        }
    }

    const handleUpdateUser = () => {
        if (status) {
            updateUser.mutate({ username: status.username, whatsapp: editWhatsappValue }, {
                onSuccess: () => setIsEditModalOpen(false)
            })
        }
    }

    if (isLoading) {
        return (
            <div className="p-10 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!status) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold">User not found</h2>
                <Button onClick={() => navigate('/customers')} className="mt-4">Back to List</Button>
            </div>
        )
    }

    const usagePercent = Math.min(Math.round((status.usage_gb / status.threshold_gb) * 100), 100)
    const isHighUsage = usagePercent > 80

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/customers')}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{status.username}</h1>
                            {status.state === 'throttled' ? (
                                <Badge variant="destructive">
                                    <ShieldAlert className="w-3 h-3" /> Throttled
                                </Badge>
                            ) : (
                                <Badge variant="success">
                                    <ShieldCheck className="w-3 h-3" /> Normal
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            Customer since 2024 <ChevronRight className="w-3 h-3" /> User Details & History
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => kickUser.mutate(status.username)} isLoading={kickUser.isPending}>
                        <Zap className="w-4 h-4 text-warning" />
                        Kick Session
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        if (confirm('Hapus user ini?')) deleteUser.mutate(status.username)
                    }} isLoading={deleteUser.isPending}>
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Usage */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard
                            title="Current Usage"
                            value={`${status.usage_gb.toFixed(2)} GB`}
                            icon={Activity}
                            description={`Used of ${status.threshold_gb} GB limit`}
                            color={isHighUsage ? "warning" : "primary"}
                        />
                        <StatCard
                            title="Status FUP"
                            value={status.enabled ? "ACTIVE" : "OFF"}
                            icon={status.enabled ? ShieldCheck : Ban}
                            description="Automatic throttling policy"
                            color={status.enabled ? "success" : "muted"}
                        />
                    </div>

                    <Card className="p-8">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Database className="w-5 h-5 text-primary" />
                            Usage Progress
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-muted-foreground">Monthly Consumption</span>
                                <span className={isHighUsage ? "text-warning" : "text-primary"}>
                                    {usagePercent}%
                                </span>
                            </div>
                            <div className="w-full h-4 bg-muted rounded-full overflow-hidden border border-border">
                                <div
                                    className={`h-full transition-all duration-1000 ${isHighUsage ? 'bg-warning' : 'bg-primary'}`}
                                    style={{ width: `${usagePercent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[11px] text-muted-foreground uppercase tracking-widest font-bold pt-2">
                                <span>0 GB</span>
                                <span>{status.threshold_gb / 2} GB</span>
                                <span>{status.threshold_gb} GB</span>
                            </div>
                        </div>
                    </Card>

                    {/* Action Log / History */}
                    <Card className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-primary" />
                                Recent System Actions
                            </h3>
                        </div>
                        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                            {isLoadingLogs ? (
                                <div className="p-8 text-center text-muted-foreground animate-pulse text-sm">Loading logs...</div>
                            ) : logs && logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <div key={i} className="p-4 flex md:items-center justify-between flex-col md:flex-row gap-2 hover:bg-muted/10 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-2 rounded-lg shrink-0 ${log.action.toLowerCase().includes('throttle') || log.action.toLowerCase().includes('limit') ? 'bg-warning/20 text-warning' : log.action.toLowerCase().includes('normal') ? 'bg-success/20 text-success' : log.action.toLowerCase().includes('kick') || log.action.toLowerCase().includes('delete') ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                                                {log.action.toLowerCase().includes('throttle') || log.action.toLowerCase().includes('limit') ? <ShieldAlert className="w-4 h-4" /> :
                                                    log.action.toLowerCase().includes('normal') ? <ShieldCheck className="w-4 h-4" /> :
                                                        log.action.toLowerCase().includes('kick') ? <Zap className="w-4 h-4" /> :
                                                            log.action.toLowerCase().includes('delete') ? <Trash2 className="w-4 h-4" /> :
                                                                <Activity className="w-4 h-4" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate capitalize">{log.action.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{log.detail}</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-mono shrink-0 whitespace-nowrap">{log.ts?.replace('T', ' ').substring(0, 19) || 'N/A'}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm italic">No recent system actions found for this user.</div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Settings & Support */}
                <div className="space-y-8">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-6">User Controls</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Auto FUP Monitoring</span>
                                    <button
                                        onClick={() => toggleFup.mutate({ username: status.username, enabled: !status.enabled })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${status.enabled ? 'bg-success' : 'bg-muted-foreground/30'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${status.enabled ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Toggle this off to prevent the system from automatically limiting this user's speed.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-3">
                                <div className="flex items-center gap-2 text-warning mb-1">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-sm font-bold">Priority Actions</span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-xs border-orange-500/20 hover:bg-orange-500/10"
                                    onClick={() => forceNormal.mutate(status.username)}
                                    isLoading={forceNormal.isPending}
                                >
                                    Force Normal Speed (Manual)
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-xs border-orange-500/20 hover:bg-orange-500/10"
                                    onClick={() => forceThrottle.mutate(status.username)}
                                    isLoading={forceThrottle.isPending}
                                >
                                    Force Limit Speed (Manual)
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">Network & Contact</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/20 border border-border">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Remote IP (MikroTik)</span>
                                <span className="text-sm font-mono font-bold text-primary">{status.remote_address || 'Not Assigned'}</span>
                            </div>

                            <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/20 border border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">WhatsApp Number</span>
                                    <button onClick={handleOpenEdit} className="text-[10px] text-primary flex items-center gap-1 hover:underline">
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-bold">{status.whatsapp || 'No Number'}</span>
                                    {status.whatsapp && (
                                        <a
                                            href={`https://wa.me/${status.whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-lg hover:bg-success/20 transition-colors font-bold"
                                        >
                                            Message
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold italic">Billing Info</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Expiry Date</span>
                                <span className="font-bold">25 Mar 2026</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subscription</span>
                                <Badge variant="primary">{status.package_name || 'No Package'}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-bold">Rp {status.price?.toLocaleString() || '---'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">MikroTik Profile</span>
                                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{status.profile || 'N/A'}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className={`p-6 border-2 ${billing?.is_paid ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Payment Status</h3>
                            {billing?.is_paid ? (
                                <Badge variant="success">PAID</Badge>
                            ) : (
                                <Badge variant="destructive">UNPAID</Badge>
                            )}
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">
                                Status for period: <span className="text-foreground font-bold">{billing?.month ? formatMonthYear(billing.month) : '---'}</span>
                            </p>
                            {billing?.is_paid && (
                                <div className="p-3 rounded-xl bg-background/50 border border-success/10 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Amount Paid</span>
                                        <span className="font-bold text-success">Rp {billing.amount_paid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Date</span>
                                        <span className="font-medium">{new Date(billing.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}
                            {!billing?.is_paid && (
                                <Button
                                    className="w-full bg-destructive hover:bg-destructive/90 text-white"
                                    onClick={() => navigate('/billing')}
                                >
                                    Record Payment
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User Contact"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateUser} isLoading={updateUser.isPending}>Save Changes</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp Number</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-border rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                            placeholder="e.g. 62812345678"
                            value={editWhatsappValue}
                            onChange={(e) => setEditWhatsappValue(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Leave blank to remove the number.</p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
