import { prisma } from "@/lib/prisma";

const OCCASIONS = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    slug: "birthday",
    name: "Birthdays",
    kicker: "The day they deserve to hear it.",
    description: "A call that makes their birthday feel personal, not procedural.",
    sortOrder: 1,
    requiresReveal: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    slug: "apology",
    name: "Apologies",
    kicker: "For the words you cannot send as a text.",
    description: "A real voice carries what a message cannot.",
    sortOrder: 2,
    requiresReveal: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    slug: "congratulations",
    name: "Congratulations",
    kicker: "Mark the moment before it passes.",
    description: "Promotions, engagements, good news worth a voice.",
    sortOrder: 3,
    requiresReveal: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    slug: "long-distance",
    name: "Long Distance",
    kicker: "Close the gap for three minutes.",
    description: "For the person who is far away and feels it.",
    sortOrder: 4,
    requiresReveal: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111105",
    slug: "prank",
    name: "Pranks",
    kicker: "Harmless chaos, revealed with care.",
    description: "A playful call with a guaranteed reveal before the end.",
    sortOrder: 5,
    requiresReveal: true,
  },
  {
    id: "11111111-1111-4111-8111-111111111106",
    slug: "encouragement",
    name: "Encouragement",
    kicker: "For someone mid-fight.",
    description: "Exams, interviews, hard weeks. A voice that believes in them.",
    sortOrder: 6,
    requiresReveal: false,
  },
] as const;

const PACKAGES = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    slug: "classic",
    name: "Classic",
    tagline: "One call. Up to 5 minutes.",
    maxDurationSec: 300,
    includesKeepsake: false,
    sortOrder: 1,
    includes: ["One improvised call", "Written debrief to you"],
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    slug: "signature",
    name: "Signature",
    tagline: "Up to 8 minutes, plus the Keepsake recording.",
    maxDurationSec: 480,
    includesKeepsake: true,
    sortOrder: 2,
    includes: ["One improvised call", "Keepsake recording", "Written debrief to you"],
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    slug: "masterpiece",
    name: "Masterpiece",
    tagline: "Up to 12 minutes. Full research. The Keepsake, mastered.",
    maxDurationSec: 720,
    includesKeepsake: true,
    sortOrder: 3,
    includes: [
      "Extended improvised call",
      "Deep brief review and prep",
      "Keepsake recording",
      "Backup window included",
    ],
  },
] as const;

// Prices are integer minor units. Zero-decimal currencies like JPY use the whole unit.
const PRICES: Record<string, Record<string, number>> = {
  classic: { NGN: 2500000, USD: 1500, GBP: 1200, EUR: 1400, CAD: 2000, AUD: 2300, ZAR: 28000, KES: 195000, GHS: 23000, JPY: 2200 },
  signature: { NGN: 4500000, USD: 2900, GBP: 2300, EUR: 2700, CAD: 3900, AUD: 4400, ZAR: 54000, KES: 375000, GHS: 44000, JPY: 4300 },
  masterpiece: { NGN: 8000000, USD: 4900, GBP: 3900, EUR: 4600, CAD: 6600, AUD: 7400, ZAR: 92000, KES: 640000, GHS: 75000, JPY: 7300 },
};

const TALENT_ID = "33333333-3333-4333-8333-333333333301";

const SAMPLES = [
  { title: "Warm birthday", tone: "warm" as const, occasionSlug: "birthday", durationMs: 42000, file: "sample-warm.mp3" },
  { title: "Playful prank", tone: "playful" as const, occasionSlug: "prank", durationMs: 38000, file: "sample-playful.mp3" },
  { title: "Tender apology", tone: "tender" as const, occasionSlug: "apology", durationMs: 51000, file: "sample-tender.mp3" },
  { title: "Bold congratulations", tone: "bold" as const, occasionSlug: "congratulations", durationMs: 35000, file: "sample-bold.mp3" },
];

function placeholderPeaks(): number[] {
  return Array.from({ length: 64 }, (_, i) => {
    const value = Math.abs(Math.sin(i * 0.35)) * 0.7 + 0.15;
    return Number(value.toFixed(3));
  });
}

async function seedOccasions() {
  for (const occasion of OCCASIONS) {
    await prisma.occasion.upsert({
      where: { slug: occasion.slug },
      create: { ...occasion },
      update: { ...occasion },
    });
  }
}

async function seedPackages() {
  for (const pkg of PACKAGES) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      create: {
        id: pkg.id,
        slug: pkg.slug,
        name: pkg.name,
        tagline: pkg.tagline,
        maxDurationSec: pkg.maxDurationSec,
        includesKeepsake: pkg.includesKeepsake,
        sortOrder: pkg.sortOrder,
        includes: pkg.includes,
      },
      update: {
        name: pkg.name,
        tagline: pkg.tagline,
        maxDurationSec: pkg.maxDurationSec,
        includesKeepsake: pkg.includesKeepsake,
        sortOrder: pkg.sortOrder,
        includes: pkg.includes,
      },
    });

    await prisma.packagePrice.deleteMany({ where: { packageId: pkg.id } });

    const prices = PRICES[pkg.slug];
    for (const [currency, amount] of Object.entries(prices)) {
      await prisma.packagePrice.create({
        data: { packageId: pkg.id, currency, amount },
      });
    }
  }
}

async function seedTalent() {
  await prisma.voiceTalent.upsert({
    where: { slug: "adaeze" },
    create: {
      id: TALENT_ID,
      slug: "adaeze",
      displayName: "Adaeze",
      headline: "The voice behind every PeeSmile call.",
      bio: "I have spent years on the phone with strangers who became friends in three minutes. I do not read scripts. I listen, and I make the call feel like it was always meant to happen.",
      accent: "Lagos, warm and clear",
      languages: ["en", "pcm"],
      vibeTags: ["Warm", "Playful", "Tender", "Deadpan"],
      voiceGender: "female",
      callsDelivered: 0,
    },
    update: {
      displayName: "Adaeze",
      headline: "The voice behind every PeeSmile call.",
      bio: "I have spent years on the phone with strangers who became friends in three minutes. I do not read scripts. I listen, and I make the call feel like it was always meant to happen.",
    },
  });

  const peaks = placeholderPeaks();

  for (const [index, sample] of SAMPLES.entries()) {
    const occasion = await prisma.occasion.findUnique({
      where: { slug: sample.occasionSlug },
      select: { id: true },
    });

    await prisma.voiceSample.upsert({
      where: { id: `44444444-4444-4444-8444-44444444440${index + 1}` },
      create: {
        id: `44444444-4444-4444-8444-44444444440${index + 1}`,
        talentId: TALENT_ID,
        title: sample.title,
        occasionId: occasion?.id ?? null,
        tone: sample.tone,
        audioUrl: `/audio/samples/${sample.file}`,
        durationMs: sample.durationMs,
        peaks,
        sortOrder: index,
      },
      update: {
        title: sample.title,
        tone: sample.tone,
        durationMs: sample.durationMs,
        sortOrder: index,
      },
    });
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "owner@peesmile.com";

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: "Owner",
      role: "admin",
    },
    update: { role: "admin" },
  });
}

async function main() {
  await seedOccasions();
  await seedPackages();
  await seedTalent();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });