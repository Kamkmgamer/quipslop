import { Database } from "bun:sqlite";
import type { RoundState } from "./game.ts";

export const db = new Database("quipslop.sqlite", { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    data TEXT
  );
`);

export function saveRound(round: RoundState) {
  const insert = db.prepare("INSERT INTO rounds (num, data) VALUES ($num, $data)");
  insert.run({ $num: round.num, $data: JSON.stringify(round) });
}

export function getRounds(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  const countQuery = db.query("SELECT COUNT(*) as count FROM rounds").get() as { count: number };
  const rows = db.query("SELECT data FROM rounds ORDER BY id DESC LIMIT $limit OFFSET $offset")
    .all({ $limit: limit, $offset: offset }) as { data: string }[];
  return {
    rounds: rows.map(r => JSON.parse(r.data) as RoundState),
    total: countQuery.count,
    page,
    limit,
    totalPages: Math.ceil(countQuery.count / limit)
  };
}
