import { motion } from "framer-motion";
import { Smartphone, BarChart3, AlertTriangle, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Passive Data Collection",
    desc: "Steps, sleep, activity & location are captured in the background — zero manual input.",
    num: "01",
  },
  {
    icon: BarChart3,
    title: "Personal Baseline Modeling",
    desc: "A 14-day learning phase builds a behavioral model unique to you.",
    num: "02",
  },
  {
    icon: AlertTriangle,
    title: "Deviation Detection Engine",
    desc: "Continuous monitoring spots behavioral drift the moment it begins.",
    num: "03",
  },
  {
    icon: Lightbulb,
    title: "AI Prevention Insights",
    desc: "Personalized nudges and risk scoring keep you one step ahead.",
    num: "04",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-28 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">How It Works</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          From Data to <span className="text-primary">Prevention</span>
        </h2>
      </motion.div>

      {/* Connected horizontal timeline */}
      <div className="relative">
        {/* Connector line - hidden on mobile */}
        <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-border" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center px-4 relative"
            >
              {/* Step circle with number */}
              <div className="relative z-10 mb-6">
                <div className="w-24 h-24 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-sm">
                  <s.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {s.num}
                </div>
              </div>

              <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[220px]">{s.desc}</p>

              {/* Arrow between steps on mobile */}
              {i < steps.length - 1 && (
                <div className="lg:hidden mt-6 mb-2">
                  <div className="w-px h-8 bg-border mx-auto" />
                  <div className="w-2 h-2 border-r border-b border-border rotate-45 mx-auto -mt-1" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
