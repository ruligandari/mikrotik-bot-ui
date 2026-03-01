import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { BillingStatus, UnpaidResponse } from '../types/api'

export function useBillingStatus(username: string) {
    return useQuery<BillingStatus>({
        queryKey: ['billing-status', username],
        queryFn: async () => {
            const response = await api.get(`/api/v1/billing/status/${username}`)
            return response.data
        },
        enabled: !!username
    })
}

export function useUnpaidUsers() {
    return useQuery<UnpaidResponse>({
        queryKey: ['unpaid-users'],
        queryFn: async () => {
            const response = await api.get('/api/v1/billing/unpaid')
            return response.data
        }
    })
}

export function useBillingActions() {
    const queryClient = useQueryClient()

    const recordPayment = useMutation({
        mutationFn: (data: { username: string; amount: number }) =>
            api.post('/api/v1/billing/record-payment', data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['billing-status', variables.username] })
            queryClient.invalidateQueries({ queryKey: ['unpaid-users'] })
            toast.success(`Payment recorded for ${variables.username}`)
        },
        onError: () => toast.error('Failed to record payment')
    })

    return { recordPayment }
}
