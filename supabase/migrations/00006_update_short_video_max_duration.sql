-- Update pg_jsonschema constraint to allow up to 120 seconds for short videos
-- (Fireship "100 Seconds" series are ~100s and are top-tier educational content)
ALTER TABLE cards DROP CONSTRAINT IF EXISTS valid_card_content;
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
    WHEN 'short_video' THEN extensions.jsonb_matches_schema(
      '{"type":"object","required":["youtube_id","channel_name","duration_seconds"],"properties":{"youtube_id":{"type":"string","minLength":1},"channel_name":{"type":"string","minLength":1},"duration_seconds":{"type":"integer","minimum":1,"maximum":120}}}',
      content
    )
    ELSE false
  END
);
