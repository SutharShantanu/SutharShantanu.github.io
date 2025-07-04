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
        location: "Gurugram",
        isCurrentRole: true,
        events: [
            {
                title: "Built internal HR portal",
                description:
                    "Developed reusable UI components, filters, and modals using React and TypeScript.",
                isCompleted: true,
            },
            {
                title: "Authentication Integration",
                description:
                    "Implemented secure login with NextAuth and session-based access control.",
                isCompleted: true,
            },
            {
                title: "Cross-functional Collaboration",
                description:
                    "Managed client support and contributed to SEO and product deployment.",
                isCompleted: true,
            },
        ],
    },
    {
        year: 2023,
        period: { from: "Aug 2023", to: "Oct 2023" },
        company: "Branding Pioneers",
        position: "Frontend Developer",
        location: "Gurugram",
        isCurrentRole: false,
        events: [
            {
                title: "Developed Responsive UIs",
                description:
                    "Built landing pages and reusable components with React and Tailwind CSS.",
                isCompleted: true,
            },
            {
                title: "SEO & Analytics Integration",
                description:
                    "Integrated SEO features and third-party tools like Google Analytics.",
                isCompleted: true,
            },
        ],
    },
    {
        year: 2023,
        period: { from: "July 2022", to: "May 2023" },
        company: "Masai School",
        position: "Full Stack Web Development",
        location: "Remote",
        isCurrentRole: false,
        events: [
            {
                title: "Completed Coding Curriculum",
                description:
                    "Practiced 1000+ hours of coding across full-stack technologies.",
                isCompleted: true,
            },
            {
                title: "Built E-commerce Project",
                description:
                    "Developed a functional e-commerce clone with product listing and authentication.",
                isCompleted: true,
            },
            {
                title: "Mastered DSA & Agile",
                description:
                    "Solved coding problems and collaborated on projects using Git and Agile.",
                isCompleted: true,
            },
        ],
    },
]


