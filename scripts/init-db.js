const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const catalogPath = path.join(rootDir, "assets", "sleep-catalog.json");
const dbDir = path.join(rootDir, "data");
const dbPath = path.join(dbDir, "astrasonic.sqlite");

function sql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function json(value) {
  return sql(JSON.stringify(value ?? null));
}

function insert(table, values) {
  const columns = Object.keys(values);
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map((column) => values[column]).join(", ")});`;
}

function main() {
  fs.mkdirSync(dbDir, { recursive: true });
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const albums = catalog.albums || [];
  const tracks = catalog.tracks || [];
  const now = new Date().toISOString();
  const statements = [];

  statements.push("PRAGMA foreign_keys = ON;");
  statements.push("DROP TABLE IF EXISTS ingest_items;");
  statements.push("DROP TABLE IF EXISTS ingest_jobs;");
  statements.push(`
CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  creator_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  cover_url TEXT,
  source_folder TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  published_at TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  album_id TEXT REFERENCES albums(id),
  creator_id TEXT,
  title TEXT NOT NULL,
  title_en TEXT,
  artist TEXT,
  type TEXT NOT NULL DEFAULT 'music',
  duration INTEGER NOT NULL DEFAULT 0,
  bpm INTEGER NOT NULL DEFAULT 0,
  musical_key TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  popular INTEGER NOT NULL DEFAULT 0,
  match_text TEXT,
  audio_url TEXT,
  image_css TEXT,
  color_css TEXT,
  source_file TEXT,
  source_path TEXT,
  source_format TEXT,
  waveform_source TEXT,
  peaks_json TEXT,
  usage_json TEXT,
  scene_json TEXT,
  style_json TEXT,
  mood_json TEXT,
  structure_json TEXT,
  rights_status TEXT NOT NULL DEFAULT 'cleared',
  status TEXT NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  published_at TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  file_role TEXT NOT NULL,
  url TEXT,
  local_path TEXT,
  mime_type TEXT,
  created_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  group_name TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS asset_tags (
  asset_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (asset_id, tag_id)
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS ingest_jobs (
  id TEXT PRIMARY KEY,
  creator_id TEXT,
  source_type TEXT NOT NULL,
  source_path TEXT,
  asset_type TEXT NOT NULL,
  status TEXT NOT NULL,
  total_items INTEGER NOT NULL DEFAULT 0,
  success_items INTEGER NOT NULL DEFAULT 0,
  failed_items INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  completed_at TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS ingest_items (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES ingest_jobs(id),
  asset_id TEXT,
  creator_id TEXT,
  original_filename TEXT NOT NULL,
  stored_path TEXT,
  status TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'uploaded',
  error_message TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS creators (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  display_name TEXT NOT NULL,
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  rights_status TEXT NOT NULL DEFAULT 'cleared',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS agreements (
  id TEXT PRIMARY KEY,
  agreement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  required_for_creator INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS creator_agreement_signatures (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  creator_id TEXT,
  agreement_id TEXT NOT NULL REFERENCES agreements(id),
  agreement_type TEXT NOT NULL,
  version TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  scenario TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  signed_at TEXT NOT NULL,
  UNIQUE(user_id, agreement_id, scenario)
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL
);`);
  statements.push("DELETE FROM asset_tags;");
  statements.push("DELETE FROM tags;");
  statements.push("DELETE FROM files;");
  statements.push("DELETE FROM tracks;");
  statements.push("DELETE FROM albums;");
  statements.push("DELETE FROM ingest_jobs;");

  albums.forEach((album, index) => {
    statements.push(insert("albums", {
      id: sql(album.name),
      creator_id: sql("astrasonic-sleep-lab"),
      title: sql(album.title || album.name),
      category: sql(album.category || "睡眠类场景音乐"),
      cover_url: sql(album.cover),
      source_folder: sql(album.sourceFolder),
      description: sql(`${album.title || album.name} · ASTRASONIC 睡眠类场景音乐专辑`),
      status: sql("published"),
      sort_order: index,
      created_at: sql(now),
      published_at: sql(now)
    }));
  });

  tracks.forEach((track, index) => {
    statements.push(insert("tracks", {
      id: sql(track.id),
      album_id: sql(track.album),
      creator_id: sql("astrasonic-sleep-lab"),
      title: sql(track.title),
      title_en: sql(track.titleEn),
      artist: sql(track.artist),
      type: sql(track.type || "music"),
      duration: sql(track.duration),
      bpm: sql(track.bpm),
      musical_key: sql(track.key),
      price: sql(track.price),
      popular: sql(track.popular),
      match_text: sql(track.match),
      audio_url: sql(track.audio),
      image_css: sql(track.image),
      color_css: sql(track.color),
      source_file: sql(track.sourceFile),
      source_path: sql(track.sourcePath),
      source_format: sql(track.sourceFormat),
      waveform_source: sql(track.waveformSource),
      peaks_json: json(track.peaks || []),
      usage_json: json(track.usage || []),
      scene_json: json(track.scene || []),
      style_json: json(track.style || []),
      mood_json: json(track.mood || []),
      structure_json: json(track.structure || []),
      rights_status: sql("cleared"),
      status: sql("published"),
      sort_order: index,
      created_at: sql(track.ingestedAt || now),
      published_at: sql(track.ingestedAt || now)
    }));
    statements.push(insert("files", {
      id: sql(`${track.id}-source`),
      asset_id: sql(track.id),
      file_role: sql("source_wav"),
      url: "NULL",
      local_path: sql(track.sourcePath),
      mime_type: sql("audio/wav"),
      created_at: sql(now)
    }));
    statements.push(insert("files", {
      id: sql(`${track.id}-preview`),
      asset_id: sql(track.id),
      file_role: sql("preview_mp3"),
      url: sql(track.audio),
      local_path: sql(path.join(rootDir, track.audio.replace(/^\.\//, ""))),
      mime_type: sql("audio/mpeg"),
      created_at: sql(now)
    }));

    const tagGroups = {
      album: [track.album],
      usage: track.usage,
      scene: track.scene,
      style: track.style,
      mood: track.mood,
      structure: track.structure
    };
    Object.entries(tagGroups).forEach(([groupName, tags]) => {
      (tags || []).forEach((label) => {
        const tagId = `${groupName}:${label}`;
        statements.push(`INSERT OR IGNORE INTO tags (id, label, group_name) VALUES (${sql(tagId)}, ${sql(label)}, ${sql(groupName)});`);
        statements.push(`INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (${sql(track.id)}, ${sql(tagId)});`);
      });
    });
  });

  statements.push(insert("ingest_jobs", {
    id: sql("seed-astrasonic-sleep-library"),
    creator_id: sql("astrasonic-sleep-lab"),
    source_type: sql("local_catalog_seed"),
    source_path: sql(catalogPath),
    asset_type: sql("music"),
    status: sql("completed"),
    total_items: tracks.length,
    success_items: tracks.length,
    failed_items: 0,
    created_at: sql(now),
    completed_at: sql(now)
  }));

  [
    ["service", "用户服务协议", "会员账号、平台访问和基础服务条款。"],
    ["privacy", "隐私政策", "个人信息收集、使用、存储和保护规则。"],
    ["creator", "创作者入驻协议", "创作者身份、作品上传、平台运营和账号责任。"],
    ["copyright_split", "版权授权与分成协议", "作品展示、试听、推广、商业授权、转授权和收益分成规则。"],
    ["upload_policy", "内容上传规范", "禁止侵权、未授权采样、违法内容、虚假标注和恶意上传。"],
    ["ai_disclosure", "AI 生成/辅助生成披露规则", "如作品使用 AI 生成或辅助生成，创作者需如实披露。"]
  ].forEach(([type, title, content]) => {
    const version = "2026.05";
    const hash = require("crypto").createHash("sha256").update(`${type}:${version}:${content}`).digest("hex");
    statements.push(`INSERT OR IGNORE INTO agreements (id, agreement_type, title, version, content, content_hash, required_for_creator, active, created_at) VALUES (${sql(`agr-${type}-${version}`)}, ${sql(type)}, ${sql(title)}, ${sql(version)}, ${sql(content)}, ${sql(hash)}, 1, 1, ${sql(now)});`);
  });

  execFileSync("sqlite3", [dbPath], { input: `BEGIN;\n${statements.join("\n")}\nCOMMIT;\n` });
  console.log(`Seeded ${albums.length} albums and ${tracks.length} tracks into ${dbPath}`);
}

main();
