import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/primitives/Button";
import { getOccasionBySlug } from "@/lib/services/occasions";
import { Reveal } from "@/components/marketing/Reveal";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const occasion = await getOccasionBySlug(slug);
  if (!occasion) return { title: "Occasion not found" };
  return {
    title: occasion.name,
    description: occasion.description ?? occasion.kicker ?? undefined,
  };
}

export default async function OccasionDetailPage({ params }: Props) {
  const { slug } = await params;
  const occasion = await getOccasionBySlug(slug);
  if (!occasion || !occasion.isActive) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20">
      <Reveal>
        <p className="mono-label text-body-small text-ember">Occasion</p>
        <h1 className="display-serif text-display-5 mt-3 text-ink">{occasion.name}</h1>
        {occasion.kicker ? (
          <p className="display-serif text-title-2 italic text-clay mt-4">{occasion.kicker}</p>
        ) : null}
        {occasion.description ? (
          <p className="text-body-0 text-ink-soft measure mt-6">{occasion.description}</p>
        ) : null}
      </Reveal>

      <Reveal delay={0.1}>
        {/* PHOTO: warm hero image for this occasion */}
        <div className="aspect-16/7 w-full rounded-lg bg-linear-to-br from-sunrise to-honey mt-12" />
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-12 flex flex-col items-start gap-4">
          <Button asChild size="lg">
            <Link href={`/book?occasion=${occasion.slug}`}>Book this call</Link>
          </Button>
          <p className="text-body-small text-ash">
            Takes about 4 minutes. You pick the exact minute.
          </p>
        </div>
      </Reveal>
    </div>
  );
}