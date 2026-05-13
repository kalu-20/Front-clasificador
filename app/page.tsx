import { Hero } from '@/components/home/hero';
import { MarqueeBand } from '@/components/home/marquee-band';
import { HowItWorks } from '@/components/home/how-it-works';
import { Categories } from '@/components/home/categories';
import { Pillars } from '@/components/home/pillars';
import { CTA } from '@/components/home/cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeBand />
      <HowItWorks />
      <Categories />
      <Pillars />
      <CTA />
    </>
  );
}
