import { Events, Experience } from "../types/experiience.types"

export const events: Events[] = [
    {
        year: 2024,
        periodType: "Q",
        periodNumber: 1,
        isChecked: true,
        events: [
            { title: "Project kickoff and team formation", isChecked: true },
            { title: "Requirements gathering and analysis", isChecked: true },
            { title: "Initial system architecture design", isChecked: true },
            { title: "Technology stack selection", isChecked: true },
        ],
    },
    {
        year: 2024,
        periodType: "Q",
        periodNumber: 2,
        isChecked: true,
        events: [
            { title: "Core backend API development", isChecked: true },
            { title: "Database schema implementation", isChecked: true },
            { title: "Authentication system setup", isChecked: true },
            { title: "Frontend framework integration", isChecked: true },
        ],
    },
    {
        year: 2024,
        periodType: "Q",
        periodNumber: 3,
        isChecked: true,
        events: [
            { title: "User interface development", isChecked: true },
            { title: "API integration and testing", isChecked: true },
            { title: "Security audit and improvements", isChecked: true },
            { title: "Performance optimization", isChecked: true },
        ],
    },
    {
        year: 2024,
        periodType: "Q",
        periodNumber: 4,
        isChecked: false,
        events: [
            { title: "Beta testing with select users", isChecked: false },
            { title: "Bug fixes and refinements", isChecked: false },
            { title: "Documentation completion", isChecked: false },
            { title: "Production deployment preparation", isChecked: false },
        ],
    },
    {
        year: 2025,
        periodType: "H",
        periodNumber: 1,
        isChecked: false,
        events: [
            { title: "Public launch and marketing campaign", isChecked: false },
            { title: "User feedback collection and analysis", isChecked: false },
            { title: "Feature enhancements based on feedback", isChecked: false },
            { title: "Scaling infrastructure for growth", isChecked: false },
        ],
    },
    {
        year: 2025,
        periodType: "H",
        periodNumber: 2,
        isChecked: false,
        events: [
            { title: "Advanced features development", isChecked: false },
            { title: "Mobile app development", isChecked: false },
            { title: "Integration with third-party services", isChecked: false },
            { title: "International expansion planning", isChecked: false },
        ],
    },
]


export const experiences: Experience[] = [
    {
        year: 2023,
        period: { from: "Oct 2023", to: "Present" },
        company: "Infyni",
        position: "Associate Frontend Developer",
        location: "Gurugram, India",
        isCurrentRole: true,
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "NextAuth.js", "REST APIs"],
        events: [
            {
                title: "Built internal HR portal",
                description:
                    "Architected and developed modular UI components, advanced filter tables, and modal workflows using React and TypeScript.",
                isCompleted: true,
            },
            {
                title: "Authentication & Role Guards",
                description:
                    "Integrated secure authentication with NextAuth, handling session-based access control and protected route authorization.",
                isCompleted: true,
            },
            {
                title: "Production Optimization & Deployment",
                description:
                    "Streamlined build pipelines, resolved critical client-facing production issues, and optimized SEO benchmarks.",
                isCompleted: true,
            },
        ],
    },
    {
        year: 2023,
        period: { from: "Aug 2023", to: "Oct 2023" },
        company: "Branding Pioneers",
        position: "Frontend Developer",
        location: "Gurugram, India",
        isCurrentRole: false,
        technologies: ["React", "JavaScript", "Tailwind CSS", "Google Analytics", "Responsive UI"],
        events: [
            {
                title: "Responsive Web Interfaces",
                description:
                    "Engineered cross-browser responsive landing pages and high-conversion marketing surfaces with Tailwind CSS.",
                isCompleted: true,
            },
            {
                title: "SEO & Event Tracking",
                description:
                    "Implemented structured metadata, OpenGraph tags, and Google Analytics custom event funnels.",
                isCompleted: true,
            },
        ],
    },
    {
        year: 2023,
        period: { from: "Jul 2022", to: "May 2023" },
        company: "Masai School",
        position: "Full Stack Web Development Fellow",
        location: "Remote, India",
        isCurrentRole: false,
        technologies: ["MERN Stack", "JavaScript", "React", "Node.js", "Express", "MongoDB", "Data Structures"],
        events: [
            {
                title: "1000+ Hours Intensive Engineering",
                description:
                    "Completed rigorous hands-on full-stack engineering curriculum emphasizing DSA, system design fundamentals, and clean code.",
                isCompleted: true,
            },
            {
                title: "Collaborative Capstone Projects",
                description:
                    "Led sprint planning and Git feature-branch workflows to build end-to-end full-stack applications with authentication and database persistence.",
                isCompleted: true,
            },
        ],
    },
]


