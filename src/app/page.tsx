'use client';

import HeroSection from '@/components/home/hero/HeroSection';
import HomeJobForm from '@/components/home/HomeJobForm';
import Navbar from '@/components/navbar/Navbar';
export default function Home() {
  return (
    <section>
      <Navbar />
      <HeroSection />
      {/* <HomeJobForm /> */}
    </section>
  );
}
