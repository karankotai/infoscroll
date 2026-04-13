CREATE OR REPLACE FUNCTION get_feed(p_user_id UUID, p_limit INT DEFAULT 20)
RETURNS SETOF cards
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_topic_counts JSONB;
  v_all_topics TEXT[] := ARRAY[
    'ai_ml', 'system_design', 'politics', 'economics',
    'tech', 'psychology', 'novels', 'space'
  ];
  v_target_per_topic INT;
  v_result UUID[];
  v_topic TEXT;
  v_topic_limit INT;
  v_recent_topic_count INT;
  v_total_fetched INT := 0;
BEGIN
  SELECT COALESCE(jsonb_object_agg(topic, cnt), '{}'::jsonb)
  INTO v_topic_counts
  FROM (
    SELECT topic, COUNT(*) AS cnt
    FROM (
      SELECT c.topic
      FROM user_card_state ucs
      JOIN cards c ON c.id = ucs.card_id
      WHERE ucs.user_id = p_user_id
        AND ucs.status IN ('seen', 'skipped')
      ORDER BY ucs.seen_at DESC
      LIMIT 20
    ) recent_rows
    GROUP BY topic
  ) recent;

  v_target_per_topic := GREATEST(p_limit / array_length(v_all_topics, 1), 1);

  FOREACH v_topic IN ARRAY v_all_topics
  LOOP
    v_recent_topic_count := COALESCE((v_topic_counts ->> v_topic)::INT, 0);
    v_topic_limit := GREATEST(v_target_per_topic - v_recent_topic_count + 1, 1);

    v_result := v_result || ARRAY(
      SELECT c.id
      FROM cards c
      WHERE c.topic = v_topic
        AND c.source = 'static'
        AND NOT EXISTS (
          SELECT 1 FROM user_card_state ucs
          WHERE ucs.user_id = p_user_id
            AND ucs.card_id = c.id
        )
        AND (c.thread_id IS NULL OR c.thread_order = 1)
      ORDER BY random()
      LIMIT v_topic_limit
    );
  END LOOP;

  v_result := v_result || ARRAY(
    SELECT c2.id
    FROM cards c2
    WHERE c2.thread_id IN (
      SELECT c3.thread_id FROM cards c3 WHERE c3.id = ANY(v_result) AND c3.thread_id IS NOT NULL
    )
    AND c2.id != ALL(v_result)
    ORDER BY c2.thread_order
  );

  RETURN QUERY
  SELECT c.*
  FROM cards c
  WHERE c.id = ANY(v_result)
  ORDER BY
    COALESCE(c.thread_id, c.id),
    COALESCE(c.thread_order, 0),
    random()
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION get_feed(UUID, INT) TO authenticated;
