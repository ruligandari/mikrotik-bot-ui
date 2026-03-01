import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { User, UserStatus, PPPProfile, ActionLog } from '../types/api'

export function useUsers() {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/api/v1/users')
            return response.data
        }
    })
}

export function useProfiles() {
    return useQuery<PPPProfile[]>({
        queryKey: ['ppp-profiles'],
        queryFn: async () => {
            const response = await api.get('/api/v1/profiles')
            return response.data
        },
        staleTime: 3600000 // 1 hour caching
    })
}

export function useUserStatus(username: string) {
    return useQuery<UserStatus>({
        queryKey: ['user-status', username],
        queryFn: async () => {
            const response = await api.get(`/api/v1/status/${username}`)
            return response.data
        },
        enabled: !!username,
        refetchInterval: 10000
    })
}

export function useUserLogs(username: string) {
    return useQuery<ActionLog[]>({
        queryKey: ['user-logs', username],
        queryFn: async () => {
            const response = await api.get(`/api/v1/logs/${username}`)
            return response.data
        },
        enabled: !!username,
        refetchInterval: 60000 // Refresh every minute
    })
}


export function useUserActions() {
    const queryClient = useQueryClient()

    const kickUser = useMutation({
        mutationFn: (username: string) => api.post(`/api/v1/user/kick/${username}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            toast.success('User kicked successfully')
        },
        onError: () => toast.error('Failed to kick user')
    })

    const deleteUser = useMutation({
        mutationFn: (username: string) => api.delete(`/api/v1/user/${username}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User deleted successfully')
        },
        onError: () => toast.error('Failed to delete user')
    })

    const setQuota = useMutation({
        mutationFn: ({ username, limit_gb }: { username: string; limit_gb: number }) =>
            api.post('/api/v1/user/set-limit', { username, limit_gb }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-status', variables.username] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success(`Limit set to ${variables.limit_gb}GB`)
        },
        onError: () => toast.error('Failed to update limit')
    })

    const toggleFup = useMutation({
        mutationFn: ({ username, enabled }: { username: string; enabled: boolean }) =>
            api.post('/api/v1/user/toggle-fup', { username, enabled }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-status', variables.username] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success(`FUP ${variables.enabled ? 'enabled' : 'disabled'}`)
        },
        onError: () => toast.error('Action failed')
    })

    const addUser = useMutation({
        mutationFn: (data: any) => api.post('/api/v1/user/add', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User added successfully')
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to add user')
    })

    const forceThrottle = useMutation({
        mutationFn: (username: string) => api.post(`/api/v1/user/force-throttle/${username}`),
        onSuccess: (_, username) => {
            queryClient.invalidateQueries({ queryKey: ['user-status', username] })
            toast.success(`${username} throttled manually`)
        }
    })

    const forceNormal = useMutation({
        mutationFn: (username: string) => api.post(`/api/v1/user/force-normal/${username}`),
        onSuccess: (_, username) => {
            queryClient.invalidateQueries({ queryKey: ['user-status', username] })
            toast.success(`${username} set to normal speed`)
        }
    })

    const updateUser = useMutation({
        mutationFn: (data: { username: string; whatsapp?: string }) => api.post('/api/v1/user/update', data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-status', variables.username] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success(`User ${variables.username} updated successfully`)
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update user')
    })

    return { kickUser, deleteUser, setQuota, toggleFup, addUser, forceThrottle, forceNormal, updateUser }
}
