import { ReactNode } from "react"

export interface SectionHeaderProps {
    title: string
    description?: string
    center?: boolean
    icon?: ReactNode
}