import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, // suruvatila user koni nahi
  setUser: (user) => set({ user }), // user login zalyavar call karaycha
  logout: () => set({ user: null }), // logout zalyavar user kadhun takaycha
}));
