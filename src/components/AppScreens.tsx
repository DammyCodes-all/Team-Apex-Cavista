import { motion } from "framer-motion";
import { Activity, TrendingDown, BarChart3, Moon, Footprints, Shield, Target, Bell, Lock, Eye, Brain, Zap } from "lucide-react";

/* Miniature phone mockup component */
const PhoneMockup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass p-1 rounded-[2rem] max-w-[280px] mx-auto">
    <div className="bg-background rounded-[1.75rem] p-4 min-h-[420px] flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-1 rounded-full bg-muted" />
      </div>
      <p className="text-xs text-primary font-semibold mb-3 uppercase tracking-wider">{title}</p>
      {children}
    </div>
  </div>
);

const RiskBadge = ({ level, color }: { level: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${color}`}>{level}</span>
);

const MiniBar = ({ h, color }: { h: string; color: string }) => (
  <div className={`w-3 rounded-full ${color}`} style={{ height: h }} />
);

const screens = [
  {
    title: "Dashboard",
    content: (
      <div className="flex flex-col gap-3 flex-1">
        <div className="glass-subtle p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Footprints className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground font-medium">Daily Steps</span>
          </div>
          <div className="flex items-end gap-1 h-12">
            {["40%", "60%", "80%", "55%", "90%", "70%", "85%"].map((h, i) => (
              <MiniBar key={i} h={h} color="bg-primary/60" />
            ))}
          </div>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground font-medium">Sleep Consistency</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-primary/50" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">7.2 hrs avg</p>
        </div>
        <div className="glass-subtle p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-foreground font-medium">Risk Score</p>
            <RiskBadge level="Low" color="bg-risk-low/20 text-risk-low" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-risk-low flex items-center justify-center">
            <span className="text-xs font-bold text-risk-low">12</span>
          </div>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground font-medium">AI Insight</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Your patterns are consistent. Keep it up!</p>
        </div>
      </div>
    ),
  },
  {
    title: "Risk Analysis",
    content: (
      <div className="flex flex-col gap-3 flex-1">
        <div className="glass-subtle p-3 rounded-xl">
          <p className="text-xs text-foreground font-medium mb-2">Signal Deviations</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Sleep</span>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-risk-elevated" />
                <span className="text-[10px] text-risk-elevated">-18%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Movement</span>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-risk-moderate" />
                <span className="text-[10px] text-risk-moderate">-12%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <p className="text-xs text-foreground font-medium mb-2">Risk Trajectory</p>
          <div className="flex items-end gap-1.5 h-16">
            {[20, 22, 25, 30, 38, 45, 52].map((v, i) => (
              <div key={i} className={`w-3 rounded-full ${v > 40 ? "bg-risk-elevated/70" : v > 28 ? "bg-risk-moderate/70" : "bg-risk-low/70"}`} style={{ height: `${v * 1.2}%` }} />
            ))}
          </div>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground font-medium">AI Summary</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Sleep and activity patterns suggest increasing fatigue. Consider adjusting your routine.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Profile & Baseline",
    content: (
      <div className="flex flex-col gap-3 flex-1">
        <div className="glass-subtle p-3 rounded-xl">
          <p className="text-xs text-foreground font-medium mb-2">Baseline Metrics</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Avg Steps", value: "8,420" },
              { label: "Sleep", value: "7.4h" },
              { label: "Active Min", value: "45" },
              { label: "Screen", value: "4.2h" },
            ].map((m) => (
              <div key={m.label} className="bg-muted/30 rounded-lg p-2 text-center">
                <p className="text-sm font-semibold text-foreground">{m.value}</p>
                <p className="text-[9px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <p className="text-xs text-foreground font-medium mb-2">Enabled Signals</p>
          {["Steps", "Sleep", "Screen Time", "Location"].map((s) => (
            <div key={s} className="flex items-center justify-between py-1">
              <span className="text-[10px] text-muted-foreground">{s}</span>
              <div className="w-7 h-4 bg-primary/30 rounded-full flex items-center justify-end px-0.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
            </div>
          ))}
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground font-medium">Privacy Controls</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">All data processed on-device</p>
        </div>
      </div>
    ),
  },
  {
    title: "AI Insight Detail",
    content: (
      <div className="flex flex-col gap-3 flex-1">
        <div className="glass-subtle p-3 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground font-medium">Insight Summary</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Your sleep has decreased 18% this week while screen time increased. This pattern often precedes fatigue cycles.</p>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <p className="text-xs text-foreground font-medium mb-2">Recommended Actions</p>
          <div className="space-y-2">
            {["Set a 10:30 PM wind-down alarm", "Take a 15-min walk after lunch", "Reduce screen time by 30 min"].map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="text-[8px] text-primary font-bold">{i + 1}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-subtle p-3 rounded-xl">
          <p className="text-xs text-foreground font-medium mb-2">Behavioral Trends</p>
          <div className="space-y-1.5">
            {[
              { label: "Energy", trend: "declining", color: "text-risk-moderate" },
              { label: "Routine", trend: "stable", color: "text-risk-low" },
              { label: "Recovery", trend: "needs attention", color: "text-risk-elevated" },
            ].map((t) => (
              <div key={t.label} className="flex justify-between">
                <span className="text-[10px] text-muted-foreground">{t.label}</span>
                <span className={`text-[10px] font-medium ${t.color}`}>{t.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const AppScreens = () => (
  <section className="py-32 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">App Preview</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Intelligence at Your <span className="text-gradient-teal">Fingertips</span>
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {screens.map((s, i) => (
          <motion.div key={i} variants={item}>
            <PhoneMockup title={s.title}>{s.content}</PhoneMockup>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AppScreens;
