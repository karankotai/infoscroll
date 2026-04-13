import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { Card } from "../lib/types";

type FeedState = {
  cards: Card[];
  currentIndex: number;
  loading: boolean;
  error: string | null;

  fetchFeed: () => Promise<void>;
  markSeen: (cardId: string) => Promise<void>;
  markSaved: (cardId: string) => Promise<void>;
  markSkipped: (cardId: string) => Promise<void>;
  setCurrentIndex: (index: number) => void;
};

export const useFeedStore = create<FeedState>((set, get) => ({
  cards: [],
  currentIndex: 0,
  loading: false,
  error: null,

  fetchFeed: async () => {
    set({ loading: true, error: null });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false, error: "Not authenticated" });
      return;
    }

    const { data, error } = await supabase.rpc("get_feed", {
      p_user_id: user.id,
      p_limit: 20,
    });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    set((state) => ({
      cards: [...state.cards, ...(data as Card[])],
      loading: false,
    }));
  },

  markSeen: async (cardId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_card_state")
      .upsert(
        { user_id: user.id, card_id: cardId, status: "seen" },
        { onConflict: "user_id,card_id" }
      );
  },

  markSaved: async (cardId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_card_state")
      .upsert(
        { user_id: user.id, card_id: cardId, status: "saved" },
        { onConflict: "user_id,card_id" }
      );
  },

  markSkipped: async (cardId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_card_state")
      .upsert(
        { user_id: user.id, card_id: cardId, status: "skipped" },
        { onConflict: "user_id,card_id" }
      );
  },

  setCurrentIndex: (index: number) => {
    set({ currentIndex: index });
    const { cards, fetchFeed } = get();
    if (index >= cards.length - 5) {
      fetchFeed();
    }
  },
}));
