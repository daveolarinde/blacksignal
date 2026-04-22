import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import WalletSection from '../components/sections/WalletSection';
import ServicesSection from '../components/sections/ServicesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import FeatureGridSection from '../components/sections/FeatureGridSection';
import AboutSection from '../components/sections/AboutSection';
import FaqSection from '../components/sections/FaqSection';
import ChatWidget from '../components/chat/ChatWidget';

export default function HomePage() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <HeroSection />
      <WalletSection />
      <ServicesSection />
      <TestimonialsSection />
      <FeatureGridSection />
      <AboutSection />
      <FaqSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
