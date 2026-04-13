import { Card } from "../../lib/types";
import { CARD_TYPE_ACCENT } from "../../constants/cardTheme";
import { QuickFactCard } from "./QuickFactCard";
import { SummaryCard } from "./SummaryCard";
import { MiniThreadCard } from "./MiniThreadCard";
import { KeyInsightCard } from "./KeyInsightCard";
import { DidYouKnowCard } from "./DidYouKnowCard";
import { ShortVideoCard } from "./ShortVideoCard";

type Props = {
  card: Card;
  threadPosition?: { current: number; total: number };
  topicColor: string;
};

export function CardRenderer({ card, threadPosition, topicColor }: Props) {
  const accentColor = CARD_TYPE_ACCENT[card.card_type];

  switch (card.card_type) {
    case "quick_fact":
      return <QuickFactCard title={card.title} content={card.content as any} accentColor={accentColor} />;
    case "summary":
      return <SummaryCard title={card.title} content={card.content as any} accentColor={accentColor} />;
    case "mini_thread":
      return (
        <MiniThreadCard
          title={card.title}
          content={card.content as any}
          threadPosition={threadPosition}
          accentColor={accentColor}
        />
      );
    case "key_insight":
      return <KeyInsightCard title={card.title} content={card.content as any} accentColor={accentColor} topicColor={topicColor} />;
    case "did_you_know":
      return <DidYouKnowCard title={card.title} content={card.content as any} accentColor={accentColor} />;
    case "short_video":
      return <ShortVideoCard title={card.title} content={card.content as any} accentColor={accentColor} />;
  }
}
