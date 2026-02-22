import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Features", href: isHome ? "#features" : "/#features" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Privacy", href: isHome ? "#privacy" : "/#privacy" },
    { label: "Download", href: isHome ? "#download" : "/#download" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-5 inset-x-0 z-50 flex justify-center px-4"
    >
      <div className="w-full max-w-3xl bg-background/75 backdrop-blur-2xl border border-border rounded-full shadow-lg px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground hidden sm:inline">Prevention AI</span>
        </Link>

        {/* Desktop links – centered */}
        <div className="hidden md:flex items-center gap-5">
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.label}
                to={l.href}
                className="text-[13px] text-muted-foreground hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-muted-foreground hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            )
          )}
        </div>

        {/* CTA */}
        <a
          href="#download"
          className="hidden md:inline-flex px-5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          Get Started
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-1 rounded-full hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-4 right-4 max-w-3xl mx-auto bg-background/95 backdrop-blur-2xl border border-border rounded-2xl shadow-xl px-5 py-5 flex flex-col gap-1 md:hidden"
          >
            {links.map((l) =>
              l.href.startsWith("/") ? (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-2.5 transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-2.5 transition-colors"
                >
                  {l.label}
                </a>
              )
            )}
            <div className="mt-2 pt-2 border-t border-border">
              <a
                href="#download"
                onClick={() => setMobileOpen(false)}
                className="block w-full px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
