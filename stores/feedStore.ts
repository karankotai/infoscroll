import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { Card } from "../lib/types";

export type FeedMode = "cards" | "videos";

type FeedState = {
  mode: FeedMode;
  cards: Card[];
  videos: Card[];
  currentIndex: number;
  loading: boolean;
  error: string | null;

  setMode: (mode: FeedMode) => void;
  fetchFeed: () => Promise<void>;
  markSeen: (cardId: string) => Promise<void>;
  markSaved: (cardId: string) => Promise<void>;
  markSkipped: (cardId: string) => Promise<void>;
  setCurrentIndex: (index: number) => void;
};

export const useFeedStore = create<FeedState>((set, get) => ({
  mode: "cards",
  cards: [],
  videos: [],
  currentIndex: 0,
  loading: false,
  error: null,

  setMode: (mode: FeedMode) => {
    set({ mode, currentIndex: 0 });
  },

  fetchFeed: async () => {
    const { mode } = get();
    set({ loading: true, error: null });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false, error: "Not authenticated" });
      return;
    }

    const rpcName = mode === "videos" ? "get_video_feed" : "get_feed";
    const { data, error } = await supabase.rpc(rpcName, {
      p_user_id: user.id,
      p_limit: 20,
    });

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    set((state) =>
      mode === "videos"
        ? { videos: [...state.videos, ...(data as Card[])], loading: false }
        : { cards: [...state.cards, ...(data as Card[])], loading: false }
    );
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
    const { mode, cards, videos, fetchFeed } = get();
    const currentList = mode === "videos" ? videos : cards;
    if (index >= currentList.length - 5) {
      fetchFeed();
    }
  },
}));
