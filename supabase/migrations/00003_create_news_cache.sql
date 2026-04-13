CREATE TABLE news_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL CHECK (topic IN (
    'ai_ml', 'system_design', 'politics', 'economics',
    'tech', 'psychology', 'novels', 'space'
  )),
  content JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours')
);

CREATE INDEX idx_news_cache_topic_expires ON news_cache(topic, expires_at);

ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_cache_read" ON news_cache
  FOR SELECT TO authenticated
  USING (true);
