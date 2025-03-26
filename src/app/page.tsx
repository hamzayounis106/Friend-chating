import FAQ from '@/components/home/FAQ';
import HeroSection from '@/components/home/hero/HeroSection';
import HomeBottom from '@/components/home/HomeBottom';
import NotRisky from '@/components/home/NotRisky';
import { PayOnce } from '@/components/home/PayOnce';
import ProcessCards from '@/components/home/ProcessCards';
import SurgeonTrust from '@/components/home/SurgeonTrust';
import TopSurgeons from '@/components/home/TopSurgeons';
export default function Home() {
  return (
    <section>
      <HeroSection />
      <NotRisky />
      <ProcessCards />
      <TopSurgeons />
      <PayOnce />
      <SurgeonTrust />
      <FAQ />
      <HomeBottom />
    </section>
  );
}
