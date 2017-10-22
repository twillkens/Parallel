CREATE TABLE profiles (
  id INTEGER PRIMARY KEY NOT NULL,
  url TEXT,
  createdAt INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE archives (
  profileId INTEGER NOT NULL,
  key TEXT NOT NULL,
  localPath TEXT,
  isSaved INTEGER,
  createdAt INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE archives_meta (
  key TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  forkOf TEXT,
  createdByUrl TEXT,
  createdByTitle TEXT,
  mtime INTEGER,
  metaSize INTEGER,
  stagingSize INTEGER,
  isOwner INTEGER
);

CREATE TABLE bookmarks (
  profileId INTEGER,
  url TEXT NOT NULL,
  title TEXT,
  pinned INTEGER,
  createdAt INTEGER DEFAULT (strftime('%s', 'now')),

  PRIMARY KEY (profileId, url),
  FOREIGN KEY (profileId) REFERENCES profiles (id) ON DELETE CASCADE
);

CREATE TABLE visits (
  profileId INTEGER,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  ts INTEGER NOT NULL,

  FOREIGN KEY (profileId) REFERENCES profiles (id) ON DELETE CASCADE
);

CREATE TABLE visit_stats (
  url TEXT NOT NULL,
  num_visits INTEGER,
  last_visit_ts INTEGER
);

CREATE VIRTUAL TABLE visit_fts USING fts4 (url, title);
CREATE UNIQUE INDEX visits_stats_url ON visit_stats (url);

-- default profile
INSERT INTO profiles (id) VALUES (0);

-- default bookmarks
INSERT INTO bookmarks (profileId, title, url, pinned) VALUES (0, 'START', 'dat://ca4ed3a956dd8ba2a6025cfa44cffe4b220298194009b130aa0b5fe2fae00f9a', 1);

PRAGMA user_version = 1;
