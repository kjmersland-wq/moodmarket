import { getDbPool } from "@/lib/db";

export type Account = {
  id: number;
  email: string;
  navn: string | null;
  aktiv: boolean;
  opprettet: string;
};

let accountSchemaReady = false;

async function ensureAccountSchema() {
  if (accountSchemaReady) return;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL mangler");
  }

  const pool = getDbPool();
  await pool.query(`
    create table if not exists app_accounts (
      id bigserial primary key,
      email text not null unique,
      navn text,
      aktiv boolean not null default true,
      opprettet timestamptz not null default now()
    );
  `);

  accountSchemaReady = true;
}

export async function listAccounts(): Promise<Account[]> {
  await ensureAccountSchema();
  const pool = getDbPool();
  const result = await pool.query<{
    id: number;
    email: string;
    navn: string | null;
    aktiv: boolean;
    opprettet: string;
  }>(
    `
      select id, email, navn, aktiv, opprettet
      from app_accounts
      order by opprettet desc;
    `
  );

  return result.rows;
}

export async function findAccountByEmail(email: string): Promise<Account | null> {
  await ensureAccountSchema();
  const pool = getDbPool();
  const result = await pool.query<Account>(
    `
      select id, email, navn, aktiv, opprettet
      from app_accounts
      where email = $1
      limit 1;
    `,
    [email.trim().toLowerCase()]
  );

  return result.rows[0] ?? null;
}

export async function upsertAccount(input: { email: string; navn?: string | null }) {
  await ensureAccountSchema();
  const pool = getDbPool();
  const result = await pool.query<Account>(
    `
      insert into app_accounts (email, navn)
      values ($1, nullif($2, ''))
      on conflict (email)
      do update set
        navn = excluded.navn,
        aktiv = true
      returning id, email, navn, aktiv, opprettet;
    `,
    [input.email.trim().toLowerCase(), input.navn ?? null]
  );

  return result.rows[0];
}

export async function setAccountStatus(id: number, aktiv: boolean) {
  await ensureAccountSchema();
  const pool = getDbPool();
  const result = await pool.query<Account>(
    `
      update app_accounts
      set aktiv = $2
      where id = $1
      returning id, email, navn, aktiv, opprettet;
    `,
    [id, aktiv]
  );

  return result.rows[0] ?? null;
}