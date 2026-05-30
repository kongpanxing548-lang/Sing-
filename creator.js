const $ = (id) => document.getElementById(id);

const state = {
  user: null,
  creator: null,
  signedRequired: false,
  agreements: [],
  albums: [],
  uploads: [],
  mode: "register",
  message: "",
  busy: false
};

function h(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

async function api(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    headers: isForm ? (options.headers || {}) : {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

async function load() {
  const [me, agreements] = await Promise.all([
    api("/api/me"),
    api("/api/agreements/current")
  ]);
  state.user = me.user;
  state.creator = me.creator;
  state.signedRequired = me.signedRequired;
  state.agreements = agreements.data || [];
  if (state.creator && state.signedRequired) {
    const [albums, uploads] = await Promise.all([
      api("/api/creator/albums"),
      api("/api/creator/uploads")
    ]);
    state.albums = albums.data || [];
    state.uploads = uploads.data || [];
  } else {
    state.albums = [];
    state.uploads = [];
  }
}

function agreementList() {
  return state.agreements.map((agreement) => `
    <label>
      <input type="checkbox" name="agreementIds" value="${h(agreement.id)}">
      <span>
        <strong>${h(agreement.title)} · v${h(agreement.version)}</strong>
        <small>${h(agreement.content)}</small>
      </span>
    </label>
  `).join("");
}

function render() {
  if (location.protocol === "file:") {
    $("creatorConsole").innerHTML = `
      <article class="creator-card">
        <h3>请用本地服务打开</h3>
        <div class="creator-state">
          <span><strong>当前打开方式</strong><small>file://</small></span>
          <span><strong>正确地址</strong><small>http://127.0.0.1:4173/creator.html</small></span>
        </div>
      </article>
    `;
    return;
  }
  const authCard = state.user ? `
    <article class="creator-card creator-state">
      <h3>账号状态</h3>
      <span><strong>当前账号</strong><small>${h(state.user.email)}</small></span>
      <span><strong>会员名称</strong><small>${h(state.user.displayName)}</small></span>
      <span><strong>创作者身份</strong><small>${state.creator ? "已开通" : "未申请"}</small></span>
      <span><strong>协议状态</strong><small>${state.signedRequired ? "必要协议已签署" : "待签署"}</small></span>
      <button type="button" class="creator-action creator-secondary" data-logout>退出登录</button>
    </article>
  ` : `
    <article class="creator-card">
      <h3>${state.mode === "register" ? "创建会员账号" : "登录会员账号"}</h3>
      <div class="creator-tabs">
        <button type="button" class="creator-tab ${state.mode === "register" ? "active" : ""}" data-mode="register">注册账号</button>
        <button type="button" class="creator-tab ${state.mode === "login" ? "active" : ""}" data-mode="login">已有账号登录</button>
      </div>
      <form class="creator-form" data-auth="${state.mode}">
        ${state.mode === "register" ? `<input name="displayName" placeholder="创作者/会员名称" autocomplete="name" required>` : ""}
        <input name="email" type="email" placeholder="邮箱" autocomplete="email" required>
        <input name="password" type="password" placeholder="密码，至少 8 位" autocomplete="${state.mode === "register" ? "new-password" : "current-password"}" required>
        <button class="creator-submit" type="submit" ${state.busy ? "disabled" : ""}>${state.busy ? "处理中..." : (state.mode === "register" ? "创建账号并登录" : "登录")}</button>
      </form>
    </article>
  `;

  const creatorCard = state.user ? `
    <article class="creator-card">
      <h3>申请成为创作者</h3>
      <form class="creator-form" data-apply>
        <input name="displayName" placeholder="创作者展示名" value="${h(state.creator?.displayName || state.user.displayName)}" required>
        <textarea name="bio" placeholder="创作方向，例如：睡眠音乐、游戏配乐、音效设计">${h(state.creator?.bio || "")}</textarea>
        <div class="agreement-list">${agreementList()}</div>
        <button type="submit" ${state.busy ? "disabled" : ""}>${state.creator ? "更新创作者资料与协议" : "勾选协议并申请创作者"}</button>
      </form>
    </article>
  ` : `
    <article class="creator-card">
      <h3>上传权限前置条件</h3>
      <div class="creator-state">
        <span><strong>第一步</strong><small>注册或登录会员账号</small></span>
        <span><strong>第二步</strong><small>勾选全部创作者协议</small></span>
        <span><strong>第三步</strong><small>申请成为创作者后开放上传后台</small></span>
      </div>
    </article>
  `;
  const uploadConsole = state.creator && state.signedRequired ? `
    <article class="creator-card upload-card">
      <h3>专辑与上传</h3>
      <div class="upload-grid">
        <form class="creator-form" data-album-create>
          <strong>创建专辑</strong>
          <input name="title" placeholder="专辑名称" required>
          <input name="category" placeholder="分类，例如：睡眠音乐 / 游戏配乐" value="音乐">
          <textarea name="description" placeholder="专辑简介"></textarea>
          <button type="submit" ${state.busy ? "disabled" : ""}>创建专辑</button>
        </form>
        <form class="creator-form" data-upload-create>
          <strong>上传音乐</strong>
          <select name="albumId" required>
            <option value="">选择专辑</option>
            ${state.albums.map((album) => `<option value="${h(album.id)}">${h(album.title)} · ${h(album.status)}</option>`).join("")}
          </select>
          <input name="title" placeholder="曲目标题" required>
          <input name="usage" placeholder="用途标签，用逗号分隔，例如 Game, Video">
          <input name="scene" placeholder="场景标签，用逗号分隔，例如 睡眠冥想, 空间">
          <input name="mood" placeholder="情绪标签，用逗号分隔，例如 舒缓, 安静">
          <select name="aiDisclosure">
            <option value="none">未使用 AI 生成</option>
            <option value="assisted">AI 辅助生成</option>
            <option value="generated">AI 生成</option>
          </select>
          <textarea name="rightsStatement" placeholder="版权声明：确认原创、授权来源、采样说明等"></textarea>
          <input name="audioFile" type="file" accept="audio/*" required>
          <button type="submit" ${state.busy ? "disabled" : ""}>提交到待审核队列</button>
        </form>
      </div>
    </article>
    <article class="creator-card uploads-card">
      <h3>上传任务</h3>
      <div class="upload-list">
        ${state.uploads.length ? state.uploads.map((item) => `
          <span>
            <strong>${h(item.metadata?.title || item.originalFilename)}</strong>
            <small>${h(item.status)} · ${h(item.stage)} · ${h(item.originalFilename)}</small>
          </span>
        `).join("") : `<small>暂无上传任务。创建专辑后即可提交音乐。</small>`}
      </div>
    </article>
  ` : "";

  $("creatorConsole").innerHTML = `
    ${authCard}
    ${creatorCard}
    ${uploadConsole}
    <div class="creator-message">${h(state.message)}</div>
  `;
}

document.addEventListener("click", (event) => {
  const mode = event.target.closest("[data-mode]");
  const logout = event.target.closest("[data-logout]");
  if (mode) {
    state.mode = mode.dataset.mode;
    state.message = "";
    render();
  }
  if (logout) {
    api("/api/auth/logout", { method: "POST", body: "{}" })
      .then(() => {
        state.user = null;
        state.creator = null;
        state.signedRequired = false;
        state.message = "已退出登录。";
        render();
      })
      .catch((error) => {
        state.message = error.message;
        render();
      });
  }
});

document.addEventListener("submit", (event) => {
  const authForm = event.target.closest("[data-auth]");
  const applyForm = event.target.closest("[data-apply]");
  const albumForm = event.target.closest("[data-album-create]");
  const uploadForm = event.target.closest("[data-upload-create]");
  if (!authForm && !applyForm && !albumForm && !uploadForm) return;
  event.preventDefault();
  const formData = new FormData(event.target);

  if (authForm) {
    const mode = authForm.dataset.auth;
    state.busy = true;
    state.message = mode === "register" ? "正在注册账号..." : "正在登录...";
    render();
    api(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    })
      .then(load)
      .then(() => {
        if (!state.user) throw new Error("账号已创建，但浏览器没有保存登录状态，请刷新后登录。");
        state.message = mode === "register" ? "注册成功，请勾选协议申请创作者。" : "登录成功。";
      render();
      })
      .catch((error) => {
        state.message = `${mode === "register" ? "注册失败" : "登录失败"}：${error.message}`;
        render();
      })
      .finally(() => {
        state.busy = false;
        render();
      });
  }

  if (applyForm) {
    state.busy = true;
    state.message = "正在提交创作者申请...";
    render();
    const agreementIds = [...event.target.querySelectorAll("input[name='agreementIds']:checked")].map((input) => input.value);
    api("/api/creators/apply", {
      method: "POST",
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        bio: formData.get("bio"),
        agreementIds
      })
    })
      .then(load)
      .then(() => {
        state.message = "创作者申请已完成，协议签署记录已保存。";
        render();
      })
      .catch((error) => {
        state.message = error.message;
        render();
      })
      .finally(() => {
        state.busy = false;
        render();
      });
  }
  if (albumForm) {
    state.busy = true;
    state.message = "正在创建专辑...";
    render();
    api("/api/creator/albums", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        category: formData.get("category"),
        description: formData.get("description")
      })
    })
      .then(load)
      .then(() => {
        state.message = "专辑已创建，可以上传曲目。";
        render();
      })
      .catch((error) => {
        state.message = error.message;
        render();
      })
      .finally(() => {
        state.busy = false;
        render();
      });
  }
  if (uploadForm) {
    state.busy = true;
    state.message = "正在提交上传任务...";
    render();
    api("/api/creator/uploads", {
      method: "POST",
      body: formData
    })
      .then(load)
      .then(() => {
        state.message = "音乐已提交，当前状态为待处理/待审核。";
        render();
      })
      .catch((error) => {
        state.message = error.message;
        render();
      })
      .finally(() => {
        state.busy = false;
        render();
      });
  }
});

load()
  .catch((error) => {
    state.message = `${error.message}。请通过 http://127.0.0.1:4173/creator.html 打开创作者中心。`;
  })
  .finally(render);
