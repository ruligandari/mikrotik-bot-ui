import React from 'react'
import { ShieldAlert, Zap, Search, Ban } from 'lucide-react'
import { useThrottled } from '../hooks/useMonitoring'
import { useUserActions } from '../hooks/useUsers'
import { Card, Badge, Button } from '../components/ui/DataDisplay'

export default function Throttled() {
    const { data: throttled, isLoading } = useThrottled()
    const { toggleFup } = useUserActions()
    const [searchTerm, setSearchTerm] = React.useState('')

    const filteredThrottled = throttled?.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Throttled Users</h1>
                    <p className="text-muted-foreground mt-1">Users currently under speed limitations due to FUP policies.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/20 rounded-full text-destructive text-xs font-bold animate-pulse">
                    <ShieldAlert className="w-4 h-4" />
                    SYSTEM ALERT
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-border bg-card/50 px-6">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by username..."
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
                                <th className="p-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">User info</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Constraint</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">FUP Status</th>
                                <th className="p-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse"><td colSpan={4} className="h-16 bg-muted/5"></td></tr>
                                ))
                            ) : filteredThrottled?.map((user) => (
                                <tr key={user.username} className="hover:bg-muted/20 transition-colors">
                                    <td className="p-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">
                                                {user.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-sm">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Badge variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                                            SPEED LIMITED
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-center italic text-xs text-muted-foreground">
                                        Exceeded {user.threshold_gb} GB
                                    </td>
                                    <td className="p-4 px-6 text-right">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => toggleFup.mutate({ username: user.username, enabled: false })}
                                            isLoading={toggleFup.isPending}
                                        >
                                            <Zap className="w-3 h-3" /> Unthrottle
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(filteredThrottled?.length === 0 || !throttled) && !isLoading && (
                        <div className="text-center py-20 px-6">
                            <Ban className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No users are currently throttled.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
