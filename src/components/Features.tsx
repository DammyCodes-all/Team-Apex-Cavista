import { motion } from "framer-motion";
import { Activity, BarChart3, Brain, Shield, Target, Smartphone } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Passive Behavioral Tracking", desc: "No manual input needed — your phone does the work." },
  { icon: BarChart3, title: "Personal Baseline Modeling", desc: "14-day learning phase adapts to your unique patterns." },
  { icon: Activity, title: "Multi-Signal Risk Scoring", desc: "Combines sleep, movement, and screen data into one score." },
  { icon: Brain, title: "AI-Powered Prevention Insights", desc: "Personalized nudges before problems escalate." },
  { icon: Shield, title: "Privacy-First Data Processing", desc: "On-device processing. Your data never leaves your phone." },
  { icon: Target, title: "Goal-Based Personalization", desc: "Set your own targets and let AI adapt to them." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Features = () => (
  <section id="features" className="py-32 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Core Features</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Everything You Need for <span className="text-gradient-teal">Early Prevention</span>
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={item} className="glass p-8 group hover:shadow-md transition-shadow duration-500">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;
