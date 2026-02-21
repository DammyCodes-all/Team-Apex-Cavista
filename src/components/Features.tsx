import { motion } from "framer-motion";
import { Activity, BarChart3, Brain, Shield, Target, Smartphone } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Passive Behavioral Tracking", desc: "No manual input needed — your phone does the work.", span: "sm:col-span-2 lg:col-span-1" },
  { icon: BarChart3, title: "Personal Baseline Modeling", desc: "14-day learning phase adapts to your unique patterns.", span: "lg:col-span-2" },
  { icon: Activity, title: "Multi-Signal Risk Scoring", desc: "Combines sleep, movement, and screen data into one score.", span: "lg:col-span-2" },
  { icon: Brain, title: "AI-Powered Prevention", desc: "Personalized nudges before problems escalate.", span: "sm:col-span-2 lg:col-span-1" },
  { icon: Shield, title: "Privacy-First Processing", desc: "On-device processing. Your data never leaves your phone.", span: "lg:col-span-1" },
  { icon: Target, title: "Goal-Based Personalization", desc: "Set your own targets and let AI adapt to them.", span: "sm:col-span-2 lg:col-span-2" },
];

const Features = () => (
  <section id="features" className="py-28 relative">
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
          Everything You Need for <span className="text-primary">Early Prevention</span>
        </h2>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`group relative bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-md transition-all duration-300 ${f.span}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
