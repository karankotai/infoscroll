import { Topic, CardType } from "../lib/types";

// Topic gradient pairs — subtle dark-to-dark with color tint
export const TOPIC_GRADIENTS: Record<Topic, [string, string, string]> = {
  ai_ml: ["#0A0A0A", "#1a0f2e", "#0d0620"],
  system_design: ["#0A0A0A", "#0f1a2e", "#060d1f"],
  politics: ["#0A0A0A", "#2e0f0f", "#1f0606"],
  economics: ["#0A0A0A", "#0f2e1a", "#061f0d"],
  tech: ["#0A0A0A", "#2e250f", "#1f1906"],
  psychology: ["#0A0A0A", "#2e0f24", "#1f0618"],
  novels: ["#0A0A0A", "#1a0f2e", "#120620"],
  space: ["#0A0A0A", "#0f1525", "#060d1a"],
};

// Card type accent colors (distinct from topic colors)
export const CARD_TYPE_ACCENT: Record<CardType, string> = {
  quick_fact: "#8B5CF6",
  summary: "#3B82F6",
  mini_thread: "#F59E0B",
  key_insight: "#10B981",
  did_you_know: "#EC4899",
};

// Card type decorative icons (emoji for now, could be SVG later)
export const CARD_TYPE_ICON: Record<CardType, string> = {
  quick_fact: "⚡",
  summary: "📋",
  mini_thread: "🧵",
  key_insight: "💡",
  did_you_know: "🤯",
};
