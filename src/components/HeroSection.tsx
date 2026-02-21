import { motion } from "framer-motion";
import heroPhone from "@/assets/hero-phone.png";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
    <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs text-primary font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          AI-Powered Behavioral Health Prevention
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
          Your Behavioral Health,{" "}
          <span className="text-gradient-teal">Monitored Before</span>{" "}
          It Declines.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Prevention AI passively tracks your daily patterns, learns your personal baseline, and alerts you to early lifestyle shifts — before they become health risks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#download" className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
            Get Started
          </a>
          <a href="#how-it-works" className="px-8 py-3.5 rounded-full glass border border-glass-border text-foreground font-medium text-base hover:bg-card/60 transition-colors">
            View Demo
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-16 w-full max-w-4xl"
      >
        <div className="relative">
          <img
            src={heroPhone}
            alt="Prevention AI Dashboard on mobile phone"
            className="w-full rounded-3xl shadow-lg"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
