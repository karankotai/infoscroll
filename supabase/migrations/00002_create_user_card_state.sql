CREATE TABLE user_card_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('seen', 'saved', 'skipped')),
  seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id)
);

CREATE INDEX idx_user_card_state_user ON user_card_state(user_id);
CREATE INDEX idx_user_card_state_user_status ON user_card_state(user_id, status);

ALTER TABLE user_card_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_card_state_select" ON user_card_state
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_card_state_insert" ON user_card_state
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_card_state_update" ON user_card_state
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
