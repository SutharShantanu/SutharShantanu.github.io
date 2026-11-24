import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shantanu Suthar — Software Engineer",
    short_name: "Shantanu",
    description: "Portfolio of Shantanu Suthar, Software Engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2f8",
    theme_color: "#f4f2f8",
    icons: [{ src: "/avatar.webp", sizes: "192x192", type: "image/webp" }],
  };
}
