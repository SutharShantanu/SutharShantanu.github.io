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
        period: {
            from: "Oct 2023",
            to: "Present"
        },
        company: "Infyni",
        position: "Associate Frontend Developer",
        location: "Gurugram",
        isCurrentRole: true,
        events: [
            {
                title: "Built internal HR portal from scratch",
                description:
                    "Developed and maintained reusable UI components, custom table filters, dynamic form validation, and modal interactions using React, TypeScript, Tailwind CSS, and Zod.",
                isCompleted: true,
            },
            {
                title: "Authentication and session integration",
                description:
                    "Implemented secure login with NextAuth using email-password credentials and session-based access control. Integrated forgot-password flows with modal-based UX.",
                isCompleted: true,
            },
            {
                title: "Modular app architecture",
                description:
                    "Refactored Next.js layout and component structure to support conditional rendering of headers, footers, and sidebars based on page route.",
                isCompleted: true,
            },
            {
                title: "Multi-role contribution beyond development",
                description:
                    "Managed client support operations, onboarding, and training for NHIT and Support Champion roles while assisting in SEO and product deployment tasks.",
                isCompleted: true,
            },
            {
                title: "Consistent involvement in all IT projects",
                description:
                    "Actively contributed to every internal IT project since joining—participating in UI/UX planning, testing, and feedback cycles.",
                isCompleted: true,
            },
            {
                title: "Recognized for cross-functional reliability",
                description:
                    "Received client appreciation and internal recognition for quick resolution times, quality work, and consistent ownership across tech and support functions.",
                isCompleted: true,
            },
        ],
    },
    {
        year: 2023,
        period: {
            from: "Aug 2023",
            to: "Oct 2023"
        },
        company: "Branding Pioneers",
        position: "Frontend Developer",
        location: "Gurugram",
        isCurrentRole: false,
        events: [
            {
                title: "Developed responsive UI components",
                description:
                    "Implemented pixel-perfect landing pages and reusable UI blocks with React and Tailwind CSS based on Figma designs.",
                isCompleted: true,
            },
            {
                title: "Integrated third-party tools",
                description:
                    "Connected analytics, form handlers, and marketing integrations such as Google Analytics and HubSpot.",
                isCompleted: true,
            },
            {
                title: "SEO-friendly page builds",
                description:
                    "Optimized meta tags, heading structures, and performance for enhanced search visibility and user experience.",
                isCompleted: true,
            },
            {
                title: "Collaborated with cross-functional teams",
                description:
                    "Worked with design, development, and marketing teams to ensure timely delivery of client web projects.",
                isCompleted: true,
            },
        ],
    },
    {
        year: 2023,
        period: {
            from: "July 2022",
            to: "May 2023"
        },
        company: "Masai School",
        position: "Full Stack Web Development",
        location: "Remote",
        isCurrentRole: false,
        events: [
            {
                title: "Completed 1000+ hours of coding",
                description:
                    "Practiced hands-on coding through structured daily assignments, hackathons, and live classes covering HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB.",
                isCompleted: true,
            },
            {
                title: "Group Project: E-commerce Platform Clone",
                description:
                    "Collaborated with a team to build a functional clone of an Indian online store specializing in designer mobile cases and laptop sleeves. Implemented key features like product listings, filtering, cart, wishlist, authentication (JWT), and responsive design.",
                isCompleted: true,
            },
            {
                title: "Frontend and Backend Integration",
                description:
                    "Integrated RESTful APIs with frontend components using React and Redux. Handled user authentication, product CRUD operations, and data flow between client and server.",
                isCompleted: true,
            },
            {
                title: "Mastered Data Structures and Algorithms",
                description:
                    "Solved 300+ problems on arrays, strings, recursion, linked lists, stacks, and sorting to strengthen logical and algorithmic thinking.",
                isCompleted: true,
            },
            {
                title: "Agile Development & Git Collaboration",
                description:
                    "Worked in sprints using Trello for task tracking. Practiced code versioning and collaboration through Git and GitHub, conducting daily standups and peer code reviews.",
                isCompleted: true,
            },
            {
                title: "Soft Skills and Mock Interviews",
                description:
                    "Participated in weekly soft skill sessions, mock interviews, and resume-building workshops to improve communication and interview readiness.",
                isCompleted: true,
            },
        ],
    }

];

