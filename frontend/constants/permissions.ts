export type PermissionKey =
  | "steps"
  | "sleep"
  | "screenTime"
  | "location"
  | "voiceStress";

export interface Permission {
  key: PermissionKey;
  icon: string;
  title: string;
  subtitle: string;
  optional?: boolean;
}

export const PERMISSIONS: Permission[] = [
  {
    key: "steps",
    icon: "🚶",
    title: "Steps & Activity",
    subtitle: "Track daily movement patterns",
  },
  {
    key: "sleep",
    icon: "😴",
    title: "Sleep Tracking",
    subtitle: "Monitor sleep quality and duration",
  },
  {
    key: "screenTime",
    icon: "📱",
    title: "Screen Time",
    subtitle: "Understand digital habits impact",
  },
  {
    key: "location",
    icon: "📍",
    title: "Location Patterns",
    subtitle: "Identify routine and stress triggers",
  },
  {
    key: "voiceStress",
    icon: "🎙️",
    title: "Voice Stress Analysis",
    subtitle: "Detect stress in voice patterns",
    optional: true,
  },
];
