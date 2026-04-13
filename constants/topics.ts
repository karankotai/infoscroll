import { Topic } from "../lib/types";

export const TOPIC_CONFIG: Record<
  Topic,
  { label: string; color: string; emoji: string }
> = {
  ai_ml: { label: "AI / ML", color: "#8B5CF6", emoji: "\u{1F916}" },
  system_design: { label: "System Design", color: "#3B82F6", emoji: "\u{1F3D7}\uFE0F" },
  politics: { label: "World Politics", color: "#EF4444", emoji: "\u{1F30D}" },
  economics: { label: "Economics", color: "#10B981", emoji: "\u{1F4C8}" },
  tech: { label: "Tech Industry", color: "#F59E0B", emoji: "\u{1F4BB}" },
  psychology: { label: "Psychology", color: "#EC4899", emoji: "\u{1F9E0}" },
  novels: { label: "Famous Novels", color: "#6366F1", emoji: "\u{1F4DA}" },
  space: { label: "Space News", color: "#1E3A5F", emoji: "\u{1F680}" },
};
