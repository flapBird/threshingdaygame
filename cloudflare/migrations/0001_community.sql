CREATE TABLE riders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 24)
);
CREATE TABLE bonds (
  id TEXT PRIMARY KEY,
  rider_id TEXT NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  dragon_id TEXT NOT NULL,
  strength INTEGER NOT NULL CHECK(strength BETWEEN 0 AND 100),
  created_at INTEGER NOT NULL
);
CREATE INDEX bonds_rider_date ON bonds(rider_id, created_at);
CREATE INDEX bonds_recent ON bonds(created_at DESC);
