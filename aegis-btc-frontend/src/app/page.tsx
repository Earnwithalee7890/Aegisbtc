import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ActivityFeed from "@/components/ActivityFeed";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full relative">
      <Hero />
      <Stats />
      <ActivityFeed />
      <FAQ />
    </div>
  );
}
