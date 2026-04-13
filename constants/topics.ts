import { Topic } from "../lib/types";

export const TOPIC_CONFIG: Record<
  Topic,
  { label: string; color: string; emoji: string }
> = {
  ai_ml: { label: "AI / ML", color: "#8B5CF6", emoji: "🤖" },
  system_design: { label: "System Design", color: "#3B82F6", emoji: "🏗️" },
  politics: { label: "World Politics", color: "#EF4444", emoji: "🌍" },
  economics: { label: "Economics", color: "#10B981", emoji: "📈" },
  tech: { label: "Tech Industry", color: "#F59E0B", emoji: "💻" },
  psychology: { label: "Psychology", color: "#EC4899", emoji: "🧠" },
  novels: { label: "Famous Novels", color: "#6366F1", emoji: "📚" },
  space: { label: "Space News", color: "#1E3A5F", emoji: "🚀" },
};
