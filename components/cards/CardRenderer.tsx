import { Card } from "../../lib/types";
import { QuickFactCard } from "./QuickFactCard";
import { SummaryCard } from "./SummaryCard";
import { MiniThreadCard } from "./MiniThreadCard";
import { KeyInsightCard } from "./KeyInsightCard";
import { DidYouKnowCard } from "./DidYouKnowCard";

type Props = {
  card: Card;
  threadPosition?: { current: number; total: number };
};

export function CardRenderer({ card, threadPosition }: Props) {
  switch (card.card_type) {
    case "quick_fact":
      return <QuickFactCard title={card.title} content={card.content as any} />;
    case "summary":
      return <SummaryCard title={card.title} content={card.content as any} />;
    case "mini_thread":
      return (
        <MiniThreadCard
          title={card.title}
          content={card.content as any}
          threadPosition={threadPosition}
        />
      );
    case "key_insight":
      return <KeyInsightCard title={card.title} content={card.content as any} />;
    case "did_you_know":
      return <DidYouKnowCard title={card.title} content={card.content as any} />;
  }
}
