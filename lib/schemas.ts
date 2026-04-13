import { z } from "zod";

export const TOPICS = [
  "ai_ml",
  "system_design",
  "politics",
  "economics",
  "tech",
  "psychology",
  "novels",
  "space",
] as const;

export const CARD_TYPES = [
  "quick_fact",
  "summary",
  "mini_thread",
  "key_insight",
  "did_you_know",
  "short_video",
] as const;

export const DIFFICULTIES = ["casual", "moderate", "deep"] as const;
export const SOURCES = ["static", "gemini_news"] as const;

export const QuickFactContent = z.object({
  fact: z.string().min(1),
  context: z.string().min(1),
});

export const SummaryContent = z.object({
  summary: z.string().min(1),
  key_points: z.array(z.string().min(1)).min(1),
  source_title: z.string().min(1),
});

export const MiniThreadContent = z.object({
  body: z.string().min(1),
  image_hint: z.string().optional(),
});

export const KeyInsightContent = z.object({
  insight: z.string().min(1),
  why_it_matters: z.string().min(1),
  related_topic: z.string().optional(),
});

export const DidYouKnowContent = z.object({
  hook: z.string().min(1),
  explanation: z.string().min(1),
  fun_detail: z.string().min(1),
});

export const ShortVideoContent = z.object({
  youtube_id: z.string().min(1),
  channel_name: z.string().min(1),
  duration_seconds: z.number().int().positive().max(60),
});

export const CardContentByType = {
  quick_fact: QuickFactContent,
  summary: SummaryContent,
  mini_thread: MiniThreadContent,
  key_insight: KeyInsightContent,
  did_you_know: DidYouKnowContent,
  short_video: ShortVideoContent,
} as const;

export const CardSchema = z.object({
  id: z.string().uuid().optional(),
  topic: z.enum(TOPICS),
  card_type: z.enum(CARD_TYPES),
  title: z.string().min(1),
  content: z.unknown(),
  source: z.enum(SOURCES),
  source_url: z.string().url().nullable().optional(),
  difficulty: z.enum(DIFFICULTIES),
  thread_id: z.string().uuid().nullable().optional(),
  thread_order: z.number().int().positive().nullable().optional(),
});

export function validateCardContent(
  cardType: (typeof CARD_TYPES)[number],
  content: unknown
) {
  const schema = CardContentByType[cardType];
  return schema.safeParse(content);
}
