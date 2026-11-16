import { useEffect } from 'react';
import { Hero } from '@/sections/Hero';
import { ServiceBento } from '@/sections/ServiceBento';
import { SiteRail } from '@/sections/SiteRail';
import { StatsBento } from '@/sections/StatsBento';
import { ConsultForm } from '@/sections/ConsultForm';
import { WhySection } from '@/sections/WhySection';
import { CtaBanner } from '@/sections/CtaBanner';

export const LANDING_TITLE = '공장 지붕 태양광 임대 | 부산·울산·경남 | 케이파워 솔라';

export function LandingPage() {
  useEffect(() => {
    document.title = LANDING_TITLE;
  }, []);

  return (
    <>
      <Hero />
      <ServiceBento />
      <SiteRail />
      <StatsBento />
      <ConsultForm />
      <WhySection />
      <CtaBanner />
    </>
  );
}
