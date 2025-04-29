// src/store/activityStore.ts
import { create } from "zustand";

type Activity = {
  id: number;
  contactId: string; // So we know which contact this belongs to
  type: string;
  text: string;
  date: string; // New field for activity date

};

type ActivityStore = {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "date">) => void;
  deleteActivity: (id: number) => void;

  getActivitiesByContact: (contactId: string) => Activity[];
};

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],
  addActivity: (activity) =>
    set((state) => ({
      activities: [
        ...state.activities,
        {
          ...activity,
          id: Date.now(),
          date: new Date().toLocaleString(), // Add readable date-time
        },
      ],
    })),
  deleteActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    })),
  getActivitiesByContact: (contactId) =>
    get().activities.filter((a) => a.contactId === contactId),
}));
