import { motion } from "framer-motion";
import { Smartphone, BarChart3, AlertTriangle, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Passive Data Collection",
    desc: "Steps, Sleep, Activity, Location",
  },
  {
    icon: BarChart3,
    title: "Personal Baseline Modeling",
    desc: "14-day learning phase",
  },
  {
    icon: AlertTriangle,
    title: "Deviation Detection Engine",
    desc: "Behavioral drift monitoring",
  },
  {
    icon: Lightbulb,
    title: "AI Prevention Insights",
    desc: "Personalized nudges & risk scoring",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const HowItWorks = () => (
  <section id="how-it-works" className="py-32 relative">
    <div className="absolute inset-0 gradient-radial pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">How It Works</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          From Data to <span className="text-gradient-teal">Prevention</span>
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {steps.map((s, i) => (
          <motion.div key={i} variants={item} className="glass p-8 text-center group hover:glow-teal-sm transition-shadow duration-500">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <s.icon className="w-7 h-7 text-primary" />
            </div>
            <div className="text-xs text-primary font-semibold mb-2">Step {i + 1}</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HowItWorks;
