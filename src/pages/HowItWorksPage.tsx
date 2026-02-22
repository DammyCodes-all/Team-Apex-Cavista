import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldAlert, TrendingDown, HeartPulse, UserPlus, Activity, Brain,
  AlertTriangle, BarChart3, Lightbulb, Smartphone, Server, Database,
  Wifi, Monitor, Footprints, Moon, MessageSquare, FileText, Eye,
  Lock, Github, Play, Download, Mail, ChevronDown
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

/* ─── 1. Hero ─── */
const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-risk-low/5 pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <motion.div {...fade()} className="max-w-3xl mx-auto text-center">
        <p className="text-primary text-sm font-medium mb-4 uppercase tracking-widest">How It Works</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
          How Prevention AI Turns Data Into <span className="text-primary">Prevention</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          From passive tracking to predictive insights — see how our AI engine protects your health before risks escalate.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#download" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Download APK
          </a>
          <a href="#demo" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card text-foreground font-medium text-sm hover:bg-muted transition-colors">
            <Play className="w-4 h-4" /> View Live Demo
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── 2. Problem ─── */
const problemCards = [
  { icon: ShieldAlert, title: "No Early Detection", desc: "Apps only show data — they don't warn you before decline begins." },
  { icon: TrendingDown, title: "No Risk Forecasting", desc: "No predictive models to anticipate lifestyle-related health risks." },
  { icon: HeartPulse, title: "No Preventive Guidance", desc: "Users get dashboards, not actionable prevention steps." },
];

const ProblemSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div {...fade()} className="text-center mb-16">
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">The Problem</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          The Problem With Today's Health Apps
        </h2>
        <div className="max-w-2xl mx-auto space-y-2 text-muted-foreground">
          <p>Most apps track steps but don't detect behavioral decline.</p>
          <p>Lifestyle risks build gradually and silently.</p>
          <p>Users only react after symptoms appear.</p>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {problemCards.map((c, i) => (
          <motion.div key={i} {...fade(i * 0.1)} className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <c.icon className="w-7 h-7 text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── 3. Workflow ─── */
const steps = [
  { icon: UserPlus, title: "User Onboarding", desc: "User creates account, grants permissions for activity, sleep, and screen time tracking." },
  { icon: Activity, title: "Passive Data Collection", desc: "The app continuously collects behavioral signals: steps, sleep duration & quality, screen time, activity levels." },
  { icon: Brain, title: "AI Baseline Modeling", desc: "Our AI learns the user's normal patterns over time and builds a personalized baseline." },
  { icon: AlertTriangle, title: "Deviation Detection", desc: "The AI detects unusual shifts in behavior patterns compared to baseline." },
  { icon: BarChart3, title: "Risk Scoring Engine", desc: "Multiple signals are combined into a dynamic risk score (0–100)." },
  { icon: Lightbulb, title: "Preventive Insights & Micro-Actions", desc: "Users receive simple, actionable guidance to prevent lifestyle decline." },
];

const WorkflowSection = () => (
  <section className="py-24 bg-muted/30">
    <div className="container mx-auto px-6">
      <motion.div {...fade()} className="text-center mb-16">
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Workflow</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Prevention Workflow</h2>
      </motion.div>

      <div className="max-w-3xl mx-auto relative">
        {/* Vertical connector */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {steps.map((s, i) => (
            <motion.div key={i} {...fade(i * 0.08)} className="relative flex gap-5 sm:gap-7 pb-10 last:pb-0">
              {/* Node */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-sm">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
              {/* Content */}
              <div className="pt-1 sm:pt-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">STEP {i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>

              {/* Animated arrow */}
              {i < steps.length - 1 && (
                <div className="absolute left-[22px] sm:left-[30px] bottom-0 z-10">
                  <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── 4. Architecture ─── */
const archLayers = [
  { icon: Smartphone, label: "Mobile App" },
  { icon: Server, label: "Backend API (FastAPI)" },
  { icon: Brain, label: "AI Engine" },
  { icon: Database, label: "Database" },
  { icon: Wifi, label: "WebSocket → Live Dashboard" },
];

const ArchitectureSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div {...fade()} className="text-center mb-16">
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Architecture</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Behind the Scenes</h2>
      </motion.div>

      <div className="max-w-sm mx-auto">
        {archLayers.map((l, i) => (
          <motion.div key={i} {...fade(i * 0.08)}>
            <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <l.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{l.label}</span>
            </div>
            {i < archLayers.length - 1 && (
              <div className="flex justify-center py-1.5">
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        <motion.p {...fade(0.5)} className="text-center text-xs text-muted-foreground mt-6 italic">
          All metrics and insights update in real-time.
        </motion.p>
      </div>
    </div>
  </section>
);

/* ─── 5. Simulation Notice ─── */
const SimulationNotice = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-6">
      <motion.div {...fade()} className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Monitor className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">Built for Real-World Integration</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For demonstration purposes, Prevention AI uses a real-time simulation engine. In production, the app integrates with HealthKit and Google Fit APIs.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ─── 6. Product Preview ─── */
const screens = [
  { icon: Footprints, title: "Dashboard", desc: "Steps, sleep, risk score at a glance." },
  { icon: TrendingDown, title: "Trends & Deviations", desc: "Signal drift detection over time." },
  { icon: BarChart3, title: "Risk Forecast", desc: "Dynamic 0–100 risk trajectory." },
  { icon: FileText, title: "Reports Export", desc: "Generate and share PDF reports." },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Ask questions about your health data." },
];

const MiniPhone = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-[2rem] p-1.5 shadow-md w-full max-w-[200px]">
    <div className="bg-background rounded-[1.6rem] p-4 min-h-[260px] flex flex-col items-center justify-center">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-1 rounded-full bg-muted" />
      </div>
      {children}
    </div>
  </div>
);

const ProductPreview = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div {...fade()} className="text-center mb-16">
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Preview</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Product Screens</h2>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6">
        {screens.map((s, i) => (
          <motion.div key={i} {...fade(i * 0.08)} className="flex flex-col items-center gap-3">
            <MiniPhone>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
            </MiniPhone>
            <p className="text-xs text-muted-foreground max-w-[180px] text-center">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── 7. Final CTA ─── */
const FinalCTA = () => (
  <section id="download" className="py-24 bg-gradient-to-br from-primary/10 via-muted/30 to-risk-low/10">
    <div className="container mx-auto px-6">
      <motion.div {...fade()} className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Experience Prevention AI <span className="text-primary">Today</span>
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Download the APK and see how AI turns your daily behavior into preventive intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <a href="#" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Download APK
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card text-foreground font-medium text-sm hover:bg-muted transition-colors">
            <Github className="w-4 h-4" /> View GitHub Repository
          </a>
        </div>
        <p className="text-xs text-muted-foreground">Demo account available for judges.</p>
      </motion.div>
    </div>
  </section>
);

/* ─── 8. Page Footer ─── */
const PageFooter = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-6">
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        {[
          { label: "About", href: "#" },
          { label: "GitHub", href: "#" },
          { label: "Demo Video", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Privacy Notice", href: "#" },
        ].map((l) => (
          <a key={l.label} href={l.href} className="hover:text-primary transition-colors">{l.label}</a>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-6">© 2026 Prevention AI. All rights reserved.</p>
    </div>
  </footer>
);

/* ─── Page ─── */
const HowItWorksPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <ProblemSection />
    <WorkflowSection />
    <ArchitectureSection />
    <SimulationNotice />
    <ProductPreview />
    <FinalCTA />
    <PageFooter />
  </div>
);

export default HowItWorksPage;
