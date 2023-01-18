create table if not exists "TelegramUsers" (
  "telegramUserId" text primary key,
  "username" text,
  "firstName" text,
  "lastName" text,
  "languageCode" text
)
