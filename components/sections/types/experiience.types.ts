export interface Event {
    title: string
    isChecked: boolean
}

export interface Events {
    year: number
    periodType: "Q" | "H"
    periodNumber: number
    isChecked: boolean
    events: Event[]
}

export interface ExperienceEvent {
    title: string
    description?: string
    isCompleted: boolean
}

export interface Experience {
    year: number
    period: { from: string; to: string }
    company: string
    position: string
    location: string
    isCurrentRole: boolean
    events: ExperienceEvent[]
}
