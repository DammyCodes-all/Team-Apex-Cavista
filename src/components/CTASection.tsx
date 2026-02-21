import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const CTASection = () => (
  <section id="download" className="py-32 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass p-12 md:p-20 text-center max-w-4xl mx-auto rounded-3xl"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          The Future of Prevention Starts With <span className="text-gradient-teal">Awareness</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
          Join thousands taking control of their behavioral health before symptoms appear.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
            Download Prevention AI
          </a>
          <a href="#" className="px-8 py-4 rounded-full glass border border-glass-border text-foreground font-medium text-base hover:bg-card/60 transition-colors">
            Join the Prevention Movement
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
