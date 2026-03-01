import React from 'react'
import { Activity, Users, ShieldAlert, BarChart3, RefreshCcw, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSummary, useSessions, useThrottled, useCheckFup } from '../hooks/useMonitoring'
import { useUsers } from '../hooks/useUsers'
import { StatCard, Card } from '../components/ui/DataDisplay'
import UsageChart from '../components/charts/UsageChart'
import { formatMonthYear } from '../utils/format'

export default function Overview() {
    const { data: summary, isLoading: isLoadingSummary, isFetching: isFetchingSummary, refetch: refetchSummary } = useSummary()
    const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useUsers()
    const { data: sessions, isLoading: isLoadingSessions, refetch: refetchSessions } = useSessions()
    const { data: throttled, isLoading: isLoadingThrottled, refetch: refetchThrottled } = useThrottled()
    const checkFup = useCheckFup()

    const handleRefreshAll = async () => {
        await Promise.all([
            refetchSummary(),
            refetchUsers(),
            refetchSessions(),
            refetchThrottled()
        ])
        toast.success('Dashboard data updated')
    }

    const stats = [
        {
            title: "Total Customers",
            value: users?.length || 0,
            icon: Users,
            description: "Registered PPPoE users",
            color: "primary" as const
        },
        {
            title: "Total Usage (Monthly)",
            value: summary ? `${summary.total_usage_gb.toFixed(1)} GB` : "---",
            icon: BarChart3,
            description: `Data for ${summary?.month ? formatMonthYear(summary.month) : 'current month'}`,
            color: "warning" as const
        },
        {
            title: "Active Sessions",
            value: sessions?.length || 0,
            icon: Activity,
            description: "Live connected users",
            color: "success" as const
        }
    ]

    const isAnyFetching = isFetchingSummary || isLoadingUsers || isLoadingSessions || isLoadingThrottled

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Network Overview</h1>
                    <p className="text-muted-foreground mt-1">Real-time monitoring for your MikroTik network.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => checkFup.mutate()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-bold transition-all shadow-sm shadow-primary/5"
                        disabled={checkFup.isPending}
                    >
                        <Zap className={`w-4 h-4 ${checkFup.isPending ? 'animate-pulse' : ''}`} />
                        Force FUP Scan
                    </button>
                    <button
                        onClick={handleRefreshAll}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-all group"
                        disabled={isAnyFetching}
                    >
                        <RefreshCcw className={`w-4 h-4 ${isAnyFetching ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-bold">Top 5 Consumers</h3>
                            <p className="text-sm text-muted-foreground">Highest data usage this month</p>
                        </div>
                        <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {isLoadingSummary ? (
                        <div className="h-[350px] w-full flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <UsageChart data={summary?.top_users || []} />
                    )}
                </Card>

                {/* Recent Activity Mini-List (Placeholder for Sessions) */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Live Sessions</h3>
                        <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
                    </div>
                    <div className="space-y-4">
                        {isLoadingSessions ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-14 bg-muted/20 animate-pulse rounded-xl"></div>
                            ))
                        ) : sessions && sessions.length > 0 ? (
                            sessions.slice(0, 6).map((session, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {session?.username ? session.username.substring(0, 2).toUpperCase() : '??'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{session?.username || 'Unknown'}</p>
                                            <p className="text-[10px] text-muted-foreground">{session?.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-medium text-success">{session.uptime}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-muted-foreground">No active sessions</p>
                            </div>
                        )}

                        {sessions && sessions.length > 6 && (
                            <p className="text-center text-xs text-primary font-medium cursor-pointer hover:underline pt-2">
                                View all {sessions.length} sessions
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
