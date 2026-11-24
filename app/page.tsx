import visibility from "@/config/portfolio-visibility.json";
import { PortfolioShell } from "@/components/shell/portfolio-shell";
import { LINKEDIN_USERNAME, NEXT_GITHUB_USERNAME } from "@/components/sections/constants/social.constant";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Home() {
  const data = await getPortfolioData(
    process.env.NEXT_GITHUB_USERNAME ?? NEXT_GITHUB_USERNAME,
    process.env.LINKEDIN_USERNAME ?? LINKEDIN_USERNAME
  );
  // Structured data so search engines and AI agents can read who this is.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.name,
    url: "https://shantanusuthar.vercel.app",
    image: "https://shantanusuthar.vercel.app/avatar.webp",
    jobTitle: data.profile.jobTitle,
    worksFor: { "@type": "Organization", name: data.profile.company },
    address: { "@type": "PostalAddress", addressLocality: data.profile.location },
    email: "mailto:shantanusut2000@gmail.com",
    sameAs: [data.github.url, data.profile.linkedinUrl],
    knowsAbout: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HeroUI", "Node.js", "MongoDB"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here; escape "<" so data can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PortfolioShell data={data} visibility={visibility} />
    </>
  );
}
