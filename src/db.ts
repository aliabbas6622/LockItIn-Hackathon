import Database from 'better-sqlite3';

const db = new Database('lockitin.db', { verbose: console.log });

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    decision_id TEXT NOT NULL,
    text TEXT NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (decision_id) REFERENCES decisions (id)
  );

  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    decision_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (decision_id) REFERENCES decisions (id)
  );

  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    participant_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants (id),
    FOREIGN KEY (question_id) REFERENCES questions (id)
  );

  CREATE TABLE IF NOT EXISTS analysis (
    id TEXT PRIMARY KEY,
    decision_id TEXT NOT NULL,
    verdict_title TEXT NOT NULL,
    verdict_description TEXT NOT NULL,
    budget_score INTEGER,
    time_score INTEGER,
    group_size_score INTEGER,
    insights TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (decision_id) REFERENCES decisions (id)
  );
`);

export default db;
