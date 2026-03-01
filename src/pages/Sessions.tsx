import React from 'react'
import { Activity, Zap, Search } from 'lucide-react'
import { useSessions } from '../hooks/useMonitoring'
import { useUserActions } from '../hooks/useUsers'
import { Card, Badge, Button } from '../components/ui/DataDisplay'

export default function Sessions() {
    const { data: sessions, isLoading } = useSessions()
    const { kickUser } = useUserActions()
    const [searchTerm, setSearchTerm] = React.useState('')

    const filteredSessions = sessions?.filter(s =>
        (s?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s?.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
                    <p className="text-muted-foreground mt-1">Real-time view of users currently connected to the network.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full text-success text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    LIVE MONITORING
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border bg-card/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by username or IP..."
                            className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">IP Address</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Uptime</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse"><td colSpan={4} className="h-16 bg-muted/5"></td></tr>
                                ))
                            ) : filteredSessions?.map((session) => (
                                <tr key={session.username} className="hover:bg-muted/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {session?.username?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <span className="font-bold text-sm">{session?.username || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">
                                        {session.address}
                                    </td>
                                    <td className="p-4 text-center">
                                        <Badge variant="success" className="bg-success/10 border-success/20">
                                            {session.uptime}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => kickUser.mutate(session.username)}
                                            isLoading={kickUser.isPending}
                                        >
                                            <Zap className="w-3 h-3" /> Kick
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(filteredSessions?.length === 0 || !sessions) && !isLoading && (
                        <div className="text-center py-20">
                            <Activity className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No active sessions found.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
