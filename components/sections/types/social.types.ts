
export interface SocialProps {
    github: GitHubUser
    linkedin: LinkedInProfile
}
export interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type?: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username?: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    plan?: {
        name: string;
        space: number;
        collaborators: number;
        private_repos: number;
    };
    contributions?: GitHubActivityDay[];
    totalCommits?: GitHubActivityTotals;
    recentActivities?: GitHubActivityEvent[];
    topLanguages?: GithubLanguages;
}
export interface GithubLanguages {
    [lang: string]: number;
}
export interface GitHubActivityDay {
    date: string;
    count: number;
    level: number;
}

export interface GitHubCalendarProps {
    data: GitHubActivityDay[];
};


export interface GitHubActivityTotals {
    [year: string]: number;
}

export interface GitHubCommitAuthor {
    email: string;
    name: string;
}

export interface GitHubCommit {
    sha: string;
    author: GitHubCommitAuthor;
    message: string;
    distinct: boolean;
    url: string;
}

export interface GitHubActivityPayload {
    repository_id: number;
    push_id: number;
    size: number;
    distinct_size: number;
    ref: string;
    head: string;
    before: string;
    commits: GitHubCommit[];
}

export interface GitHubRepo {
    id: number;
    name: string;
    url: string;
}

export interface GitHubActor {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
}

export interface GitHubActivityEvent {
    id: string;
    type: string;
    actor: GitHubActor;
    repo: GitHubRepo;
    payload: GitHubActivityPayload;
    public: boolean;
    created_at: string;
}


export interface GitHubUserExtended extends GitHubUser {
    contributions: GitHubActivityDay[];
    totalCommits: GitHubActivityTotals;
    recentActivities: GitHubActivityEvent[];
    topLanguages?: GithubLanguages;

}

export interface LinkedInProfile {
    about: string;
    certifications: Certification[];
    city: string;
    company: string;
    company_description: string;
    company_domain: string;
    company_employee_count: number;
    company_employee_range: string;
    company_industry: string;
    company_linkedin_url: string;
    company_logo_url: string;
    company_website: string;
    company_year_founded: number;
    connection_count: number;
    country: string;
    current_company_join_month: number;
    current_company_join_year: number;
    current_job_duration: string;
    educations: Education[];
    email: string;
    experiences: Experience[];
    first_name: string;
    follower_count: number;
    full_name: string;
    headline: string;
    hq_city: string;
    hq_country: string;
    hq_region: string;
    is_creator: boolean;
    is_influencer: boolean;
    is_premium: boolean;
    is_verified: boolean;
    job_title: string;
    languages: Language[];
    last_name: string;
    linkedin_url: string;
    location: string;
    phone: string;
    profile_id: string;
    profile_image_url: string;
    profile_status: ProfileStatus;
    public_id: string;
    school: string;
    state: string;
    urn: string;
    recommendations_received: Recommendation[];

}
export interface Recommendation {
    profile_url: string;
    text: string;
    username?: string;
}

export interface Certification {
    authority: string;
    issued: string;
    name: string;
    url: string;
}

export interface Education {
    activities: string;
    date_range: string;
    degree: string;
    end_month: string;
    end_year: number;
    field_of_study: string;
    school: string;
    school_id: string;
    school_linkedin_url: string;
    school_logo_url: string;
    start_month: string;
    start_year: number;
}

export interface Experience {
    company: string;
    company_id: string;
    company_linkedin_url: string;
    company_logo_url: string;
    company_public_url: string;
    date_range: string;
    description: string;
    duration: string;
    end_month: number | string;
    end_year: number | string;
    is_current: boolean;
    job_type: string;
    location: string;
    skills: string;
    start_month: number;
    start_year: number;
    title: string;
}

export interface Language {
    name: string;
    proficiency: string;
}

export interface ProfileStatus {
    contact_info_updated: string;
    joined_date: string;
    profile_photo_updated: string;
    verified: boolean;
    verifications: {
        description: string;
        method: string;
        time: string;
    }[];
}