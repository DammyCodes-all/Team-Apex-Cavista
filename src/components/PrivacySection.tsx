import { motion } from "framer-motion";
import { ShieldCheck, MapPinOff, Cpu, UserCheck } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "No Raw Audio Storage", desc: "Voice data is processed and discarded instantly." },
  { icon: MapPinOff, title: "No Exact GPS Tracking", desc: "Only movement patterns — never precise locations." },
  { icon: Cpu, title: "On-Device Preprocessing", desc: "Data stays on your phone. Nothing sent to the cloud." },
  { icon: UserCheck, title: "Full User Control", desc: "Toggle any signal on or off, anytime." },
];

const PrivacySection = () => (
  <section id="privacy" className="py-32 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Privacy & Trust</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Built on <span className="text-gradient-teal">Trust</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass p-8 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PrivacySection;
