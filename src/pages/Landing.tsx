// no router used; plain anchors
import Hero from '../components/landing/Hero';
import HorizontalRule from '../components/utils/HorizontalRule';
import MenusSection from '../components/landing/MenusSection';
import VotingSection from '../components/landing/VotingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import Footer from '../components/landing/Footer';
import FindUsSection from '../components/landing/FindUsSection';
import AboutUsSection from '../components/landing/AboutUs';
import Message from '../components/landing/Message';
import VisitLogger from '../components/utils/VisitLogger';
export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Hero />
      <AboutUsSection />
      
      <MenusSection />
      <HorizontalRule/>

      <VotingSection />
      <HorizontalRule/>

      <TestimonialsSection />
      <HorizontalRule/>

      <FindUsSection />
      <HorizontalRule/>

      <Message/>
      <Footer />

      <VisitLogger/>
    </div>
  );
}
