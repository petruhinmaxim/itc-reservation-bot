CREATE TABLE IF NOT EXISTS telegram_user_data (
  telegram_user_id BIGSERIAL NOT NULL PRIMARY KEY,
  user_name TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT
);
CREATE INDEX IF NOT EXISTS telegram_user_data_telegram_user_id_idx ON telegram_user_data(telegram_user_id);

CREATE TABLE IF NOT EXISTS user_server_access (
   telegram_user_id BIGSERIAL NOT NULL REFERENCES telegram_user_data(telegram_user_id),
   start_trial_date_id TIMESTAMP WITH TIME ZONE,
   user_access BOOLEAN
);

CREATE TABLE IF NOT EXISTS vpn_user (
  telegram_user_id BIGSERIAL NOT NULL REFERENCES telegram_user_data(telegram_user_id),
  current_scene JSONB NOT NULL,
  primary key (telegram_user_id)
);

CREATE TABLE IF NOT EXISTS vpn_user_action (
  telegram_user_id BIGSERIAL NOT NULL REFERENCES telegram_user_data(telegram_user_id),
  action_at TIMESTAMP WITH TIME ZONE,
  user_scene TEXT
);

CREATE TABLE IF NOT EXISTS vpn_user_feedback (
  telegram_user_id BIGSERIAL NOT NULL REFERENCES telegram_user_data(telegram_user_id),
  user_feedback TEXT
);

CREATE TABLE IF NOT EXISTS server_reservation (
   reservation_date TEXT NOT NULL,
   reservation_time TEXT NOT NULL,
   telegram_user_id BIGSERIAL REFERENCES telegram_user_data(telegram_user_id)
);
