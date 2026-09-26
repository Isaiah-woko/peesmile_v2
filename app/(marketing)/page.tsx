import type { Metadata } from "next";
import { AnatomyOfACall } from "@/components/marketing/AnatomyOfACall";
import { CallerStandard } from "@/components/marketing/CallerStandard";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Hero } from "@/components/marketing/Hero";
import { KeepsakeShowcase } from "@/components/marketing/KeepsakeShowcase";
import { MeetYourCaller } from "@/components/marketing/MeetYourCaller";
import { OccasionIndex } from "@/components/marketing/OccasionIndex";
import { ProofStrip } from "@/components/marketing/ProofStrip";
import { RealReactions } from "@/components/marketing/RealReactions";
import { TrustBlock } from "@/components/marketing/TrustBlock";

export const metadata: Metadata = {
  title: "Some things should not be a text",
  description:
    "A real human calls the person you love, at the exact minute that matters, and says the thing you cannot quite get out.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <KeepsakeShowcase />
      <AnatomyOfACall />
      <MeetYourCaller />
      <OccasionIndex />
      <RealReactions />
      <CallerStandard />
      <TrustBlock />
      <FinalCTA />
    </>
  );
}