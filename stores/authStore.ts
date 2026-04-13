import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthState = {
  session: Session | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },

  signIn: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
