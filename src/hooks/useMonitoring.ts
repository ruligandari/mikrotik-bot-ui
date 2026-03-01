import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { SummaryResponse, Session, User } from '../types/api'

export function useSummary() {
    return useQuery<SummaryResponse>({
        queryKey: ['summary'],
        queryFn: async () => {
            const response = await api.get('/api/v1/summary')
            return response.data
        },
        refetchInterval: 30000, // 30 seconds
    })
}

export function useSessions() {
    return useQuery<Session[]>({
        queryKey: ['sessions'],
        queryFn: async () => {
            const response = await api.get('/api/v1/sessions')
            // MikroTik raw response uses 'name' and 'remote-address'
            return response.data.map((s: any) => ({
                username: s.username || s.name || 'Unknown',
                address: s.address || s['remote-address'] || '0.0.0.0',
                uptime: s.uptime || '0s'
            }))
        },
        refetchInterval: 15000,
    })
}

export function useThrottled() {
    return useQuery<User[]>({
        queryKey: ['throttled'],
        queryFn: async () => {
            const response = await api.get('/api/v1/throttled')
            return response.data
        },
        refetchInterval: 30000,
    })
}

export function useCheckFup() {
    return useMutation({
        mutationFn: () => api.post('/api/v1/check-now'),
        onSuccess: (response: any) => {
            if (response.data?.messages && response.data.messages.length > 0) {
                toast.success(`FUP Check Complete: ${response.data.messages.length} actions taken.`)
            } else {
                toast.success('FUP Check Complete: All users normal.')
            }
        },
        onError: () => toast.error('Failed to run FUP check')
    })
}
