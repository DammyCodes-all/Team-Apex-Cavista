import { motion } from "framer-motion";
import { Shield, Activity, Brain, Eye } from "lucide-react";

const navLinks = ["Features", "How It Works", "Privacy", "Download"];

const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border/30"
  >
    <div className="container mx-auto flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-semibold text-foreground">Prevention AI</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((l) => (
          <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {l}
          </a>
        ))}
      </div>
      <a href="#download" className="hidden sm:inline-flex px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
        Get Started
      </a>
    </div>
  </motion.nav>
);

export default Navbar;
