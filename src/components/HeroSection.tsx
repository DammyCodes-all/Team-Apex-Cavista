import { motion } from "framer-motion";
import { Activity, TrendingDown, Brain, Moon, Footprints } from "lucide-react";

/* Tiny phone mockup for hero */
const MiniPhone = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-border rounded-[2rem] p-1.5 shadow-xl w-[220px] sm:w-[240px] ${className}`}>
    <div className="bg-background rounded-[1.6rem] p-3 min-h-[360px] sm:min-h-[400px] flex flex-col">
      <div className="flex justify-center mb-3">
        <div className="w-16 h-1 rounded-full bg-muted" />
      </div>
      {children}
    </div>
  </div>
);

const MiniBar = ({ h, color }: { h: string; color: string }) => (
  <div className={`w-2.5 rounded-full ${color}`} style={{ height: h }} />
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            AI-Powered Behavioral Health Prevention
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground mb-6">
            Your Behavioral Health,{" "}
            <span className="text-primary">Monitored Before</span>{" "}
            It Declines.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            Prevention AI passively tracks your daily patterns, learns your personal baseline, and alerts you to early lifestyle shifts — before they become health risks.
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
            <a
              href="#download"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-80">Download on the</div>
                <div className="text-sm font-semibold -mt-0.5">App Store</div>
              </div>
            </a>
            <a
              href="#download"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M3.18 23.67L14.25 12.6 3.18.33c-.3-.15-.6 0-.6.45v22.44c0 .45.3.6.6.45zm12.8-12.8L5.04 1.43l9.22 5.32 1.72 1-1.72 1zm1.72-1L20.42 12l-2.72 2.13-1.72-1 1.72-1zM5.04 22.57l10.94-9.44 1.72 1-9.22 5.32z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-80">Get it on</div>
                <div className="text-sm font-semibold -mt-0.5">Google Play</div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Right: Two phone mockups */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-end gap-4 sm:gap-6"
        >
          {/* Phone 1 - Dashboard */}
          <MiniPhone className="-rotate-3">
            <div className="flex flex-col gap-2.5 flex-1">
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Footprints className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-foreground font-medium">Daily Steps</span>
                </div>
                <div className="flex items-end gap-0.5 h-10">
                  {["35%", "55%", "75%", "50%", "85%", "65%", "80%"].map((h, i) => (
                    <MiniBar key={i} h={h} color="bg-primary/50" />
                  ))}
                </div>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Moon className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-foreground font-medium">Sleep</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-primary/60" />
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">7.2 hrs avg</p>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-foreground font-medium">Risk Score</p>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-risk-low/20 text-risk-low">Low</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-risk-low flex items-center justify-center">
                  <span className="text-[10px] font-bold text-risk-low">12</span>
                </div>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-foreground font-medium">AI Insight</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">Your patterns are consistent.</p>
              </div>
            </div>
          </MiniPhone>

          {/* Phone 2 - Risk Analysis */}
          <MiniPhone className="rotate-3 translate-y-6">
            <div className="flex flex-col gap-2.5 flex-1">
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <p className="text-[10px] text-foreground font-medium mb-1.5">Signal Deviations</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground">Sleep</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-2.5 h-2.5 text-risk-elevated" />
                      <span className="text-[9px] text-risk-elevated">-18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground">Movement</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-2.5 h-2.5 text-risk-moderate" />
                      <span className="text-[9px] text-risk-moderate">-12%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <p className="text-[10px] text-foreground font-medium mb-1.5">Risk Trajectory</p>
                <div className="flex items-end gap-1 h-14">
                  {[20, 22, 25, 30, 38, 45, 52].map((v, i) => (
                    <div key={i} className={`w-2.5 rounded-full ${v > 40 ? "bg-risk-elevated/70" : v > 28 ? "bg-risk-moderate/70" : "bg-risk-low/70"}`} style={{ height: `${v * 1.2}%` }} />
                  ))}
                </div>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-foreground font-medium">AI Summary</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">Sleep and activity suggest increasing fatigue.</p>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-xl p-2.5">
                <p className="text-[10px] text-foreground font-medium mb-1">Trends</p>
                <div className="space-y-1">
                  {[
                    { label: "Energy", value: "declining", color: "text-risk-moderate" },
                    { label: "Routine", value: "stable", color: "text-risk-low" },
                  ].map((t) => (
                    <div key={t.label} className="flex justify-between">
                      <span className="text-[9px] text-muted-foreground">{t.label}</span>
                      <span className={`text-[9px] font-medium ${t.color}`}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MiniPhone>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
