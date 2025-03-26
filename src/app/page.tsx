import HeroSection from '@/components/home/hero/HeroSection';
import NotRisky from '@/components/home/NotRisky';
import ProcessCards from '@/components/home/ProcessCards';
import TopSurgeons from '@/components/home/TopSurgeons';
export default function Home() {
  return (
    <section>
      <HeroSection />
      <NotRisky />
      <ProcessCards />
      <TopSurgeons />
    </section>
  );
}
