export interface VercelBadgeProps {
    status?: "success" | "building" | "failed" | "error" | "checking" | "unknown"
    url?: string
    showStatus?: boolean
}