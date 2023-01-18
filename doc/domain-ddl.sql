-- V0_0__init.sql
create table if not exists "SystemProperties" (
  "systemPropertyKey" text primary key,
  "systemPropertyValue" text
);

-- V2023015_0__TelegramUsers.sql
create table if not exists "TelegramUsers" (
  "telegramUserId" text primary key,
  "username" text,
  "firstName" text,
  "lastName" text,
  "languageCode" text
)
