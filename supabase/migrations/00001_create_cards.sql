CREATE EXTENSION IF NOT EXISTS pg_jsonschema WITH SCHEMA extensions;

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL CHECK (topic IN (
    'ai_ml', 'system_design', 'politics', 'economics',
    'tech', 'psychology', 'novels', 'space'
  )),
  card_type TEXT NOT NULL CHECK (card_type IN (
    'quick_fact', 'summary', 'mini_thread', 'key_insight', 'did_you_know'
  )),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  source TEXT NOT NULL DEFAULT 'static' CHECK (source IN ('static', 'gemini_news')),
  source_url TEXT,
  difficulty TEXT NOT NULL DEFAULT 'casual' CHECK (difficulty IN (
    'casual', 'moderate', 'deep'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  thread_id UUID,
  thread_order INT CHECK (thread_order > 0)
);

ALTER TABLE cards ADD CONSTRAINT valid_card_content CHECK (
  CASE card_type
    WHEN 'quick_fact' THEN extensions.jsonb_matches_schema(
      '{"type":"object","required":["fact","context"],"properties":{"fact":{"type":"string","minLength":1},"context":{"type":"string","minLength":1}}}',
      content
    )
    WHEN 'summary' THEN extensions.jsonb_matches_schema(
      '{"type":"object","required":["summary","key_points","source_title"],"properties":{"summary":{"type":"string","minLength":1},"key_points":{"type":"array","items":{"type":"string","minLength":1},"minItems":1},"source_title":{"type":"string","minLength":1}}}',
      content
    )
    WHEN 'mini_thread' THEN extensions.jsonb_matches_schema(
      '{"type":"object","required":["body"],"properties":{"body":{"type":"string","minLength":1},"image_hint":{"type":"string"}}}',
      content
    )
    WHEN 'key_insight' THEN extensions.jsonb_matches_schema(
      '{"type":"object","required":["insight","why_it_matters"],"properties":{"insight":{"type":"string","minLength":1},"why_it_matters":{"type":"string","minLength":1},"related_topic":{"type":"string"}}}',
      content
    )
    WHEN 'did_you_know' THEN extensions.jsonb_matches_schema(
      '{"type":"object","required":["hook","explanation","fun_detail"],"properties":{"hook":{"type":"string","minLength":1},"explanation":{"type":"string","minLength":1},"fun_detail":{"type":"string","minLength":1}}}',
      content
    )
    ELSE false
  END
);

CREATE INDEX idx_cards_topic ON cards(topic);
CREATE INDEX idx_cards_card_type ON cards(card_type);
CREATE INDEX idx_cards_thread_id ON cards(thread_id) WHERE thread_id IS NOT NULL;

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cards_read" ON cards
  FOR SELECT TO authenticated
  USING (true);
