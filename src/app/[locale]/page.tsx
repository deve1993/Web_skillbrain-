import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/layout/nav";
import { Hero } from "@/components/sections/hero";
import { Shift } from "@/components/sections/shift";
import { Pillars } from "@/components/sections/pillars";
import { Flow } from "@/components/sections/flow";
import { Graph } from "@/components/sections/graph";
import { Team } from "@/components/sections/team";
import { Future } from "@/components/sections/future";
import { Proof } from "@/components/sections/proof";
import { OpenSource } from "@/components/sections/opensource";
import { Call } from "@/components/sections/call";
import { Footer } from "@/components/sections/footer";

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shift />
        <Pillars />
        <Flow />
        <Graph />
        <Team />
        <Future />
        <Proof />
        <OpenSource />
        <Call />
      </main>
      <Footer />
    </>
  );
}
