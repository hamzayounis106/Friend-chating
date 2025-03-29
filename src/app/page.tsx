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
    <section className="flex flex-col items-center">
      {/* Full-width sections with centered content */}
      <div className="w-full">
        <HeroSection />
      </div>
      
      {/* Center-aligned sections with consistent max-width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SurgeonTrust />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotRisky />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TopSurgeons />
      </div>
      
      <div className="w-full max-w-2xl mx-auto px-4">
        <HomeJobForm />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProcessCards />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PayOnce />
      </div>
    
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <PricingPlans />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeBottom />
      </div>
      
      <div className="w-full max-w-2xl mx-auto px-4">
        <HomeJobForm />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQ />
      </div>
    </section>
  );
}