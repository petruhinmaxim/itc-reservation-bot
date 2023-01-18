create table if not exists "VpnBotUsers" (
  "telegramUserId" text primary key,
  "role" citext not null,
  "userSubscription" jsonb,
  "userSubscriptionHistory" jsonb,
  "createdAt" timestamptz not null
)
