import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { z } from "zod";
import {
  QuickFactContent,
  SummaryContent,
  MiniThreadContent,
  KeyInsightContent,
  DidYouKnowContent,
} from "./schemas.js";

config({ path: join(import.meta.dirname, "..", ".env") });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CONTENT_SCHEMAS: Record<string, z.ZodType> = {
  "quick-fact": QuickFactContent,
  summary: SummaryContent,
  "mini-thread": MiniThreadContent,
  "key-insight": KeyInsightContent,
  "did-you-know": DidYouKnowContent,
};

const CARD_TYPE_MAP: Record<string, string> = {
  "quick-fact": "quick_fact",
  summary: "summary",
  "mini-thread": "mini_thread",
  "key-insight": "key_insight",
  "did-you-know": "did_you_know",
};

const OUTPUT_DIR = join(import.meta.dirname, "..", "output");

async function main() {
  const files = readdirSync(OUTPUT_DIR).filter(
    (f) => f.endsWith(".json") && !f.includes("manifest") && !f.includes("prompt")
  );

  let totalUploaded = 0;
  let totalFailed = 0;

  // Known card-type keys as they appear in filenames (hyphenated form).
  // Filenames follow the pattern: {topic}_{card-type-key}.json
  // where topic uses underscores (ai_ml) and card type uses hyphens (quick-fact).
  const KNOWN_CARD_TYPE_KEYS = Object.keys(CARD_TYPE_MAP);

  for (const file of files) {
    const baseName = file.replace(".json", "");

    // Find which known card-type key the filename ends with.
    // This handles topics that contain underscores (e.g. ai_ml, system_design).
    let topic = "";
    let cardTypeKey = "";
    for (const key of KNOWN_CARD_TYPE_KEYS) {
      if (baseName.endsWith(`_${key}`)) {
        topic = baseName.slice(0, -(key.length + 1));
        cardTypeKey = key;
        break;
      }
    }

    const cardType = CARD_TYPE_MAP[cardTypeKey];
    const schema = CONTENT_SCHEMAS[cardTypeKey];

    if (!cardType || !schema) {
      console.log(`Skipping unknown file: ${file}`);
      continue;
    }

    const data = JSON.parse(readFileSync(join(OUTPUT_DIR, file), "utf-8"));
    const cards: Array<Record<string, unknown>> = [];

    if (cardTypeKey === "mini-thread") {
      for (const thread of data) {
        const threadId = crypto.randomUUID();
        for (let i = 0; i < thread.cards.length; i++) {
          const cardContent = thread.cards[i];
          const result = schema.safeParse(cardContent);
          if (!result.success) {
            console.log(`  FAIL [${file}] "${thread.title}" card ${i + 1}: ${result.error.message}`);
            totalFailed++;
            continue;
          }
          cards.push({
            topic,
            card_type: cardType,
            title: thread.title,
            content: cardContent,
            source: "static",
            difficulty: thread.difficulty || "casual",
            thread_id: threadId,
            thread_order: i + 1,
          });
        }
      }
    } else {
      for (const item of data) {
        const result = schema.safeParse(item.content);
        if (!result.success) {
          console.log(`  FAIL [${file}] "${item.title}": ${result.error.message}`);
          totalFailed++;
          continue;
        }
        cards.push({
          topic,
          card_type: cardType,
          title: item.title,
          content: item.content,
          source: "static",
          difficulty: item.difficulty || "casual",
        });
      }
    }

    if (cards.length > 0) {
      for (let i = 0; i < cards.length; i += 100) {
        const batch = cards.slice(i, i + 100);
        const { error } = await supabase.from("cards").insert(batch);
        if (error) {
          console.log(`  DB ERROR [${file}] batch ${i}: ${error.message}`);
          totalFailed += batch.length;
        } else {
          totalUploaded += batch.length;
        }
      }
    }

    console.log(`${file}: ${cards.length} cards processed`);
  }

  console.log(`\nDone. Uploaded: ${totalUploaded}, Failed: ${totalFailed}`);
}

main().catch(console.error);
