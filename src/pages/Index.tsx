import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import AppScreens from "@/components/AppScreens";
import Features from "@/components/Features";
import ScenarioSection from "@/components/ScenarioSection";
import PrivacySection from "@/components/PrivacySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <AppScreens />
    <Features />
    <ScenarioSection />
    <PrivacySection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
