import { get, put } from "@/lib/api/client";

export type ProfileResponse = {
  id: string;
  email: string;
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
  goals_selected: string[];
  goals_custom: string;
};

export type UpdateProfileResponse = {
  message?: string;
};

export const updateProfile = (payload: UpdateProfilePayload) => {
  console.log(payload);
  return put<UpdateProfileResponse, UpdateProfilePayload>("/profile", payload);
};

export const getProfile = () => {
  return get<ProfileResponse>("/profile");
};
