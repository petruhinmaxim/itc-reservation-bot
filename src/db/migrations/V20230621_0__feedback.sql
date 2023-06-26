CREATE TABLE IF NOT EXISTS vpn_user_feedback (
  telegram_user_id BIGSERIAL NOT NULL REFERENCES telegram_user_data(telegram_user_id),
  user_feedback TEXT
);
