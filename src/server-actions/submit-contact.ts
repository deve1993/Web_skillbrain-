"use server";

import { z } from "zod";
import { Resend } from "resend";

const CONTACT_TO = "daniel@pixarts.eu";
const CONTACT_FROM = process.env.RESEND_FROM ?? "SkillBrain <onboarding@resend.dev>";

export const ContactSchema = z.object({
  name: z.string().trim().min(1, "nameRequired"),
  email: z.string().trim().email("emailInvalid"),
  company: z.string().trim().max(120).optional().default(""),
  teamSize: z.enum(["solo", "small", "medium", "large"]),
  message: z.string().trim().min(10, "messageMin").max(4000),
  earlyAccess: z.boolean().optional().default(false),
  locale: z.enum(["it", "en", "cs"]),
});

export type ContactInput = z.input<typeof ContactSchema>;
export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    teamSize: formData.get("teamSize"),
    message: formData.get("message"),
    earlyAccess: formData.get("earlyAccess") === "on",
    locale: formData.get("locale"),
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string") fieldErrors[path] = issue.message;
    }
    return { status: "error", message: "validation", fieldErrors };
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY missing — logging instead of sending.\n",
      data,
    );
    return { status: "success" };
  }

  const resend = new Resend(apiKey);
  const subject = `[SkillBrain] ${data.earlyAccess ? "🚀 Early access" : "👋 Lead"}: ${data.name} — ${data.company || "—"}`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui; background:#07070b; color:#f5f5f7; padding:32px; border-radius:16px; max-width:560px;">
      <h2 style="margin:0 0 24px; font-family:Georgia, serif; font-weight:400; font-size:28px;">New SkillBrain lead</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; color:#a8a8b3; width:120px;">Name</td><td style="padding:8px 0;">${escape(data.name)}</td></tr>
        <tr><td style="padding:8px 0; color:#a8a8b3;">Email</td><td style="padding:8px 0;"><a href="mailto:${escape(data.email)}" style="color:#9f7aea;">${escape(data.email)}</a></td></tr>
        <tr><td style="padding:8px 0; color:#a8a8b3;">Company</td><td style="padding:8px 0;">${escape(data.company || "—")}</td></tr>
        <tr><td style="padding:8px 0; color:#a8a8b3;">Team size</td><td style="padding:8px 0;">${data.teamSize}</td></tr>
        <tr><td style="padding:8px 0; color:#a8a8b3;">Locale</td><td style="padding:8px 0;">${data.locale}</td></tr>
        <tr><td style="padding:8px 0; color:#a8a8b3;">Early access</td><td style="padding:8px 0;">${data.earlyAccess ? "✅ Yes" : "—"}</td></tr>
      </table>
      <hr style="border:none; border-top:1px solid #1e1e2e; margin:24px 0;" />
      <p style="color:#a8a8b3; font-size:13px; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 12px;">Message</p>
      <p style="white-space:pre-wrap; margin:0; line-height:1.6;">${escape(data.message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: data.email,
      subject,
      html,
      text: `${data.name} <${data.email}>\nCompany: ${data.company || "—"}\nTeam: ${data.teamSize}\nEarly access: ${data.earlyAccess}\n\n${data.message}`,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return { status: "error", message: "send" };
    }

    return { status: "success" };
  } catch (e) {
    console.error("[contact] unexpected error", e);
    return { status: "error", message: "send" };
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
