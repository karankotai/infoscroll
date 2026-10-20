import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthState = {
  session: Session | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signInDemo: () => Promise<{ error: string | null }>;
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

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  },

  // Backs the "Try it out" button on the marketing page: Supabase mints a
  // throwaway account so each visitor gets an isolated feed, saved list and
  // history without having to sign up.
  signInDemo: async () => {
    const { error } = await supabase.auth.signInAnonymously();
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
