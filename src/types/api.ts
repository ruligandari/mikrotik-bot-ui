export interface SummaryResponse {
    month: string
    total_usage_gb: number
    top_users: {
        username: string
        usage_gb: number
    }[]
}

export interface User {
    username: string
    enabled: boolean
    threshold_gb: number
    package_name?: string
    whatsapp?: string
}

export interface UserStatus {
    username: string
    usage_gb: number
    threshold_gb: number
    enabled: boolean
    state: "normal" | "throttled"
    last_action: string
    package_name?: string
    price?: number
    profile?: string
    whatsapp?: string
    remote_address?: string
}

export interface Session {
    username: string
    address: string
    uptime: string
}

export interface ActionLog {
    ts: string
    action: string
    detail: string
}

export interface PPPProfile {
    profile: string
    package_name: string
    price: number
    local_address?: string
    remote_address?: string
}

export interface BillingStatus {
    username: string
    month: string
    is_paid: boolean
    amount_paid: number
    updated_at: string
}

export interface UnpaidResponse {
    month: string
    unpaid_count: number
    total_piutang: number
    users: {
        username: string
        profile: string
        price: number
    }[]
}
