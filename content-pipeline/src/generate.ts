import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const TOPICS: Record<string, string> = {
  ai_ml: "artificial intelligence, machine learning, deep learning, LLMs, and neural networks",
  system_design: "distributed systems, system architecture, scalability patterns, and real-world engineering at companies like Netflix, Uber, Google",
  politics: "world politics, geopolitics, international relations, governance, and political systems",
  economics: "macroeconomics, microeconomics, behavioral economics, monetary policy, and global trade",
  tech: "the tech industry, startups, product launches, Silicon Valley, and technology business strategy",
  psychology: "psychology, cognitive science, behavioral science, social psychology, and mental models",
  novels: "famous novels, classic literature, notable authors, literary movements, and storytelling craft",
  space: "space exploration, astronomy, astrophysics, NASA, SpaceX, and the cosmos",
};

const CARD_TARGETS: Record<string, number> = {
  "quick-fact": 80,
  summary: 60,
  "mini-thread": 15,
  "key-insight": 60,
  "did-you-know": 55,
};

const PROMPTS_DIR = join(import.meta.dirname, "prompts");
const OUTPUT_DIR = join(import.meta.dirname, "..", "output");

function loadPrompt(cardType: string): string {
  return readFileSync(join(PROMPTS_DIR, `${cardType}.txt`), "utf-8");
}

function getExistingTitles(topic: string): string[] {
  const outputFile = join(OUTPUT_DIR, `${topic}.json`);
  if (!existsSync(outputFile)) return [];
  const data = JSON.parse(readFileSync(outputFile, "utf-8"));
  return data.map((card: { title: string }) => card.title);
}

function buildPrompt(
  template: string,
  topic: string,
  topicDesc: string,
  count: number,
  existingTitles: string[]
): string {
  return template
    .replace("{{COUNT}}", String(count))
    .replace("{{TOPIC_DESCRIPTION}}", topicDesc)
    .replace("{{EXISTING_TITLES}}", existingTitles.length > 0 ? existingTitles.join(", ") : "none");
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const tasks: Array<{
    topic: string;
    cardType: string;
    prompt: string;
    outputPath: string;
  }> = [];

  for (const [topic, topicDesc] of Object.entries(TOPICS)) {
    const existingTitles = getExistingTitles(topic);

    for (const [cardType, count] of Object.entries(CARD_TARGETS)) {
      const template = loadPrompt(cardType);
      const prompt = buildPrompt(template, topic, topicDesc, count, existingTitles);

      tasks.push({
        topic,
        cardType,
        prompt,
        outputPath: join(OUTPUT_DIR, `${topic}_${cardType}.json`),
      });
    }
  }

  const manifestPath = join(OUTPUT_DIR, "generation-manifest.json");
  writeFileSync(
    manifestPath,
    JSON.stringify(
      tasks.map((t) => ({
        topic: t.topic,
        cardType: t.cardType,
        outputPath: t.outputPath,
        promptLength: t.prompt.length,
      })),
      null,
      2
    )
  );

  for (const task of tasks) {
    const promptPath = join(OUTPUT_DIR, `prompt_${task.topic}_${task.cardType}.txt`);
    writeFileSync(promptPath, task.prompt);
  }

  console.log(`Generated ${tasks.length} generation tasks.`);
  console.log(`Manifest: ${manifestPath}`);
  console.log("\nNext steps:");
  console.log("1. Feed each prompt file to a Claude subagent");
  console.log("2. Save the JSON response to the corresponding output path");
  console.log('3. Run "npm run upload" to validate and upload to Supabase');
}

main().catch(console.error);
