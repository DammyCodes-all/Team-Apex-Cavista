import { motion } from "framer-motion";
import { ShieldCheck, MapPinOff, Cpu, UserCheck, Lock } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "No Raw Audio Storage", desc: "Voice data is processed and discarded instantly." },
  { icon: MapPinOff, title: "No Exact GPS Tracking", desc: "Only movement patterns — never precise locations." },
  { icon: Cpu, title: "On-Device Preprocessing", desc: "Data stays on your phone. Nothing sent to the cloud." },
  { icon: UserCheck, title: "Full User Control", desc: "Toggle any signal on or off, anytime." },
];

const PrivacySection = () => (
  <section id="privacy" className="py-28 relative">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left - Big statement */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Privacy & Trust</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Built on <span className="text-primary">Trust</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            Your health data is yours. We built Prevention AI with a privacy-first architecture — everything processes on your device.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/5 border border-primary/15">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">End-to-end encrypted • HIPAA-aligned</span>
          </div>
        </motion.div>

        {/* Right - Stacked cards */}
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-4 bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PrivacySection;
