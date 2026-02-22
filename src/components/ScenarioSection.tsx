import { motion } from "framer-motion";
import { Moon, TrendingDown, Brain, Footprints } from "lucide-react";

const timelineSteps = [
  {
    icon: Moon,
    day: "Day 1–3",
    title: "Sleep drops to 5.2 hrs",
    desc: "Exam week stress begins affecting rest patterns.",
    color: "text-risk-moderate",
  },
  {
    icon: Footprints,
    day: "Day 4–5",
    title: "Activity drops 40%",
    desc: "Movement patterns shift as study sessions extend.",
    color: "text-risk-elevated",
  },
  {
    icon: TrendingDown,
    day: "Day 5",
    title: "Deviation detected",
    desc: "AI flags behavioral drift beyond personal baseline.",
    color: "text-risk-elevated",
  },
  {
    icon: Brain,
    day: "Day 5",
    title: "AI recommends action",
    desc: "Structured rest breaks and 15-min activity sessions suggested.",
    color: "text-primary",
  },
];

const ScenarioSection = () => (
  <section className="py-32 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-medium mb-3 uppercase tracking-widest">Real-Life Scenario</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Prevention <span className="text-gradient-teal">Before Symptoms</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          A student during exam week experiences reduced sleep and activity. Here's how KINAI steps in.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-8">
          {timelineSteps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center relative z-10">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="glass p-6 flex-1">
                <span className={`text-xs font-semibold ${s.color}`}>{s.day}</span>
                <h3 className="text-base font-semibold text-foreground mt-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ScenarioSection;
