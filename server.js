const fs = require("fs");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const rootDir = __dirname;
const dbPath = path.join(rootDir, "data", "astrasonic.sqlite");
const uploadDir = path.join(rootDir, "data", "uploads");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function sql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function query(sql) {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const output = execFileSync("sqlite3", ["-json", dbPath, sql], { encoding: "utf8" });
  return output.trim() ? JSON.parse(output) : [];
}

function execute(sqlText) {
  execFileSync("sqlite3", [dbPath], { input: sqlText });
}

function first(sqlText) {
  return query(sqlText)[0] || null;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        request.destroy();
        reject(new Error("Request body is too large"));
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    request.on("error", reject);
  });
}

function readBuffer(request, limit = 300_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        request.destroy();
        reject(new Error("Upload is too large"));
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw new Error("Missing multipart boundary");
  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const parts = {};
  let cursor = buffer.indexOf(boundary);
  while (cursor !== -1) {
    cursor += boundary.length;
    if (buffer[cursor] === 45 && buffer[cursor + 1] === 45) break;
    if (buffer[cursor] === 13 && buffer[cursor + 1] === 10) cursor += 2;
    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), cursor);
    if (headerEnd === -1) break;
    const header = buffer.slice(cursor, headerEnd).toString("utf8");
    const nextBoundary = buffer.indexOf(boundary, headerEnd + 4);
    if (nextBoundary === -1) break;
    let body = buffer.slice(headerEnd + 4, nextBoundary);
    if (body.length >= 2 && body[body.length - 2] === 13 && body[body.length - 1] === 10) body = body.slice(0, -2);
    const name = header.match(/name="([^"]+)"/)?.[1];
    if (name) {
      const filename = header.match(/filename="([^"]*)"/)?.[1] || "";
      const type = header.match(/content-type:\s*([^\r\n]+)/i)?.[1] || "";
      parts[name] = filename ? { filename, type, data: body } : body.toString("utf8");
    }
    cursor = nextBoundary;
  }
  return parts;
}

