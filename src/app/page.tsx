import FAQ from '@/components/home/FAQ';
import HeroSection from '@/components/home/hero/HeroSection';
import HomeBottom from '@/components/home/HomeBottom';
import HomeJobForm from '@/components/home/HomeJobForm';
import NotRisky from '@/components/home/NotRisky';
import PayOnce from '@/components/home/PayOnce';
import PricingPlans from '@/components/home/pricing/PricingPlans';
import ProcessCards from '@/components/home/ProcessCards';
import SurgeonTrust from '@/components/home/SurgeonTrust';
import TopSurgeons from '@/components/home/TopSurgeons';
export default function Home() {
  return (
    <section>
      <HeroSection />
      <SurgeonTrust />
      <NotRisky />
      <TopSurgeons />
      <div className='max-w-2xl mx-auto'>
        <HomeJobForm />
      </div>
      <ProcessCards />
      <PayOnce />
      <PricingPlans />
      <HomeBottom />
      <div className='max-w-2xl mx-auto'>
        <HomeJobForm />
      </div>
      <FAQ />
    </section>
  );
}
