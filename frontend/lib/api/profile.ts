import { put } from "@/lib/api/client";

export type UpdateProfilePayload = {
  name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  tracking_sleep: boolean;
  tracking_steps: boolean;
  tracking_screen_time: boolean;
  tracking_voice_stress: boolean;
};

export type UpdateProfileResponse = {
  message?: string;
};

export const updateProfile = (payload: UpdateProfilePayload) => {
  return put<UpdateProfileResponse, UpdateProfilePayload>("/profile", payload);
};
