import React, { useState } from 'react'
import { CreditCard, Search, DollarSign, UserCheck, AlertCircle, Calendar, Receipt } from 'lucide-react'
import { useUnpaidUsers, useBillingActions } from '../hooks/useBilling'
import { Card, Badge, Button, Modal } from '../components/ui/DataDisplay'
import { formatMonthYear } from '../utils/format'

export default function Billing() {
    const { data: unpaidData, isLoading } = useUnpaidUsers()
    const { recordPayment } = useBillingActions()
    const [searchTerm, setSearchTerm] = useState('')

    // Payment Modal states
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [amount, setAmount] = useState(150000)

    const filteredUsers = unpaidData?.users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenPaymentModal = (username: string, defaultPrice: number) => {
        setSelectedUser(username)
        setAmount(defaultPrice)
        setIsPaymentModalOpen(true)
    }

    const handleRecordPayment = () => {
        if (selectedUser) {
            recordPayment.mutate({ username: selectedUser, amount }, {
                onSuccess: () => {
                    setIsPaymentModalOpen(false)
                }
            })
        }
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
                    <p className="text-muted-foreground mt-1">Manage user payments and track arrears for {unpaidData?.month ? formatMonthYear(unpaidData.month) : 'current month'}.</p>
                </div>
                <Card className="py-2 px-4 flex items-center gap-3 bg-primary/5 border-primary/20">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Billing Period</p>
                        <p className="text-sm font-bold text-primary">{unpaidData?.month ? formatMonthYear(unpaidData.month) : '---'}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">{unpaidData?.unpaid_count || 0}</h2>
                        <p className="text-muted-foreground font-medium">Unpaid Users</p>
                    </div>
                </Card>

                <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-primary/5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Rp {(unpaidData?.total_piutang || 0).toLocaleString()}</h2>
                        <p className="text-muted-foreground font-medium text-sm">Total Arrears</p>
                    </div>
                </Card>

                <Card className="md:col-span-2 p-0 overflow-hidden">
                    <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search unpaid users..."
                                className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Badge variant="destructive">{filteredUsers?.length || 0} Found</Badge>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border sticky top-0 z-10">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User info</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={3} className="p-4 h-14 bg-muted/5"></td>
                                        </tr>
                                    ))
                                ) : filteredUsers?.map((user) => (
                                    <tr key={user.username} className="hover:bg-muted/20 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive font-bold text-xs">
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-sm">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-muted-foreground">
                                            {user.profile}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="hover:bg-primary/10 hover:text-primary border-primary/20"
                                                onClick={() => handleOpenPaymentModal(user.username, user.price)}
                                            >
                                                <DollarSign className="w-3 h-3 mr-1" />
                                                Pay Rp {user.price.toLocaleString()}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers?.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={3} className="p-10 text-center text-muted-foreground italic">
                                            No unpaid users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Record Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title="Record Customer Payment"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleRecordPayment} isLoading={recordPayment.isPending}>
                            <UserCheck className="w-4 h-4" />
                            Confirm Payment
                        </Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Recording payment for</p>
                            <p className="text-xl font-bold">{selectedUser}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Amount (IDR)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
                            <input
                                type="number"
                                className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-2xl"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[100000, 150000, 200000, 250000].map(val => (
                            <button
                                key={val}
                                className={`py-3 rounded-xl border transition-all font-bold text-sm ${amount === val
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-muted border-border hover:border-primary/50'
                                    }`}
                                onClick={() => setAmount(val)}
                            >
                                Rp {val.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <p className="text-[11px] text-muted-foreground text-center italic">
                        Confirming payment will automatically enable the user's internet service if it was previously isolated.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
