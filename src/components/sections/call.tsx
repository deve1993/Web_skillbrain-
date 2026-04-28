"use client";

import { useActionState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContact, type ContactState } from "@/server-actions/submit-contact";

const INITIAL: ContactState = { status: "idle" };

const teamSizes = ["solo", "small", "medium", "large"] as const;

export function Call() {
  const t = useTranslations("sections.call");
  const f = useTranslations("form");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitContact, INITIAL);
  const formId = useId();

  const fieldError = (name: string) =>
    state.status === "error" && state.fieldErrors?.[name]
      ? (f(`validation.${state.fieldErrors[name]}` as "validation.nameRequired") as string)
      : null;

  return (
    <section id="call" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16">
        <div className="lg:sticky lg:top-32 h-fit">
          <p className="font-mono uppercase tracking-[0.2em] text-xs text-muted mb-6">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-8 text-lg text-muted leading-relaxed">{t("body")}</p>

          <ul className="mt-10 space-y-3">
            {(t.raw("bullets") as string[]).map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <span
                  className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0 shadow-glow"
                  aria-hidden
                />
                {b}
              </li>
            ))}
          </ul>

          <p className="mt-10 font-mono text-xs text-subtle uppercase tracking-wider">
            {t("trust")}
          </p>
        </div>

        <form
          id={formId}
          action={action}
          className="rounded-2xl border border-border bg-surface p-8 md:p-10 space-y-5"
          noValidate
        >
          <input type="hidden" name="locale" value={locale} />

          <Field
            label={f("name")}
            name="name"
            placeholder={f("namePlaceholder")}
            error={fieldError("name")}
            required
          />
          <Field
            label={f("email")}
            name="email"
            type="email"
            placeholder={f("emailPlaceholder")}
            error={fieldError("email")}
            required
          />
          <Field
            label={f("company")}
            name="company"
            placeholder={f("companyPlaceholder")}
            error={fieldError("company")}
          />

          <div className="space-y-2">
            <label className="block text-sm text-muted">{f("teamSize")}</label>
            <div className="grid grid-cols-4 gap-2">
              {teamSizes.map((size, i) => (
                <label
                  key={size}
                  className="group relative"
                >
                  <input
                    type="radio"
                    name="teamSize"
                    value={size}
                    defaultChecked={i === 1}
                    className="peer sr-only"
                    required
                  />
                  <span className="block text-center px-3 py-2.5 rounded-lg border border-border text-sm font-medium text-muted cursor-pointer transition-colors duration-300 peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-foreground hover:border-accent/50 hover:text-foreground">
                    {f(`teamSizes.${size}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor={`${formId}-message`} className="block text-sm text-muted">
              {f("message")}
            </label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={4}
              required
              minLength={10}
              placeholder={f("messagePlaceholder")}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-subtle focus:border-accent focus:outline-none transition-colors resize-y"
            />
            {fieldError("message") && (
              <p className="text-danger text-xs">{fieldError("message")}</p>
            )}
          </div>

          <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
            <input
              type="checkbox"
              name="earlyAccess"
              className="mt-1 h-4 w-4 rounded border-border bg-background checked:bg-accent checked:border-accent appearance-none relative cursor-pointer"
            />
            <span>{f("earlyAccess")}</span>
          </label>

          <button
            type="submit"
            disabled={pending}
            className="w-full px-6 py-3.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? f("submitting") : f("submit")}
          </button>

          {state.status === "success" && (
            <div className="rounded-lg border border-accent/40 bg-accent/10 p-4">
              <p className="font-medium text-foreground">{f("successTitle")}</p>
              <p className="text-sm text-muted mt-1">{f("successBody")}</p>
            </div>
          )}
          {state.status === "error" && state.message !== "validation" && (
            <div className="rounded-lg border border-danger/40 bg-danger/10 p-4">
              <p className="font-medium text-foreground">{f("errorTitle")}</p>
              <p className="text-sm text-muted mt-1">{f("errorBody")}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-subtle focus:border-accent focus:outline-none transition-colors"
      />
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
