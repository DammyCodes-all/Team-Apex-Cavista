export type GoalId =
  | "sleep"
  | "active"
  | "stress"
  | "focus"
  | "health"
  | "custom";

export interface Goal {
  id: GoalId;
  icon: string;
  emoji: string;
  title: string;
  subtitle: string;
}

export const GOALS: Goal[] = [
  {
    id: "sleep",
    icon: "🌙",
    emoji: "😴",
    title: "Better Sleep",
    subtitle: "Track sleep patterns and get rest recommendations",
  },
  {
    id: "active",
    icon: "🏃",
    emoji: "🏃",
    title: "More Active",
    subtitle: "Increase daily movement and energy levels",
  },
  {
    id: "stress",
    icon: "🧘",
    emoji: "🧘",
    title: "Stress Less",
    subtitle: "Monitor stress triggers and find balance",
  },
  {
    id: "focus",
    icon: "🎯",
    emoji: "🎯",
    title: "Focus Better",
    subtitle: "Reduce distractions and improve concentration",
  },
  {
    id: "health",
    icon: "⚡",
    emoji: "⚡",
    title: "Overall Health",
    subtitle: "Get comprehensive health insights",
  },
  {
    id: "custom",
    icon: "✚",
    emoji: "✚",
    title: "Custom Goal",
    subtitle: "Tell us your specific priority",
  },
];
