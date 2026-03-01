import React, { ReactNode } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("glass-card rounded-2xl p-6 shadow-xl", className)}>
            {children}
        </div>
    )
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = "primary"
}: {
    title: string
    value: string | number
    icon: React.ElementType
    description?: string
    trend?: { value: string; positive: boolean }
    color?: "primary" | "success" | "destructive" | "warning" | "muted"
}) {
    const colorMap = {
        primary: "text-primary bg-primary/10 border-primary/20",
        success: "text-success bg-success/10 border-success/20",
        destructive: "text-destructive bg-destructive/10 border-destructive/20",
        warning: "text-warning bg-warning/10 border-warning/20",
        muted: "text-muted-foreground bg-muted border-border"
    }

    return (
        <Card className="relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-3xl font-bold mt-1 tracking-tight">{value}</h3>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                    {trend && (
                        <p className={cn(
                            "text-xs font-medium mt-2 flex items-center gap-1",
                            trend.positive ? "text-success" : "text-destructive"
                        )}>
                            {trend.value}
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl border transition-transform group-hover:scale-110 duration-300", colorMap[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className={cn(
                "absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full",
                color === "primary" ? "bg-primary" :
                    color === "success" ? "bg-success" :
                        color === "destructive" ? "bg-destructive" :
                            color === "warning" ? "bg-warning" : "bg-muted"
            )}></div>
        </Card>
    )
}

export function Badge({
    children,
    variant = "primary",
    className
}: {
    children: ReactNode;
    variant?: "primary" | "success" | "destructive" | "warning" | "muted"
    className?: string
}) {
    const variants = {
        primary: "bg-primary/20 text-primary border-primary/20",
        success: "bg-success/20 text-success border-success/20",
        destructive: "bg-destructive/20 text-destructive border-destructive/20",
        warning: "bg-warning/20 text-warning border-warning/20",
        muted: "bg-muted text-muted-foreground border-border"
    }

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1",
            variants[variant],
            className
        )}>
            {children}
        </span>
    )
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    isLoading,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline"
    size?: "sm" | "md" | "lg" | "icon"
    isLoading?: boolean
}) {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        outline: "bg-transparent border border-border hover:bg-muted text-foreground"
    }

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2"
    }

    return (
        <button
            className={cn(
                "rounded-xl font-medium transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ) : children}
        </button>
    )
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer
}: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer?: ReactNode
}) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <Card className="w-full max-w-md z-10 animate-in zoom-in-95 fade-in duration-200 shadow-2xl border-white/10 ring-1 ring-white/20">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mt-2">{children}</div>

                {footer && (
                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
                        {footer}
                    </div>
                )}
            </Card>
        </div>
    )
}
