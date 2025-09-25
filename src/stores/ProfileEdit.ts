import { create } from "zustand";

type ProfileEditState = {
  isEditing: boolean;
  setEditing: (v: boolean) => void;
};

export const useProfileEditStore = create<ProfileEditState>((set) => ({
  isEditing: false,
  setEditing: (v) => set({ isEditing: v }),
}));