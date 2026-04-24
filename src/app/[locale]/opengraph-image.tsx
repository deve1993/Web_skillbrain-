import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SkillBrain — Persistent memory for AI coding teams";

type Params = Promise<{ locale: string }>;

export default async function OG({ params }: { params: Params }) {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safe, namespace: "metadata" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(at 20% 10%, rgba(124,58,237,0.35) 0, transparent 55%), radial-gradient(at 85% 0%, rgba(6,182,212,0.25) 0, transparent 50%), #07070b",
          color: "#f5f5f7",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a8a8b3",
            fontFamily: "monospace",
          }}
        >
          SkillBrain
        </div>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            maxWidth: "90%",
          }}
        >
          {t("title").split("—")[0].trim()}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#a8a8b3",
          }}
        >
          <span style={{ maxWidth: "70%" }}>{t("description")}</span>
          <span style={{ fontFamily: "monospace", color: "#9f7aea" }}>
            skillbrain.fl1.it
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
