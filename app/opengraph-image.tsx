import { ImageResponse } from "next/og";

export const alt = "Shantanu Suthar — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card in the glass style (no external fonts, so it renders offline/at build).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 12% 60%, #fdba8c, transparent 45%), radial-gradient(circle at 85% 20%, #c4b5fd, transparent 45%), radial-gradient(circle at 70% 95%, #bfdbfe, transparent 45%), #f4f2f8",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: "64px 72px",
            borderRadius: 48,
            background: "rgba(255,255,255,0.6)",
            border: "2px solid rgba(255,255,255,0.8)",
            width: 980,
          }}
        >
          <div style={{ fontSize: 30, color: "#6b6b7b" }}>Portfolio</div>
          <div style={{ fontSize: 84, fontWeight: 700, color: "#18181b", letterSpacing: -2 }}>Shantanu Suthar</div>
          <div style={{ fontSize: 38, color: "#3f3f46" }}>Software Engineer · Next.js · React · TypeScript</div>
          <div style={{ fontSize: 26, color: "#6b6b7b" }}>shantanusuthar.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
