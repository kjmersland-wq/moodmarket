-- PostgreSQL-klargjort schema for fremtidig lagring.
-- Denne MVP-en bruker lokal mockdata og ingen API-tilkoblinger.

create table if not exists trends (
  id text primary key,
  name text not null,
  category text not null,
  country text not null,
  region text not null,
  trend_score integer not null,
  growth_24h numeric not null,
  growth_7d numeric not null,
  growth_30d numeric not null,
  strength integer not null,
  watched_by integer not null,
  created_at timestamptz not null default now()
);

create table if not exists trend_sources (
  id bigserial primary key,
  trend_id text not null references trends(id) on delete cascade,
  source_type text not null,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);
