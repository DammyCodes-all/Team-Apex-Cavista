import { create } from "zustand";

type PermissionKey =
  | "steps"
  | "sleep"
  | "screenTime"
  | "location"
  | "voiceStress";
type GoalId = "sleep" | "active" | "stress" | "focus" | "health" | "custom";

interface OnboardingStore {
  // Step 2: Permissions
  permissions: Record<PermissionKey, boolean>;
  setPermissions: (permissions: Record<PermissionKey, boolean>) => void;

  // Step 3: Personal Info
  name: string;
  setName: (name: string) => void;

  age: string;
  setAge: (age: string) => void;

  gender: string | null;
  setGender: (gender: string | null) => void;

  height: string;
  setHeight: (height: string) => void;

  weight: string;
  setWeight: (weight: string) => void;

  // Step 4: Goals
  selectedGoals: GoalId[];
  setSelectedGoals: (goals: GoalId[]) => void;

  customGoalText: string;
  setCustomGoalText: (text: string) => void;

  // Actions
  resetOnboarding: () => void;
  getOnboardingData: () => {
    permissions: Record<PermissionKey, boolean>;
    personalInfo: {
      name: string;
      age: number;
      gender: string | null;
      height: number;
      weight: number;
    };
    goals: {
      selected: GoalId[];
      custom: string;
    };
  };
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  // Step 2
  permissions: {
    steps: true,
    sleep: true,
    screenTime: true,
    location: true,
    voiceStress: false,
  },
  setPermissions: (permissions) => set({ permissions }),

  // Step 3
  name: "",
  setName: (name) => set({ name }),

  age: "",
  setAge: (age) => set({ age }),

  gender: null,
  setGender: (gender) => set({ gender }),

  height: "",
  setHeight: (height) => set({ height }),

  weight: "",
  setWeight: (weight) => set({ weight }),

  // Step 4
  selectedGoals: [],
  setSelectedGoals: (selectedGoals) => set({ selectedGoals }),

  customGoalText: "",
  setCustomGoalText: (customGoalText) => set({ customGoalText }),

  // Actions
  resetOnboarding: () =>
    set({
      permissions: {
        steps: true,
        sleep: true,
        screenTime: true,
        location: true,
        voiceStress: false,
      },
      name: "",
      age: "",
      gender: null,
      height: "",
      weight: "",
      selectedGoals: [],
      customGoalText: "",
    }),

  getOnboardingData: () => {
    const state = get();
    return {
      permissions: state.permissions,
      personalInfo: {
        name: state.name,
        age: parseInt(state.age, 10) || 0,
        gender: state.gender,
        height: parseFloat(state.height) || 0,
        weight: parseFloat(state.weight) || 0,
      },
      goals: {
        selected: state.selectedGoals,
        custom: state.customGoalText,
      },
    };
  },
}));