function cookieValue(request, name) {
  const cookies = request.headers.cookie || "";
  return cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256").toString("hex");
  return { passwordHash, salt };
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function resetBaseUrl(request) {
  const host = request.headers.host || `127.0.0.1:${port}`;
  const proto = request.headers["x-forwarded-proto"] || "http";
  return `${proto}://${host}`;
}

function ensurePasswordResetTable() {
  execute(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      requested_ip TEXT,
      user_agent TEXT
    );
  `);
}

function createSession(response, userId) {
  const id = crypto.randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14);
  execute(`INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (${sql(id)}, ${sql(userId)}, ${sql(now.toISOString())}, ${sql(expires.toISOString())});`);
  response.setHeader("set-cookie", `astrasonic_session=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`);
}

function clearSession(response, sessionId) {
  if (sessionId) execute(`DELETE FROM sessions WHERE id = ${sql(sessionId)};`);
  response.setHeader("set-cookie", "astrasonic_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at
  };
}

function getAuth(request) {
  const sessionId = cookieValue(request, "astrasonic_session");
  if (!sessionId) return { user: null, creator: null, sessionId: "" };
  const user = first(`
    SELECT users.* FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ${sql(sessionId)} AND sessions.expires_at > datetime('now')
    LIMIT 1;
  `);
  if (!user) return { user: null, creator: null, sessionId };
  const creator = first(`SELECT * FROM creators WHERE user_id = ${sql(user.id)} LIMIT 1;`);
  return { user, creator, sessionId };
}

function agreements() {
  return query("SELECT id, agreement_type, title, version, content, content_hash, required_for_creator FROM agreements WHERE active = 1 ORDER BY agreement_type ASC;")
    .map((item) => ({
      id: item.id,
      type: item.agreement_type,
      title: item.title,
      version: item.version,
      content: item.content,
      contentHash: item.content_hash,
      requiredForCreator: Boolean(item.required_for_creator)
    }));
}

const requiredAgreementTypes = ["ai_disclosure", "copyright_split", "creator", "privacy", "service", "upload_policy"];

function agreementsByTypes(types) {
  const wanted = new Set(types);
  return agreements().filter((item) => wanted.has(item.type));
}

function signatureRows(userId) {
  return query(`SELECT * FROM creator_agreement_signatures WHERE user_id = ${sql(userId)} ORDER BY signed_at DESC;`);
}

function hasSignedRequired(userId) {
  const required = agreementsByTypes(requiredAgreementTypes);
  const signed = signatureRows(userId);
  return required.every((agreement) => signed.some((signature) => (
    signature.agreement_id === agreement.id && signature.content_hash === agreement.contentHash
  )));
}

function missingAgreementSelections(types, agreementIds) {
  const selected = new Set(agreementIds || []);
  return agreementsByTypes(types).filter((item) => !selected.has(item.id));
}

function missingAgreementSelectionsForUser(types, userId, agreementIds) {
  const selected = new Set(agreementIds || []);
  const signed = signatureRows(userId);
  return agreementsByTypes(types).filter((agreement) => {
    const hasCurrentSignature = signed.some((signature) => (
      signature.agreement_id === agreement.id && signature.content_hash === agreement.contentHash
    ));
    return !selected.has(agreement.id) && !hasCurrentSignature;
  });
}

function requireCreator(auth) {
  if (!auth.user) return "请先登录。";
  if (!auth.creator) return "请先申请成为创作者。";
  if (!hasSignedRequired(auth.user.id)) return "请先签署必要协议。";
  if (auth.creator.status !== "approved") return "创作者状态未通过审核。";
  return "";
}

function signAgreements({ user, creatorId = null, agreementIds, scenario, request }) {
  const active = agreements();
  const selected = new Set(agreementIds || []);
  const ip = request.socket.remoteAddress || "";
  const userAgent = request.headers["user-agent"] || "";
  const now = new Date().toISOString();
  active.filter((item) => selected.has(item.id)).forEach((agreement) => {
    execute(`
      INSERT INTO creator_agreement_signatures
      (id, user_id, creator_id, agreement_id, agreement_type, version, content_hash, scenario, ip_address, user_agent, signed_at)
      VALUES (${sql(crypto.randomUUID())}, ${sql(user.id)}, ${sql(creatorId)}, ${sql(agreement.id)}, ${sql(agreement.type)}, ${sql(agreement.version)}, ${sql(agreement.contentHash)}, ${sql(scenario)}, ${sql(ip)}, ${sql(userAgent)}, ${sql(now)})
      ON CONFLICT(user_id, agreement_id, scenario) DO UPDATE SET
        creator_id = excluded.creator_id,
        agreement_type = excluded.agreement_type,
        version = excluded.version,
        content_hash = excluded.content_hash,
        ip_address = excluded.ip_address,
        user_agent = excluded.user_agent,
        signed_at = excluded.signed_at;
    `);
  });
}

function albumFromRow(row, trackIds = []) {
  return {
    name: row.id,
    title: row.title,
    cover: row.cover_url,
    count: trackIds.length,
    category: row.category,
    sourceFolder: row.source_folder,
    trackIds
  };
}

function trackFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en,
    artist: row.artist,
    type: row.type,
    usage: parseJson(row.usage_json, []),
    scene: parseJson(row.scene_json, []),
    style: parseJson(row.style_json, []),
    mood: parseJson(row.mood_json, []),
    bpm: row.bpm,
    key: row.musical_key,
    duration: row.duration,
    structure: parseJson(row.structure_json, []),
    price: row.price,
    popular: row.popular,
    match: row.match_text,
    image: row.image_css,
    color: row.color_css,
    album: row.album_id,
    audio: row.audio_url,
    sourceFile: row.source_file,
    sourceFormat: row.source_format,
    sourcePath: row.source_path,
    peaks: parseJson(row.peaks_json, []),
    waveformSource: row.waveform_source,
    rightsStatus: row.rights_status,
    status: row.status
  };
}

function getCatalog() {
  const albumRows = query("SELECT * FROM albums ORDER BY sort_order ASC;");
  const trackRows = query("SELECT * FROM tracks WHERE status = 'published' ORDER BY sort_order ASC;");
  const tracks = trackRows.map(trackFromRow);
  const albums = albumRows.map((album) => {
    const trackIds = tracks.filter((track) => track.album === album.id).map((track) => track.id);
    return albumFromRow(album, trackIds);
  });
  return {
    source: "sqlite-api",
    dbPath,
    generatedAt: new Date().toISOString(),
    albums,
    tracks
  };
}

function filterTracks(tracks, params) {
  const type = params.get("type");
  const album = params.get("album");
  const q = (params.get("q") || "").trim().toLowerCase();
  return tracks.filter((track) => {
    const haystack = [
      track.id,
      track.title,
      track.titleEn,
      track.artist,
      track.album,
      ...(track.usage || []),
      ...(track.scene || []),
      ...(track.style || []),
      ...(track.mood || []),
      ...(track.structure || [])
    ].join(" ").toLowerCase();
    return (!type || track.type === type) && (!album || track.album === album) && (!q || haystack.includes(q));
  });
}

function creatorAlbum(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    status: row.status,
    createdAt: row.created_at
  };
}

function creatorUpload(row) {
  return {
    id: row.id,
    jobId: row.job_id,
    assetId: row.asset_id,
    originalFilename: row.original_filename,
    storedPath: row.stored_path,
    status: row.status,
    stage: row.stage,
    errorMessage: row.error_message,
    metadata: parseJson(row.metadata_json, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function serveApi(request, response, url) {
  try {
    const catalog = getCatalog();
    const auth = getAuth(request);
    if (url.pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        source: catalog.source,
        albums: catalog.albums.length,
        tracks: catalog.tracks.length
      });
      return true;
    }
    if (url.pathname === "/api/me") {
      const signedRequired = auth.user ? hasSignedRequired(auth.user.id) : false;
      sendJson(response, 200, {
        user: publicUser(auth.user),
        creator: auth.creator ? {
          id: auth.creator.id,
          displayName: auth.creator.display_name,
          bio: auth.creator.bio,
          status: auth.creator.status,
          rightsStatus: auth.creator.rights_status
        } : null,
        signedRequired
      });
      return true;
    }
    if (url.pathname === "/api/agreements/current") {
      sendJson(response, 200, { data: agreements() });
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/register") {
      const body = await readBody(request);
      const email = String(body.email || "").trim().toLowerCase();
      const displayName = String(body.displayName || "").trim();
      const password = String(body.password || "");
      if (!email.includes("@") || displayName.length < 2 || password.length < 8) {
        sendJson(response, 400, { error: "请输入有效邮箱、至少 2 个字符的名称、至少 8 位密码。" });
        return true;
      }
      if (first(`SELECT id FROM users WHERE email = ${sql(email)} LIMIT 1;`)) {
        sendJson(response, 409, { error: "该邮箱已注册。" });
        return true;
      }
      const missing = missingAgreementSelections(requiredAgreementTypes, body.agreementIds);
      if (missing.length) {
        sendJson(response, 400, { error: `注册前必须勾选全部平台条款：${missing.map((item) => item.title).join("、")}` });
        return true;
      }
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const passwordData = hashPassword(password);
      execute(`
        INSERT INTO users (id, email, display_name, password_hash, password_salt, role, created_at, updated_at)
        VALUES (${sql(id)}, ${sql(email)}, ${sql(displayName)}, ${sql(passwordData.passwordHash)}, ${sql(passwordData.salt)}, 'member', ${sql(now)}, ${sql(now)});
      `);
      signAgreements({ user: { id }, creatorId: null, agreementIds: body.agreementIds, scenario: "user_register", request });
      createSession(response, id);
      sendJson(response, 201, { user: publicUser(first(`SELECT * FROM users WHERE id = ${sql(id)};`)) });
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await readBody(request);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = first(`SELECT * FROM users WHERE email = ${sql(email)} LIMIT 1;`);
      if (!user || hashPassword(password, user.password_salt).passwordHash !== user.password_hash) {
        sendJson(response, 401, { error: "邮箱或密码不正确。" });
        return true;
      }
      createSession(response, user.id);
      sendJson(response, 200, { user: publicUser(user) });
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/password-reset") {
      const body = await readBody(request);
      const email = String(body.email || "").trim().toLowerCase();
      if (!email.includes("@")) {
        sendJson(response, 400, { error: "请输入注册邮箱。" });
        return true;
      }
      ensurePasswordResetTable();
      const user = first(`SELECT * FROM users WHERE email = ${sql(email)} LIMIT 1;`);
      const now = new Date().toISOString();
      let resetUrl = "";
      let delivery = "account_not_found";
      if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 30).toISOString();
        resetUrl = `${resetBaseUrl(request)}/creator.html?reset_token=${encodeURIComponent(token)}`;
        delivery = process.env.SMTP_HOST ? "email_pending" : "local_link";
        execute(`
          INSERT INTO password_reset_tokens
          (id, user_id, token_hash, created_at, expires_at, used_at, requested_ip, user_agent)
          VALUES (${sql(crypto.randomUUID())}, ${sql(user.id)}, ${sql(tokenHash(token))}, ${sql(now)}, ${sql(expires)}, NULL, ${sql(request.socket.remoteAddress || "")}, ${sql(request.headers["user-agent"] || "")});
        `);
      }
      const payload = JSON.stringify({
        email,
        source: "creator_login",
        delivery
      });
      execute(`
        INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, payload_json, created_at)
        VALUES (${sql(crypto.randomUUID())}, ${sql(user?.id || null)}, 'auth.password_reset.request', 'user', ${sql(user?.id || null)}, ${sql(payload)}, ${sql(now)});
      `);
      const result = {
        ok: true,
        message: resetUrl
          ? "已生成一次性密码重置链接。本地开发环境会直接显示链接；正式环境接入邮件服务后将发送到邮箱。"
          : "如果该邮箱已注册，平台会发送或生成密码找回指引。"
      };
      if (resetUrl && process.env.NODE_ENV !== "production") result.resetUrl = resetUrl;
      sendJson(response, 200, result);
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/password-reset/confirm") {
      const body = await readBody(request);
      const token = String(body.token || "").trim();
      const password = String(body.password || "");
      if (!token || password.length < 8) {
        sendJson(response, 400, { error: "请输入有效重置链接和至少 8 位新密码。" });
        return true;
      }
      ensurePasswordResetTable();
      const reset = first(`
        SELECT * FROM password_reset_tokens
        WHERE token_hash = ${sql(tokenHash(token))}
          AND used_at IS NULL
          AND expires_at > ${sql(new Date().toISOString())}
        LIMIT 1;
      `);
      if (!reset) {
        sendJson(response, 400, { error: "重置链接无效或已过期，请重新申请。" });
        return true;
      }
      const now = new Date().toISOString();
      const passwordData = hashPassword(password);
      execute(`
        UPDATE users
        SET password_hash = ${sql(passwordData.passwordHash)}, password_salt = ${sql(passwordData.salt)}, updated_at = ${sql(now)}
        WHERE id = ${sql(reset.user_id)};
        UPDATE password_reset_tokens SET used_at = ${sql(now)} WHERE id = ${sql(reset.id)};
        DELETE FROM sessions WHERE user_id = ${sql(reset.user_id)};
        INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, payload_json, created_at)
        VALUES (${sql(crypto.randomUUID())}, ${sql(reset.user_id)}, 'auth.password_reset.confirm', 'user', ${sql(reset.user_id)}, ${sql(JSON.stringify({ source: "creator_login" }))}, ${sql(now)});
      `);
      clearSession(response, "");
      sendJson(response, 200, { ok: true, message: "密码已更新，请使用新密码登录。" });
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/auth/logout") {
      clearSession(response, auth.sessionId);
      sendJson(response, 200, { ok: true });
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/agreements/sign") {
      if (!auth.user) {
        sendJson(response, 401, { error: "请先登录。" });
        return true;
      }
      const body = await readBody(request);
      signAgreements({ user: auth.user, creatorId: auth.creator?.id || null, agreementIds: body.agreementIds, scenario: body.scenario || "manual", request });
      sendJson(response, 200, { ok: true, signedRequired: hasSignedRequired(auth.user.id) });
      return true;
    }
    if (url.pathname === "/api/creators/me") {
      if (!auth.user) {
        sendJson(response, 401, { error: "请先登录。" });
        return true;
      }
      sendJson(response, 200, {
        data: auth.creator ? {
          id: auth.creator.id,
          displayName: auth.creator.display_name,
          bio: auth.creator.bio,
          status: auth.creator.status,
          rightsStatus: auth.creator.rights_status
        } : null,
        signedRequired: hasSignedRequired(auth.user.id)
      });
      return true;
    }
    if (request.method === "POST" && url.pathname === "/api/creators/apply") {
      if (!auth.user) {
        sendJson(response, 401, { error: "请先登录后申请创作者。" });
        return true;
      }
      const body = await readBody(request);
      const missing = missingAgreementSelectionsForUser(requiredAgreementTypes, auth.user.id, body.agreementIds);
      if (missing.length) {
        sendJson(response, 400, { error: `申请创作者前必须完成全部平台条款签署：${missing.map((item) => item.title).join("、")}` });
        return true;
      }
      const now = new Date().toISOString();
      const creatorId = auth.creator?.id || crypto.randomUUID();
      const displayName = String(body.displayName || auth.user.display_name).trim();
      const bio = String(body.bio || "").trim();
      signAgreements({ user: auth.user, creatorId, agreementIds: body.agreementIds, scenario: "creator_apply", request });
      if (auth.creator) {
        execute(`UPDATE creators SET display_name = ${sql(displayName)}, bio = ${sql(bio)}, updated_at = ${sql(now)} WHERE id = ${sql(auth.creator.id)};`);
      } else {
        execute(`
          INSERT INTO creators (id, user_id, display_name, bio, status, rights_status, created_at, updated_at)
          VALUES (${sql(creatorId)}, ${sql(auth.user.id)}, ${sql(displayName)}, ${sql(bio)}, 'approved', 'cleared', ${sql(now)}, ${sql(now)});
        `);
      }
      execute(`
        INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, payload_json, created_at)
        VALUES (${sql(crypto.randomUUID())}, ${sql(auth.user.id)}, 'creator.apply', 'creator', ${sql(creatorId)}, ${sql(JSON.stringify({ displayName }))}, ${sql(now)});
      `);
      sendJson(response, 201, {
        data: {
          id: creatorId,
          displayName,
          bio,
          status: "approved",
          rightsStatus: "cleared"
        },
        signedRequired: true
      });
      return true;
    }
    if (url.pathname === "/api/creator/albums") {
      const reason = requireCreator(auth);
      if (reason) {
        sendJson(response, auth.user ? 403 : 401, { error: reason });
        return true;
      }
      if (request.method === "GET") {
        const rows = query(`SELECT * FROM albums WHERE creator_id = ${sql(auth.creator.id)} ORDER BY created_at DESC;`);
        sendJson(response, 200, { data: rows.map(creatorAlbum) });
        return true;
      }
      if (request.method === "POST") {
        const body = await readBody(request);
        const title = String(body.title || "").trim();
        const category = String(body.category || "音乐").trim();
        const description = String(body.description || "").trim();
        if (title.length < 2) {
          sendJson(response, 400, { error: "专辑标题至少需要 2 个字符。" });
          return true;
        }
        const now = new Date().toISOString();
        const albumId = `album-${crypto.randomUUID()}`;
        execute(`
          INSERT INTO albums (id, creator_id, title, category, cover_url, source_folder, description, status, sort_order, created_at, published_at)
          VALUES (${sql(albumId)}, ${sql(auth.creator.id)}, ${sql(title)}, ${sql(category)}, NULL, NULL, ${sql(description)}, 'draft', 9999, ${sql(now)}, NULL);
          INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, payload_json, created_at)
          VALUES (${sql(crypto.randomUUID())}, ${sql(auth.user.id)}, 'creator.album.create', 'album', ${sql(albumId)}, ${sql(JSON.stringify({ title }))}, ${sql(now)});
        `);
        sendJson(response, 201, { data: creatorAlbum(first(`SELECT * FROM albums WHERE id = ${sql(albumId)};`)) });
        return true;
      }
    }
    if (url.pathname === "/api/creator/uploads" && request.method === "GET") {
      const reason = requireCreator(auth);
      if (reason) {
        sendJson(response, auth.user ? 403 : 401, { error: reason });
        return true;
      }
      const rows = query(`SELECT * FROM ingest_items WHERE creator_id = ${sql(auth.creator.id)} ORDER BY created_at DESC LIMIT 50;`);
      sendJson(response, 200, { data: rows.map(creatorUpload) });
      return true;
    }
    if (url.pathname === "/api/creator/uploads" && request.method === "POST") {
      const reason = requireCreator(auth);
      if (reason) {
        sendJson(response, auth.user ? 403 : 401, { error: reason });
        return true;
      }
      const contentType = request.headers["content-type"] || "";
      if (!contentType.includes("multipart/form-data")) {
        sendJson(response, 400, { error: "请使用 multipart/form-data 上传音频文件。" });
        return true;
      }
      const parts = parseMultipart(await readBuffer(request), contentType);
      const audio = parts.audioFile;
      const albumId = String(parts.albumId || "").trim();
      const title = String(parts.title || "").trim();
      if (!audio?.data?.length) {
        sendJson(response, 400, { error: "请选择音频文件。" });
        return true;
      }
      if (!title) {
        sendJson(response, 400, { error: "请填写曲目标题。" });
        return true;
      }
      const album = first(`SELECT * FROM albums WHERE id = ${sql(albumId)} AND creator_id = ${sql(auth.creator.id)} LIMIT 1;`);
      if (!album) {
        sendJson(response, 400, { error: "请先创建或选择自己的专辑。" });
        return true;
      }
      const safeName = path.basename(audio.filename || "upload-audio").replace(/[^a-zA-Z0-9._-]/g, "_");
      const uploadId = crypto.randomUUID();
      const creatorFolder = path.join(uploadDir, auth.creator.id);
      fs.mkdirSync(creatorFolder, { recursive: true });
      const storedPath = path.join(creatorFolder, `${uploadId}-${safeName}`);
      fs.writeFileSync(storedPath, audio.data);
      const now = new Date().toISOString();
      const jobId = `job-${uploadId}`;
      const itemId = `item-${uploadId}`;
      const trackId = `UP-${uploadId.slice(0, 8).toUpperCase()}`;
      const metadata = {
        title,
        albumId,
        usage: String(parts.usage || "").split(",").map((item) => item.trim()).filter(Boolean),
        scene: String(parts.scene || "").split(",").map((item) => item.trim()).filter(Boolean),
        mood: String(parts.mood || "").split(",").map((item) => item.trim()).filter(Boolean),
        aiDisclosure: String(parts.aiDisclosure || "none"),
        rightsStatement: String(parts.rightsStatement || ""),
        mimeType: audio.type,
        size: audio.data.length
      };
      execute(`
        INSERT INTO ingest_jobs (id, creator_id, source_type, source_path, asset_type, status, total_items, success_items, failed_items, created_at, completed_at)
        VALUES (${sql(jobId)}, ${sql(auth.creator.id)}, 'creator_upload', ${sql(storedPath)}, 'music', 'review', 1, 1, 0, ${sql(now)}, ${sql(now)});
        INSERT INTO tracks
        (id, album_id, creator_id, title, title_en, artist, type, duration, bpm, musical_key, price, popular, match_text, audio_url, image_css, color_css, source_file, source_path, source_format, waveform_source, peaks_json, usage_json, scene_json, style_json, mood_json, structure_json, rights_status, status, sort_order, created_at, published_at)
        VALUES (${sql(trackId)}, ${sql(albumId)}, ${sql(auth.creator.id)}, ${sql(title)}, ${sql(title)}, ${sql(auth.creator.display_name)}, 'music', 0, 0, NULL, 0, 0, ${sql("创作者上传，等待音频处理与审核。")}, NULL, NULL, 'linear-gradient(135deg,#20242b,#0b0d11 52%,#d2a06f)', ${sql(audio.filename)}, ${sql(storedPath)}, ${sql(audio.type || "audio")}, 'pending-processing', '[]', ${sql(JSON.stringify(metadata.usage))}, ${sql(JSON.stringify(metadata.scene))}, '[]', ${sql(JSON.stringify(metadata.mood))}, ${sql(JSON.stringify(["Full"]))}, 'pending', 'review', 9999, ${sql(now)}, NULL);
        INSERT INTO files (id, asset_id, file_role, url, local_path, mime_type, created_at)
        VALUES (${sql(`file-${uploadId}`)}, ${sql(trackId)}, 'source_upload', NULL, ${sql(storedPath)}, ${sql(audio.type || "audio")}, ${sql(now)});
        INSERT INTO ingest_items (id, job_id, asset_id, creator_id, original_filename, stored_path, status, stage, error_message, metadata_json, created_at, updated_at)
        VALUES (${sql(itemId)}, ${sql(jobId)}, ${sql(trackId)}, ${sql(auth.creator.id)}, ${sql(audio.filename)}, ${sql(storedPath)}, 'review', 'uploaded', NULL, ${sql(JSON.stringify(metadata))}, ${sql(now)}, ${sql(now)});
        INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, payload_json, created_at)
        VALUES (${sql(crypto.randomUUID())}, ${sql(auth.user.id)}, 'creator.upload.create', 'track', ${sql(trackId)}, ${sql(JSON.stringify({ title, albumId, filename: audio.filename }))}, ${sql(now)});
      `);
      sendJson(response, 201, {
        data: creatorUpload(first(`SELECT * FROM ingest_items WHERE id = ${sql(itemId)};`))
      });
      return true;
    }
    if (url.pathname === "/api/catalog") {
      sendJson(response, 200, catalog);
      return true;
    }
    if (url.pathname === "/api/albums") {
      sendJson(response, 200, { data: catalog.albums });
      return true;
    }
    const albumMatch = url.pathname.match(/^\/api\/albums\/([^/]+)$/);
    if (albumMatch) {
      const id = decodeURIComponent(albumMatch[1]);
      const album = catalog.albums.find((item) => item.name === id);
      if (!album) {
        sendJson(response, 404, { error: "Album not found" });
        return true;
      }
      sendJson(response, 200, {
        data: {
          ...album,
          tracks: catalog.tracks.filter((track) => track.album === id)
        }
      });
      return true;
    }
    if (url.pathname === "/api/tracks" || url.pathname === "/api/assets") {
      sendJson(response, 200, { data: filterTracks(catalog.tracks, url.searchParams) });
      return true;
    }
    const waveformMatch = url.pathname.match(/^\/api\/assets\/([^/]+)\/waveform$/);
    if (waveformMatch) {
      const id = decodeURIComponent(waveformMatch[1]);
      const track = catalog.tracks.find((item) => item.id === id);
      if (!track) {
        sendJson(response, 404, { error: "Asset not found" });
        return true;
      }
      sendJson(response, 200, { id, peaks: track.peaks, waveformSource: track.waveformSource });
      return true;
    }
    const previewMatch = url.pathname.match(/^\/api\/assets\/([^/]+)\/preview$/);
    if (previewMatch) {
      const id = decodeURIComponent(previewMatch[1]);
      const track = catalog.tracks.find((item) => item.id === id);
      if (!track) {
        sendJson(response, 404, { error: "Asset not found" });
        return true;
      }
      sendJson(response, 200, { id, url: track.audio });
      return true;
    }
  } catch (error) {
    sendJson(response, 500, { error: error.message });
    return true;
  }
  return false;
}

function serveStatic(request, response, url) {
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(rootDir, pathname));
  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    serveApi(request, response, url).then((handled) => {
      if (!handled) sendJson(response, 404, { error: "API endpoint not found" });
    });
    return;
  }
  serveStatic(request, response, url);
});

server.listen(port, () => {
  console.log(`ASTRASONIC API server listening at http://127.0.0.1:${port}`);
});
