import { getDbPool } from "@/lib/db";
import { categories, regions, trends as mockTrends } from "@/lib/mock-data";
import { Trend } from "@/lib/types";

type FetchOptions = {
  region?: string;
  kategori?: string;
  sok?: string;
  limit?: number;
};

type TrendRow = {
  id: string;
  navn: string;
  kategori: string;
  region: string;
  land: string;
  vekst_prosent: number;
  trend_score: number;
  overvaket_av: number;
  styrke: "Lav" | "Moderat" | "Sterk" | "Ekstrem";
  sparkline: number[];
  vekst_h24: number;
  vekst_d7: number;
  vekst_d30: number;
  oppsummering: string;
};

type SourceRow = {
  trend_id: string;
  name: string;
  url: string;
};

let initialized = false;

async function ensureSchemaAndSeed() {
  if (initialized) return;

  const pool = getDbPool();

  await pool.query(`
    create table if not exists trends (
      id text primary key,
      navn text not null,
      kategori text not null,
      region text not null,
      land text not null,
      vekst_prosent double precision not null,
      trend_score integer not null,
      overvaket_av integer not null,
      styrke text not null,
      sparkline jsonb not null default '[]'::jsonb,
      vekst_h24 double precision not null,
      vekst_d7 double precision not null,
      vekst_d30 double precision not null,
      oppsummering text not null
    );
  `);

  await pool.query(`
    create table if not exists trend_sources (
      id bigserial primary key,
      trend_id text not null references trends(id) on delete cascade,
      name text not null,
      url text not null
    );
  `);

  await pool.query(`create index if not exists idx_trend_sources_trend_id on trend_sources(trend_id);`);

  const countResult = await pool.query<{ count: string }>("select count(*)::text as count from trends;");
  const count = Number(countResult.rows[0]?.count ?? "0");

  if (count === 0) {
    const client = await pool.connect();
    try {
      await client.query("begin");

      for (const trend of mockTrends) {
        await client.query(
          `
          insert into trends (
            id, navn, kategori, region, land, vekst_prosent, trend_score,
            overvaket_av, styrke, sparkline, vekst_h24, vekst_d7, vekst_d30, oppsummering
          ) values (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10::jsonb, $11, $12, $13, $14
          )
          on conflict (id) do nothing;
        `,
          [
            trend.id,
            trend.navn,
            trend.kategori,
            trend.region,
            trend.land,
            trend.vekstProsent,
            trend.trendScore,
            trend.overvaketAv,
            trend.styrke,
            JSON.stringify(trend.sparkline),
            trend.vekst.h24,
            trend.vekst.d7,
            trend.vekst.d30,
            trend.oppsummering
          ]
        );

        for (const source of trend.kilder) {
          await client.query(
            `
            insert into trend_sources (trend_id, name, url)
            values ($1, $2, $3);
          `,
            [trend.id, source.name, source.url]
          );
        }
      }

      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  initialized = true;
}

function mapTrendRows(rows: TrendRow[], sourceRows: SourceRow[]): Trend[] {
  const byTrend = new Map<string, Array<{ name: string; url: string }>>();

  for (const source of sourceRows) {
    const list = byTrend.get(source.trend_id) ?? [];
    list.push({ name: source.name, url: source.url });
    byTrend.set(source.trend_id, list);
  }

  return rows.map((row) => ({
    id: row.id,
    navn: row.navn,
    kategori: row.kategori as Trend["kategori"],
    region: row.region as Trend["region"],
    land: row.land,
    vekstProsent: Number(row.vekst_prosent),
    trendScore: Number(row.trend_score),
    overvaketAv: Number(row.overvaket_av),
    styrke: row.styrke,
    sparkline: Array.isArray(row.sparkline) ? row.sparkline.map(Number) : [],
    vekst: {
      h24: Number(row.vekst_h24),
      d7: Number(row.vekst_d7),
      d30: Number(row.vekst_d30)
    },
    kilder: byTrend.get(row.id) ?? [],
    oppsummering: row.oppsummering
  }));
}

function applyMockFilter(options: FetchOptions) {
  const source = [...mockTrends];
  const filtered = source.filter((trend) => {
    const regionMatch =
      !options.region ||
      options.region === "Hele verden" ||
      trend.region === options.region ||
      trend.region === "Hele verden";
    const kategoriMatch = !options.kategori || options.kategori === "Alle" || trend.kategori === options.kategori;
    const sokMatch =
      !options.sok ||
      trend.navn.toLowerCase().includes(options.sok.toLowerCase()) ||
      trend.land.toLowerCase().includes(options.sok.toLowerCase());

    return regionMatch && kategoriMatch && sokMatch;
  });

  if (options.limit && options.limit > 0) {
    return filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function fetchAllTrends(options: FetchOptions = {}) {
  if (!process.env.DATABASE_URL) {
    return applyMockFilter(options);
  }

  await ensureSchemaAndSeed();

  const pool = getDbPool();
  const where: string[] = [];
  const values: unknown[] = [];

  if (options.region && options.region !== "Hele verden") {
    values.push(options.region);
    where.push(`(region = $${values.length} or region = 'Hele verden')`);
  }

  if (options.kategori && options.kategori !== "Alle") {
    values.push(options.kategori);
    where.push(`kategori = $${values.length}`);
  }

  if (options.sok) {
    values.push(`%${options.sok}%`);
    where.push(`(navn ilike $${values.length} or land ilike $${values.length})`);
  }

  let query = `
    select
      id, navn, kategori, region, land, vekst_prosent, trend_score,
      overvaket_av, styrke, sparkline, vekst_h24, vekst_d7, vekst_d30, oppsummering
    from trends
  `;

  if (where.length > 0) {
    query += ` where ${where.join(" and ")}`;
  }

  query += " order by vekst_prosent desc, trend_score desc";

  if (options.limit && options.limit > 0) {
    values.push(options.limit);
    query += ` limit $${values.length}`;
  }

  const trendsResult = await pool.query<TrendRow>(query, values);

  if (trendsResult.rows.length === 0) {
    return [];
  }

  const ids = trendsResult.rows.map((item) => item.id);
  const sourceResult = await pool.query<SourceRow>(
    "select trend_id, name, url from trend_sources where trend_id = any($1::text[]) order by id asc;",
    [ids]
  );

  return mapTrendRows(trendsResult.rows, sourceResult.rows);
}

export async function fetchTrendById(id: string) {
  if (!process.env.DATABASE_URL) {
    return mockTrends.find((trend) => trend.id === id) ?? null;
  }

  await ensureSchemaAndSeed();

  const pool = getDbPool();
  const trendResult = await pool.query<TrendRow>(
    `
      select
        id, navn, kategori, region, land, vekst_prosent, trend_score,
        overvaket_av, styrke, sparkline, vekst_h24, vekst_d7, vekst_d30, oppsummering
      from trends
      where id = $1
      limit 1;
    `,
    [id]
  );

  if (trendResult.rows.length === 0) {
    return null;
  }

  const sourceResult = await pool.query<SourceRow>(
    "select trend_id, name, url from trend_sources where trend_id = $1 order by id asc;",
    [id]
  );

  const mapped = mapTrendRows(trendResult.rows, sourceResult.rows);
  return mapped[0] ?? null;
}

export { categories, regions };