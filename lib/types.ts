import { z } from "zod";
import {
  CardSchema,
  QuickFactContent,
  SummaryContent,
  MiniThreadContent,
  KeyInsightContent,
  DidYouKnowContent,
  TOPICS,
  CARD_TYPES,
} from "./schemas";

export type Card = z.infer<typeof CardSchema> & {
  id: string;
  created_at: string;
  content:
    | z.infer<typeof QuickFactContent>
    | z.infer<typeof SummaryContent>
    | z.infer<typeof MiniThreadContent>
    | z.infer<typeof KeyInsightContent>
    | z.infer<typeof DidYouKnowContent>;
};

export type Topic = (typeof TOPICS)[number];
export type CardType = (typeof CARD_TYPES)[number];

export type UserCardState = {
  id: string;
  user_id: string;
  card_id: string;
  status: "seen" | "saved" | "skipped";
  seen_at: string;
};

export type NewsCache = {
  id: string;
  topic: Topic;
  content: Record<string, unknown>;
  fetched_at: string;
  expires_at: string;
};
