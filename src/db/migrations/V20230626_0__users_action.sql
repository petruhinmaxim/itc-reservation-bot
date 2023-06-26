CREATE TABLE IF NOT EXISTS vpn_user_action (
  telegram_user_id BIGSERIAL NOT NULL REFERENCES telegram_user_data(telegram_user_id),
  action_at TIMESTAMP WITH TIME ZONE,
  user_scene TEXT
);
