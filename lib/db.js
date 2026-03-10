const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'retro.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db = null;

function getDb() {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  bootstrap(_db);
  return _db;
}

function bootstrap(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      format            TEXT NOT NULL,
      phase             TEXT NOT NULL DEFAULT 'write',
      facilitator_token TEXT NOT NULL,
      max_votes         INTEGER NOT NULL DEFAULT 3,
      timer_ends_at     INTEGER,
      created_at        INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
      updated_at        INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
    );

    CREATE TABLE IF NOT EXISTS cards (
      id          TEXT PRIMARY KEY,
      session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      column_id   TEXT NOT NULL,
      author_id   TEXT NOT NULL,
      author_name TEXT NOT NULL,
      content     TEXT NOT NULL,
      is_hidden   INTEGER NOT NULL DEFAULT 1,
      position    INTEGER NOT NULL DEFAULT 0,
      created_at  INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
      updated_at  INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
    );

    CREATE TABLE IF NOT EXISTS votes (
      id         TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      card_id    TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      voter_id   TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
      UNIQUE(card_id, voter_id)
    );

    CREATE INDEX IF NOT EXISTS idx_cards_session ON cards(session_id);
    CREATE INDEX IF NOT EXISTS idx_votes_session ON votes(session_id);
    CREATE INDEX IF NOT EXISTS idx_votes_card    ON votes(card_id);
  `);
}

module.exports = { getDb };
