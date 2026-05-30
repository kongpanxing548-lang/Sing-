let tracks = [
  {
    id: "AS-2026-001",
    title: "赤焰 Boss Phase",
    titleEn: "Crimson Boss Phase",
    artist: "ASTRASONIC Lab",
    type: "music",
    usage: ["Game"],
    scene: ["Boss战", "战斗", "游戏音乐"],
    style: ["东方", "史诗", "管弦"],
    mood: ["热血", "紧张"],
    bpm: 142,
    key: "D minor",
    duration: 154,
    structure: ["Loop", "Stems", "Full"],
    price: 199,
    popular: 98,
    match: "适合 Boss 二阶段、预告片高潮、动作游戏战斗循环。",
    image: "url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #8b5534 0%, #171311 48%, #8fa8ad 120%)"
  },
  {
    id: "AS-2026-002",
    title: "山海主城",
    titleEn: "Mythic Main City",
    artist: "North Gate",
    type: "music",
    usage: ["Game", "Film"],
    scene: ["主城", "探索", "东方史诗"],
    style: ["东方", "国风", "氛围"],
    mood: ["神秘", "治愈"],
    bpm: 92,
    key: "A minor",
    duration: 226,
    structure: ["Loop", "Full"],
    price: 199,
    popular: 91,
    match: "适合东方幻想主城、开放世界探索、剧情铺垫。",
    image: "url('https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #272321 0%, #7a5a36 46%, #9ca7a9 115%)"
  },
  {
    id: "AS-2026-003",
    title: "Neon Sprint Trailer",
    titleEn: "Neon Sprint Trailer",
    artist: "Pulse Forge",
    type: "music",
    usage: ["Video", "Commercial"],
    scene: ["短视频燃点", "广告30s", "转场"],
    style: ["电子", "赛博"],
    mood: ["热血", "紧张"],
    bpm: 168,
    key: "E minor",
    duration: 58,
    structure: ["30s", "Stinger"],
    price: 99,
    popular: 96,
    match: "适合卡点剪辑、科技产品片、运动品牌短视频。",
    image: "url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #111215 0%, #38424b 46%, #b37a4e 100%)"
  },
  {
    id: "AS-2026-004",
    title: "Brand Lift 30s",
    titleEn: "Brand Lift 30s",
    artist: "Signal Works",
    type: "music",
    usage: ["Commercial", "Video"],
    scene: ["广告30s", "品牌片", "展会"],
    style: ["流行", "电子"],
    mood: ["明亮", "可信"],
    bpm: 124,
    key: "C major",
    duration: 30,
    structure: ["30s", "60s", "Stems"],
    price: 299,
    popular: 83,
    match: "适合品牌开场、TVC、企业宣传片和新品发布。",
    image: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #c8c3b8 0%, #191b1f 48%, #a66d43 120%)"
  },
  {
    id: "AS-2026-005",
    title: "Coffee Hour Texture",
    titleEn: "Coffee Hour Texture",
    artist: "Room Tone",
    type: "music",
    usage: ["Space", "Commercial"],
    scene: ["咖啡厅", "餐厅", "商铺"],
    style: ["Lo-fi", "轻爵士"],
    mood: ["舒缓", "温暖"],
    bpm: 72,
    key: "G major",
    duration: 211,
    structure: ["Loop", "Full"],
    price: 599,
    popular: 74,
    match: "适合咖啡厅、餐厅、展厅和线下空间长时段播放。",
    image: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #34271f 0%, #141210 46%, #9f734e 120%)"
  },
  {
    id: "AS-2026-006",
    title: "Deep Sleep Orbit",
    titleEn: "Deep Sleep Orbit",
    artist: "Soft Array",
    type: "music",
    usage: ["Video", "Space"],
    scene: ["睡眠冥想", "冥想", "专注"],
    style: ["氛围", "环境"],
    mood: ["舒缓", "神秘"],
    bpm: 64,
    key: "B flat",
    duration: 326,
    structure: ["Loop", "Full"],
    price: 99,
    popular: 70,
    match: "适合睡眠、冥想、瑜伽、专注类内容和空间背景。",
    image: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #1f2529 0%, #08090b 52%, #9baeb4 125%)"
  },
  {
    id: "AS-2026-007",
    title: "UI Celestial Bloom",
    titleEn: "UI Celestial Bloom",
    artist: "Mira Chen",
    type: "music",
    usage: ["Game"],
    scene: ["UI", "菜单", "主城"],
    style: ["电子", "治愈"],
    mood: ["轻松", "明亮"],
    bpm: 96,
    key: "F major",
    duration: 74,
    structure: ["Loop", "Stems"],
    price: 129,
    popular: 78,
    match: "适合游戏菜单、抽卡界面、背包/商城等轻交互场景。",
    image: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #9aa4a6 0%, #111820 44%, #b77b4e 120%)"
  },
  {
    id: "AS-2026-008",
    title: "Impact Gate",
    titleEn: "Impact Gate",
    artist: "ASTRASONIC SFX",
    type: "sfx",
    usage: ["Game", "Video"],
    scene: ["转场", "冲击", "技能"],
    style: ["音效", "科幻"],
    mood: ["紧张", "冲击"],
    bpm: 120,
    key: "FX",
    duration: 6,
    structure: ["One-shot", "Stinger"],
    price: 29,
    popular: 88,
    match: "适合技能释放、Logo 揭示、转场冲击和预告片 hit。",
    image: "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #d1cbc0 0%, #1d2329 38%, #a66d43 120%)"
  },
  {
    id: "AS-2026-009",
    title: "Arcade Confirm",
    titleEn: "Arcade Confirm",
    artist: "ASTRASONIC SFX",
    type: "sfx",
    usage: ["Game"],
    scene: ["UI", "按钮", "菜单"],
    style: ["音效", "复古"],
    mood: ["明亮", "轻松"],
    bpm: 100,
    key: "FX",
    duration: 2,
    structure: ["One-shot"],
    price: 9,
    popular: 64,
    match: "适合确认、购买、奖励领取、菜单切换等 UI 反馈。",
    image: "url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #a88f75 0%, #111417 48%, #849397 120%)"
  },
  {
    id: "AS-2026-010",
    title: "Market Ambience Loop",
    titleEn: "Market Ambience Loop",
    artist: "Room Tone",
    type: "sfx",
    usage: ["Game", "Film"],
    scene: ["环境声", "主城", "商铺"],
    style: ["音效", "环境"],
    mood: ["温暖", "真实"],
    bpm: 80,
    key: "FX",
    duration: 95,
    structure: ["Loop"],
    price: 49,
    popular: 76,
    match: "适合 RPG 集市、城镇空间、店铺环境和叙事底噪。",
    image: "url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80')",
    color: "linear-gradient(135deg, #2a2722 0%, #101115 46%, #aa7952 125%)"
  }
];

let scenarios = [
  {
    label: "Boss战",
    hint: "Game · Battle",
    query: ["Boss战", "战斗", "热血"],
    color: "linear-gradient(135deg, rgba(164,103,63,.34), rgba(22,17,14,.88))"
  },
  {
    label: "东方史诗",
    hint: "Eastern · Epic",
    query: ["东方", "史诗", "游戏音乐"],
    color: "linear-gradient(135deg, rgba(197,151,96,.24), rgba(12,13,14,.9))"
  },
  {
    label: "短视频燃点",
    hint: "Video · Hook",
    query: ["短视频燃点", "电子", "热血"],
    color: "linear-gradient(135deg, rgba(143,168,173,.24), rgba(54,62,70,.3))"
  },
  {
    label: "品牌广告",
    hint: "Commercial · 30s",
    query: ["广告30s", "品牌片", "可信"],
    color: "linear-gradient(135deg, rgba(230,226,216,.18), rgba(157,111,73,.18))"
  },
  {
    label: "咖啡厅",
    hint: "Space · Retail",
    query: ["咖啡厅", "舒缓", "商铺"],
    color: "linear-gradient(135deg, rgba(134,112,88,.22), rgba(41,36,32,.76))"
  },
  {
    label: "睡眠冥想",
    hint: "Wellness · Calm",
    query: ["睡眠冥想", "舒缓", "氛围"],
    color: "linear-gradient(135deg, rgba(139,157,166,.18), rgba(9,12,16,.82))"
  }
];

let collections = [
  {
    title: "Game Boss",
    titleCn: "Boss 战斗",
    eyebrow: "GAME MUSIC",
    tags: ["Boss战", "战斗", "史诗"],
    count: "28 assets",
    image: "url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1100&q=80')",
    tone: "linear-gradient(135deg, rgba(131,72,42,.92), rgba(15,13,12,.72))"
  },
  {
    title: "Eastern Epic",
    titleCn: "东方史诗",
    eyebrow: "CINEMATIC",
    tags: ["东方", "国风", "管弦"],
    count: "36 assets",
    image: "url('https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1100&q=80')",
    tone: "linear-gradient(135deg, rgba(153,112,62,.9), rgba(20,21,22,.76))"
  },
  {
    title: "Trailer Hooks",
    titleCn: "短视频燃点",
    eyebrow: "SHORT VIDEO",
    tags: ["短视频燃点", "电子", "广告30s"],
    count: "44 assets",
    image: "url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1100&q=80')",
    tone: "linear-gradient(135deg, rgba(60,70,80,.9), rgba(35,24,20,.72))"
  },
  {
    title: "Brand Films",
    titleCn: "品牌广告",
    eyebrow: "COMMERCIAL",
    tags: ["品牌片", "广告30s", "明亮"],
    count: "31 assets",
    image: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80')",
    tone: "linear-gradient(135deg, rgba(203,190,170,.72), rgba(18,19,22,.78))"
  },
  {
    title: "Cafe Space",
    titleCn: "咖啡厅空间",
    eyebrow: "RETAIL SPACE",
    tags: ["咖啡厅", "商铺", "舒缓"],
    count: "52 assets",
    image: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1100&q=80')",
    tone: "linear-gradient(135deg, rgba(103,77,52,.9), rgba(16,14,12,.76))"
  },
  {
    title: "Sleep Orbit",
    titleCn: "睡眠冥想",
    eyebrow: "WELLNESS",
    tags: ["睡眠冥想", "氛围", "舒缓"],
    count: "25 assets",
    image: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80')",
    tone: "linear-gradient(135deg, rgba(73,86,90,.86), rgba(8,10,13,.8))"
  }
];

const state = {
  type: "music",
  query: "",
  activeTags: new Set(),
  duration: "",
  bpm: 180,
  loopOnly: false,
  stemsOnly: false,
  sort: "new",
  current: tracks[0],
  scenario: scenarios[0],
  selectedAlbum: "",
  expandedTrack: ""
};

let usageTags = ["Game", "Video", "Commercial", "Film", "Space"];
let albumTags = [];
let sceneTags = ["Boss战", "战斗", "主城", "探索", "UI", "广告30s", "短视频燃点", "咖啡厅", "睡眠冥想", "环境声", "转场"];
let styleTags = ["东方", "史诗", "管弦", "电子", "赛博", "国风", "氛围", "Lo-fi", "轻爵士", "热血", "紧张", "舒缓", "神秘", "明亮"];
let quickTags = [
  { label: "东方 Boss", tags: ["东方", "Boss战"] },
  { label: "广告 30s", tags: ["广告30s", "明亮"] },
  { label: "UI Loop", tags: ["UI", "Loop"] },
  { label: "咖啡厅年卡", tags: ["咖啡厅", "商铺"] },
  { label: "短视频燃点", tags: ["短视频燃点", "电子"] },
  { label: "睡眠冥想", tags: ["睡眠冥想", "舒缓"] }
];

const filterPresets = {
  music: {
    usage: ["Space", "Video", "Commercial", "Wellness", "Film"],
    scene: ["睡眠冥想", "睡眠", "冥想", "放松", "入梦引导", "自然入眠", "空间背景", "瑜伽", "专注"],
    style: ["氛围", "环境", "疗愈", "自然", "水境", "梦幻", "舒缓", "安静", "温暖", "神秘", "明亮"],
    quick: [
      { label: "入梦指南1", tags: ["入梦指南1"] },
      { label: "入梦指南2", tags: ["入梦指南2"] },
      { label: "天地入寐", tags: ["天地入寐"] },
      { label: "睡眠冥想", tags: ["睡眠冥想", "舒缓"] },
      { label: "自然入眠", tags: ["自然", "睡眠"] },
      { label: "水境放松", tags: ["水境", "放松"] }
    ],
    showAlbums: true,
    empty: "当前筛选下没有音乐资产。"
  },
  sfx: {
    usage: ["Game", "Video", "App", "Film", "Product"],
    scene: ["UI反馈", "按钮", "菜单", "转场", "Logo揭示", "技能", "冲击", "环境声", "空间底噪", "提示音"],
    style: ["音效", "科幻", "复古", "自然", "机械", "电子", "轻量", "冲击", "真实", "明亮", "紧张"],
    quick: [
      { label: "UI 反馈", tags: ["UI反馈", "按钮"] },
      { label: "转场冲击", tags: ["转场", "冲击"] },
      { label: "Logo 揭示", tags: ["Logo揭示", "提示音"] },
      { label: "技能释放", tags: ["技能", "科幻"] },
      { label: "环境声", tags: ["环境声", "空间底噪"] },
      { label: "菜单音效", tags: ["菜单", "轻量"] }
    ],
    showAlbums: false,
    empty: "当前库还没有正式入库的音效资产。请使用后端批量上传导入 SFX 文件。"
  }
};

const $ = (id) => document.getElementById(id);
const previewAudio = new Audio();
const demoTracks = tracks;
const demoCollections = collections;
const demoScenarios = scenarios;
const demoUsageTags = usageTags;
const demoAlbumTags = albumTags;
const demoSceneTags = sceneTags;
const demoStyleTags = styleTags;
const demoQuickTags = quickTags;
let sleepAlbums = [];
let catalogSource = "demo";
let isPlaying = false;
let projectCart = [];

function icon(name) {
  const paths = {
    play: "M8 5v14l11-7L8 5Z",
    plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z",
    cert: "M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Zm3.7 7.3-4.5 4.5-2.2-2.2 1.1-1.1 1.1 1.1 3.4-3.4 1.1 1.1Z",
    star: "m12 2.8 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8Z",
    chevron: "m6.7 8.8 5.3 5.3 5.3-5.3 1.5 1.5-6.8 6.8-6.8-6.8 1.5-1.5Z",
    pause: "M7 5h3v14H7V5Zm7 0h3v14h-3V5Z",
    cart: "M6.4 6 7.5 14h8.9l2-6H8.1L7.7 4H4v2h2.4ZM9 19a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 9 19Zm7 0a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 16 19Z"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]}"/></svg>`;
}

function seconds(value) {
  const min = Math.floor(value / 60);
  const sec = String(value % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function fileName(value = "") {
  return value.split("/").pop() || value;
}

function uniqueCount(items) {
  return new Set(items.filter(Boolean)).size;
}

function wave(seed, count = 42, boost = 1) {
  return Array.from({ length: count }, (_, i) => {
    const raw = 8 + ((seed * (i + 5) * 11 + i * 13) % 34);
    const height = Math.round(raw * boost);
    const delay = (i % 9) * 24;
    return `<span class="bar" style="height:${height}px;animation-delay:${delay}ms"></span>`;
  }).join("");
}

function waveformPeaks(track, count = 180) {
  if (track.peaks?.length) {
    if (track.peaks.length === count) return track.peaks;
    return Array.from({ length: count }, (_, i) => {
      const start = Math.floor((i / count) * track.peaks.length);
      const end = Math.max(start + 1, Math.floor(((i + 1) / count) * track.peaks.length));
      return Math.max(...track.peaks.slice(start, end), .018);
    });
  }
  return Array.from({ length: count }, (_, i) => {
    const position = i / (count - 1);
    const intro = Math.min(1, position * 7);
    const outro = Math.min(1, (1 - position) * 9);
    const phrase = .62 + Math.sin((position * Math.PI * 5.5) + track.bpm * .03) * .18;
    const texture = Math.sin(i * 1.7 + track.popular * .11) * .17 + Math.sin(i * .43 + track.duration * .04) * .11;
    const breakDip = Math.abs(position - .47) < .028 || Math.abs(position - .64) < .018 ? .36 : 1;
    const transient = (i % 17 === 0 || i % 29 === 0) ? .18 : 0;
    return Math.max(.08, Math.min(.96, (phrase + texture + transient) * intro * outro * breakDip));
  });
}

function waveformPath(peaks, width = 900, height = 64) {
  const center = height / 2;
  const top = peaks.map((peak, i) => {
    const x = (i / (peaks.length - 1)) * width;
    const y = center - peak * (height * .43);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const bottom = peaks.map((peak, i) => {
    const x = ((peaks.length - 1 - i) / (peaks.length - 1)) * width;
    const y = center + peak * (height * .43);
    return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return `${top} ${bottom} Z`;
}

function renderPlayerWave(track, progressRatio = 0) {
  const width = 900;
  const height = 64;
  const path = waveformPath(waveformPeaks(track, 360), width, height);
  const progress = Math.max(0, Math.min(width, Math.round(width * progressRatio)));
  const clipId = `clip-${track.id.replace(/[^a-z0-9]/gi, "")}`;
  return `
    <span class="wave-time wave-time-elapsed">${seconds(Math.floor(previewAudio.currentTime || 0))}</span>
    <div class="waveform-shell" style="--progress:${(progress / width * 100).toFixed(1)}%">
      <svg class="waveform-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <clipPath id="${clipId}">
            <rect class="waveform-progress-clip" x="0" y="0" width="${progress}" height="${height}"></rect>
          </clipPath>
        </defs>
        <path class="waveform-base" d="${path}"></path>
        <path class="waveform-played" d="${path}" clip-path="url(#${clipId})"></path>
      </svg>
      <span class="waveform-playhead"></span>
    </div>
    <span class="wave-time">${seconds(track.duration)}</span>
  `;
}

function renderAssetWave(track) {
  const width = 620;
  const height = 52;
  const path = waveformPath(waveformPeaks(track, 240), width, height);
  const label = track.waveformSource ? "Real WAV waveform" : "Preview waveform";
  return `
    <svg class="asset-waveform-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${label}">
      <title>${label}</title>
      <path d="${path}"></path>
    </svg>
  `;
}

function renderTagGroup(id, tags) {
  $(id).innerHTML = tags.map((tag) => `<button class="tag" data-tag="${tag}">${tag}</button>`).join("");
}

function renderQuick() {
  $("quickGrid").innerHTML = quickTags.map((item) => {
    return `<button data-combo="${item.tags.join("|")}">${item.label}</button>`;
  }).join("");
}

function syncFilterPreset() {
  const preset = filterPresets[state.type] || filterPresets.music;
  usageTags = preset.usage;
  sceneTags = preset.scene;
  styleTags = preset.style;
  quickTags = preset.quick;
  $("albumFilterCard").hidden = !preset.showAlbums;
  renderQuick();
  renderTagGroup("albumTags", preset.showAlbums ? albumTags : []);
  renderTagGroup("usageTags", usageTags);
  renderTagGroup("sceneTags", sceneTags);
  renderTagGroup("styleTags", styleTags);
}

function renderScenarios() {
  $("scenarioGrid").innerHTML = scenarios.map((scenario, index) => `
    <button class="scenario-card ${index === 0 ? "active" : ""}" style="--scene:${scenario.color}" data-scenario="${index}">
      <strong>${scenario.label}</strong>
      <span>${scenario.hint}</span>
    </button>
  `).join("");
}

function durationMatches(track) {
  if (!state.duration) return true;
  if (state.duration === "short") return track.duration <= 60;
  if (state.duration === "mid") return track.duration > 60 && track.duration <= 180;
  return track.duration > 180;
}

function searchable(track) {
  return [
    track.id,
    track.title,
    track.titleEn,
    track.artist,
    track.type,
    ...track.usage,
    ...track.scene,
    ...track.style,
    ...track.mood,
    ...track.structure,
    track.album || "",
    track.key,
    `${track.bpm}`,
    track.match
  ].join(" ").toLowerCase();
}

function normalizedTag(tag) {
  return tag.toLowerCase().replace(/\s+/g, "");
}

function trackHasTag(track, tag) {
  if (tag === "Loop") return track.structure.includes("Loop");
  const haystack = searchable(track).replace(/\s+/g, "");
  return haystack.includes(normalizedTag(tag));
}

function matches(track) {
  const queryOk = searchable(track).includes(state.query.toLowerCase());
  const tagsOk = [...state.activeTags].every((tag) => trackHasTag(track, tag));
  return track.type === state.type &&
    queryOk &&
    tagsOk &&
    durationMatches(track) &&
    track.bpm <= state.bpm &&
    (!state.loopOnly || track.structure.includes("Loop")) &&
    (!state.stemsOnly || track.structure.includes("Stems"));
}

function sorted(items) {
  return [...items].sort((a, b) => {
    if (state.sort === "popular") return b.popular - a.popular;
    if (state.sort === "bpm") return b.bpm - a.bpm;
    return tracks.indexOf(b) - tracks.indexOf(a);
  });
}

function scenarioScore(track, scenario) {
  let score = 0;
  scenario.query.forEach((tag) => {
    if (trackHasTag(track, tag)) score += 26;
  });
  if (track.structure.includes("Loop")) score += 8;
  if (track.structure.includes("Stems")) score += 6;
  if (track.popular > 90) score += 8;
  return Math.min(98, Math.max(62, score));
}

function bestForScenario(scenario) {
  const candidates = tracks.filter((track) => track.type === state.type || scenario.label.includes("转场"));
  return (candidates.length ? candidates : tracks)
    .map((track) => ({ track, score: scenarioScore(track, scenario) }))
    .sort((a, b) => b.score - a.score)[0];
}

function renderMatch() {
  const result = bestForScenario(state.scenario);
  if (!result) {
    $("matchResult").innerHTML = `
      <div class="match-top">
        <div class="score-ring" style="--score:0%"><span>0%</span></div>
        <div>
          <p class="kicker">Recommended Asset</p>
          <h3>暂无推荐</h3>
          <p>当前曲库还没有可推荐的资产。</p>
        </div>
      </div>
    `;
    return;
  }
  const track = result.track;
  $("matchResult").innerHTML = `
    <div class="match-top">
      <div class="score-ring" style="--score:${result.score}%"><span>${result.score}%</span></div>
      <div>
        <p class="kicker">Recommended Asset</p>
        <h3>${track.title}</h3>
        <p>${track.match}</p>
      </div>
    </div>
    <div class="match-wave">${wave(track.bpm, 44, .72)}</div>
    <div class="pill-row">
      ${[...track.scene.slice(0, 2), ...track.style.slice(0, 2), ...track.structure.slice(0, 2)].map((tag) => `<span class="pill hot">${tag}</span>`).join("")}
    </div>
  `;
}

function renderReleases() {
  $("releaseStrip").innerHTML = collections.map((collection) => {
    const matched = tracks.filter((track) => collection.tags.every((tag) => trackHasTag(track, tag)));
    const count = matched.length ? `${matched.length} assets` : collection.count;
    return `
      <article class="release-card genre-card" data-collection="${collection.tags.join("|")}" style="--cover-img:${collection.image};--tone:${collection.tone}">
        <div class="genre-overlay">
          <span class="genre-eyebrow">${collection.eyebrow}</span>
          <strong>${collection.title}</strong>
          <em>${collection.titleCn}</em>
          <div class="genre-tags">${collection.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          <small>${count}</small>
        </div>
      </article>
    `;
  }).join("");
}

function renderAlbums() {
  const albums = sleepAlbums.length ? sleepAlbums : [
    {
      name: "Game Starter",
      title: "Game Starter",
      cover: "./assets/covers/album-earth-sky-sleep.png",
      count: demoTracks.filter((track) => track.usage.includes("Game")).length,
      trackIds: demoTracks.filter((track) => track.usage.includes("Game")).map((track) => track.id)
    }
  ];
  $("albumStrip").innerHTML = albums.map((album) => {
    const albumTracks = tracks.filter((track) => album.trackIds?.includes(track.id));
    const preview = albumTracks.slice(0, 3).map((track) => track.title).join(" / ");
    return `
      <article class="album-card ${album.name === state.selectedAlbum ? "active" : ""}" data-album="${album.name}">
        <img src="${album.cover}" alt="">
        <div class="album-meta">
          <span>${album.category || "睡眠类场景音乐"} · ${album.count} tracks</span>
          <strong>${album.title}</strong>
          <small>${preview || "ASTRASONIC curated release"}</small>
        </div>
      </article>
    `;
  }).join("");
}

function renderAlbumDetail() {
  const album = sleepAlbums.find((item) => item.name === state.selectedAlbum) || sleepAlbums[0];
  if (!album) {
    $("albumDetail").innerHTML = "";
    return;
  }
  const albumTracks = tracks.filter((track) => album.trackIds?.includes(track.id));
  const totalDuration = albumTracks.reduce((sum, track) => sum + track.duration, 0);
  const firstTrackIndex = tracks.indexOf(albumTracks[0]);
  $("albumDetail").innerHTML = `
    <div class="album-detail-cover" style="--cover-img:url('${album.cover}')"></div>
    <div class="album-detail-copy">
      <p class="kicker">Album Detail</p>
      <h3>${album.title}</h3>
      <p>${album.category || "睡眠类场景音乐"} · ${albumTracks.length} 首 · 总时长 ${seconds(totalDuration)} · ${uniqueCount(albumTracks.map((track) => track.sourcePath))} 个 WAV 源文件</p>
      <div class="album-actions">
        <button data-play="${firstTrackIndex}">${icon("play")} 试听专辑</button>
        <button data-license-album="${album.name}">整专授权</button>
      </div>
      <div class="album-source">${album.sourceFolder || "ASTRASONIC Library"}</div>
    </div>
    <div class="album-track-mini">
      ${albumTracks.slice(0, 12).map((track) => `
        <button data-play="${tracks.indexOf(track)}">
          <span>${track.id}</span>
          <strong>${track.title}</strong>
          <small>${seconds(track.duration)}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderLibraryStatus() {
  const sourceCount = uniqueCount(tracks.map((track) => track.sourcePath));
  const previewCount = uniqueCount(tracks.map((track) => track.audio));
  const waveformCount = tracks.filter((track) => Array.isArray(track.peaks) && track.peaks.length).length;
  const albumCount = sleepAlbums.length;
  $("statusGrid").innerHTML = [
    { value: albumCount, label: "已入库专辑", note: catalogSource === "sqlite-api" ? "SQLite API 驱动" : "来自桌面 ASTRASONIC" },
    { value: tracks.length, label: "曲目资产", note: "睡眠类场景音乐" },
    { value: sourceCount, label: "WAV 源文件", note: "保留 sourcePath" },
    { value: previewCount, label: "MP3 试听", note: "网页可播放" },
    { value: waveformCount, label: "真实波形", note: "720 peak points / track" }
  ].map((item) => `
    <span>
      <strong>${item.value}</strong>
      <em>${item.label}</em>
      <small>${item.note}</small>
    </span>
  `).join("");
}

function applySleepCatalog(data) {
  catalogSource = data.source || "static-json";
  sleepAlbums = data.albums || [];
  const sleepTracks = (data.tracks || []).map((track) => ({
    ...track,
    type: track.type || "music",
    usage: track.usage || ["Space", "Video"],
    scene: track.scene || ["睡眠冥想", "睡眠"],
    style: track.style || ["氛围", "环境"],
    mood: track.mood || ["舒缓", "安静"],
    structure: track.structure || ["Full", "Loop"],
    color: track.color || "linear-gradient(135deg,#425144,#0d1110 52%,#c79a62)",
    image: track.image || "url('./assets/covers/album-earth-sky-sleep.png')"
  }));
  tracks = sleepTracks;
  collections = demoCollections;
  albumTags = sleepAlbums.map((album) => album.name);
  scenarios = demoScenarios;
  state.type = "music";
  state.query = "";
  state.activeTags.clear();
  state.current = sleepTracks[0] || demoTracks[0] || state.current;
  state.scenario = scenarios.find((scenario) => scenario.label === "睡眠冥想") || scenarios[0];
  state.selectedAlbum = sleepAlbums[0]?.name || "";
  state.expandedTrack = "";
}

async function loadSleepCatalog() {
  const sources = [
    { label: "api", url: "/api/catalog" },
    { label: "static", url: "./assets/sleep-catalog.json" }
  ];
  for (const source of sources) {
    try {
      const response = await fetch(source.url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      applySleepCatalog(data);
      return true;
    } catch (error) {
      console.warn(`Sleep catalog ${source.label} was not available:`, error);
    }
  }
  if (window.ASTRASONIC_SLEEP_CATALOG) {
    applySleepCatalog(window.ASTRASONIC_SLEEP_CATALOG);
    return true;
  }
  return false;
}

function renderLatestAssets() {
  $("latestAssets").innerHTML = sorted(tracks).slice(0, 6).map((track) => {
    const index = tracks.indexOf(track);
    return `
      <article class="latest-card" data-play="${index}" style="--cover:${track.color};--cover-img:${track.image}">
        <div class="latest-art"></div>
        <div class="latest-meta">
          <strong>${track.title}</strong>
          <span>${track.id} · ${track.bpm} BPM · ¥${track.price} 起</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderTracks() {
  const result = sorted(tracks.filter(matches));
  $("resultCount").textContent = `${result.length} assets matched`;
  $("trackList").innerHTML = result.map((track) => {
    const index = tracks.indexOf(track);
    const versionCount = Math.max(1, track.structure.length - 1);
    const isExpanded = state.expandedTrack === track.id;
    return `
      <article class="asset-row ${isExpanded ? "expanded" : ""}" style="--cover:${track.color};--cover-img:${track.image}">
        <div class="asset-cover"></div>
        <button class="play-button" data-play="${index}" aria-label="试听 ${track.title}">${icon("play")}</button>
        <div class="asset-name">
          <strong class="asset-title">${track.title}</strong>
          <span class="asset-sub">${track.album || track.titleEn} · ${track.artist} · ${track.waveformSource ? "真实波形" : "预览波形"}</span>
        </div>
        <span class="version-pill">+${versionCount}</span>
        <div class="asset-wave">${renderAssetWave(track)}</div>
        <div class="asset-stats"><strong>${seconds(track.duration)}</strong><span>${track.bpm} BPM</span></div>
        <div class="row-actions">
          <button aria-label="收藏">${icon("star")}</button>
          <button class="${isExpanded ? "active" : ""}" data-expand="${track.id}" aria-label="展开 ${track.title}">${icon("chevron")}</button>
        </div>
        ${isExpanded ? renderTrackDetail(track) : ""}
      </article>
    `;
  }).join("") || `
    <article class="asset-row">
      <div></div>
      <div></div>
      <div>
        <strong class="asset-title">没有匹配结果</strong>
        <span class="asset-sub">${(filterPresets[state.type] || filterPresets.music).empty}</span>
      </div>
    </article>
  `;
}

function renderTrackDetail(track) {
  const tags = [...track.scene, ...track.style, ...track.mood, ...track.structure];
  return `
    <div class="asset-detail">
      <div class="asset-detail-wave">${renderAssetWave(track)}</div>
      <div class="detail-grid">
        <span><strong>源文件</strong><em>${track.sourceFile || fileName(track.sourcePath)}</em></span>
        <span><strong>原始路径</strong><em>${track.sourcePath || "未记录"}</em></span>
        <span><strong>试听文件</strong><em>${track.audio}</em></span>
        <span><strong>格式</strong><em>${track.sourceFormat || "WAV source"}</em></span>
        <span><strong>波形</strong><em>${track.waveformSource || "Real waveform"} · ${track.peaks?.length || 0} points</em></span>
        <span><strong>入库日期</strong><em>${track.ingestedAt || "2026-05-13"}</em></span>
      </div>
      <p>${track.match}</p>
      <div class="pill-row">${tags.slice(0, 12).map((tag) => `<span class="pill hot">${tag}</span>`).join("")}</div>
    </div>
  `;
}

function setCurrent(track) {
  state.current = track;
  $("nowTitle").textContent = track.title;
  $("nowMeta").textContent = `${track.artist} · ${track.album || track.usage.join("/")} · ${track.bpm} BPM · ${track.key} · ¥${track.price} 起`;
  $("nowCover").style.setProperty("--cover", track.color);
  $("nowCover").style.setProperty("--cover-img", track.image);
  if (track.audio && previewAudio.src !== new URL(track.audio, window.location.href).href) {
    previewAudio.src = track.audio;
    previewAudio.load();
  }
  $("playerWave").innerHTML = renderPlayerWave(track, 0);
}

function renderActiveFilters() {
  const filters = [
    ...[...state.activeTags].map((tag) => ({ key: tag, label: tag })),
    ...(state.loopOnly ? [{ key: "__loop", label: "Loop" }] : []),
    ...(state.stemsOnly ? [{ key: "__stems", label: "Stems" }] : []),
    ...(state.duration ? [{ key: "__duration", label: $("durationFilter").selectedOptions[0].textContent }] : []),
    ...(state.bpm < 180 ? [{ key: "__bpm", label: `BPM ≤ ${state.bpm}` }] : [])
  ];
  $("activeCount").textContent = String(filters.length);
  $("activeFilters").innerHTML = filters.length
    ? filters.map((filter) => `<span class="active-chip">${filter.label}<button data-remove="${filter.key}" aria-label="移除 ${filter.label}">×</button></span>`).join("")
    : `<span class="asset-sub">暂无筛选条件</span>`;
}

function updateActiveControls() {
  document.querySelectorAll("[data-tag]").forEach((button) => {
    button.classList.toggle("active", state.activeTags.has(button.dataset.tag));
  });
  document.querySelectorAll("[data-combo]").forEach((button) => {
    const tags = button.dataset.combo.split("|");
    button.classList.toggle("active", tags.every((tag) => state.activeTags.has(tag)));
  });
  document.querySelectorAll("[data-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.type === state.type);
  });
}

function rerender() {
  updateActiveControls();
  renderActiveFilters();
  renderAlbums();
  renderAlbumDetail();
  renderLibraryStatus();
  renderMatch();
  renderLatestAssets();
  renderReleases();
  renderTracks();
  renderProjectCart();
}

function clearFilters() {
  state.query = "";
  state.activeTags.clear();
  state.duration = "";
  state.bpm = 180;
  state.loopOnly = false;
  state.stemsOnly = false;
  $("searchInput").value = "";
  $("durationFilter").value = "";
  $("bpmFilter").value = "180";
  $("bpmValue").textContent = "180";
  $("loopFilter").checked = false;
  $("stemsFilter").checked = false;
  rerender();
}

function resetBrowseFilters({ keepTags = false } = {}) {
  state.query = "";
  state.duration = "";
  state.bpm = 180;
  state.loopOnly = false;
  state.stemsOnly = false;
  state.expandedTrack = "";
  if (!keepTags) state.activeTags.clear();
  $("searchInput").value = "";
  $("durationFilter").value = "";
  $("bpmFilter").value = "180";
  $("bpmValue").textContent = "180";
  $("loopFilter").checked = false;
  $("stemsFilter").checked = false;
}

function updatePlayerProgress() {
  if (!state.current) return;
  const duration = Number.isFinite(previewAudio.duration) ? previewAudio.duration : state.current.duration;
  const current = previewAudio.currentTime || 0;
  const ratio = duration ? Math.max(0, Math.min(1, current / duration)) : 0;
  const shell = $("playerWave").querySelector(".waveform-shell");
  const clip = $("playerWave").querySelector(".waveform-progress-clip");
  const elapsed = $("playerWave").querySelector(".wave-time-elapsed");
  if (shell) shell.style.setProperty("--progress", `${(ratio * 100).toFixed(1)}%`);
  if (clip) clip.setAttribute("width", String(Math.round(900 * ratio)));
  if (elapsed) elapsed.textContent = seconds(Math.floor(current));
}

async function playCurrent() {
  if (!state.current?.audio) return;
  try {
    await previewAudio.play();
    isPlaying = true;
    $("playerPlay").innerHTML = icon("pause");
    $("playerPlay").setAttribute("aria-label", "暂停");
    $("playerWave").classList.add("is-playing");
  } catch (error) {
    console.warn("Audio preview failed:", error);
  }
}

function pauseCurrent() {
  previewAudio.pause();
  isPlaying = false;
  $("playerPlay").innerHTML = icon("play");
  $("playerPlay").setAttribute("aria-label", "播放");
  $("playerWave").classList.remove("is-playing");
}

function toggleCurrent() {
  isPlaying ? pauseCurrent() : playCurrent();
}

function seekPlayer(event) {
  if (!state.current) return;
  const shell = event.target.closest(".waveform-shell");
  if (!shell) return;
  const rect = shell.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const duration = Number.isFinite(previewAudio.duration) ? previewAudio.duration : state.current.duration;
  previewAudio.currentTime = duration * ratio;
  updatePlayerProgress();
}

function addCurrentToProject() {
  if (!state.current) return;
  if (!projectCart.some((track) => track.id === state.current.id)) {
    projectCart = [...projectCart, state.current];
  }
  renderProjectCart();
}

function renderProjectCart() {
  $("projectCount").textContent = String(projectCart.length);
  $("projectHint").textContent = `${projectCart.length} tracks`;
  $("projectList").innerHTML = projectCart.length
    ? projectCart.map((track) => `
      <div class="project-item">
        <span>${track.title}</span>
        <small>${track.id} · ¥${track.price} 起</small>
        <button data-remove-project="${track.id}" aria-label="移除 ${track.title}">×</button>
      </div>
    `).join("")
    : `<p class="empty-project">还没有加入项目的曲目。</p>`;
}

function renderLicensePanel() {
  const track = state.current;
  if (!track) return;
  const options = [
    { title: "Demo 测试", price: "¥0", body: "用于内部剪辑、样片验证和选曲沟通。" },
    { title: "标准商用", price: `¥${track.price}`, body: "适合短视频、独立游戏、播客或品牌内容单曲授权。" },
    { title: "企业授权", price: "API", body: "支持批量曲库、门店空间、游戏项目包和定制结算。" }
  ];
  $("licenseTitle").textContent = `${track.title} 授权草案`;
  $("licenseIntro").textContent = `${track.artist} · ${track.album || track.usage.join("/")} · ${seconds(track.duration)} · ${track.bpm} BPM`;
  $("licenseSummary").innerHTML = `
    <div class="license-cover" style="--cover:${track.color};--cover-img:${track.image}"></div>
    <div>
      <strong>${track.titleEn}</strong>
      <p>${track.match}</p>
      <div class="pill-row">
        ${[...track.scene.slice(0, 2), ...track.style.slice(0, 2), ...track.structure.slice(0, 2)].map((tag) => `<span class="pill hot">${tag}</span>`).join("")}
      </div>
    </div>
  `;
  $("licenseOptions").innerHTML = options.map((option) => `
    <button>
      <strong>${option.price}</strong>
      <span>${option.title}</span>
      <small>${option.body}</small>
    </button>
  `).join("");
}

function openLicensePanel() {
  addCurrentToProject();
  renderLicensePanel();
  $("licenseModal").classList.add("open");
  $("licenseModal").setAttribute("aria-hidden", "false");
}

function closeLicensePanel() {
  $("licenseModal").classList.remove("open");
  $("licenseModal").setAttribute("aria-hidden", "true");
}

async function boot() {
  await loadSleepCatalog();
  syncFilterPreset();
  renderScenarios();
  document.querySelectorAll("[data-scenario]").forEach((button, index) => {
    button.classList.toggle("active", scenarios[index] === state.scenario);
  });
  setCurrent(state.current);
  rerender();
}

boot();

document.addEventListener("click", (event) => {
  const play = event.target.closest("[data-play]");
  const tag = event.target.closest("[data-tag]");
  const combo = event.target.closest("[data-combo]");
  const collection = event.target.closest("[data-collection]");
  const type = event.target.closest("[data-type]");
  const sort = event.target.closest("[data-sort]");
  const scenario = event.target.closest("[data-scenario]");
  const remove = event.target.closest("[data-remove]");
  const scenePick = event.target.closest("[data-scene-pick]");
  const album = event.target.closest("[data-album]");
  const removeProject = event.target.closest("[data-remove-project]");
  const expand = event.target.closest("[data-expand]");
  const licenseAlbum = event.target.closest("[data-license-album]");

  if (play) {
    setCurrent(tracks[Number(play.dataset.play)]);
    playCurrent();
  }
  if (tag) {
    const value = tag.dataset.tag;
    state.activeTags.has(value) ? state.activeTags.delete(value) : state.activeTags.add(value);
    rerender();
  }
  if (combo) {
    const tags = combo.dataset.combo.split("|");
    const allActive = tags.every((value) => state.activeTags.has(value));
    tags.forEach((value) => allActive ? state.activeTags.delete(value) : state.activeTags.add(value));
    rerender();
  }
  if (collection) {
    resetBrowseFilters();
    state.type = "music";
    syncFilterPreset();
    collection.dataset.collection.split("|").forEach((value) => state.activeTags.add(value));
    state.selectedAlbum = sleepAlbums[0]?.name || "";
    document.getElementById("catalog").scrollIntoView({ block: "start" });
    rerender();
  }
  if (type) {
    resetBrowseFilters();
    state.type = type.dataset.type;
    syncFilterPreset();
    setCurrent(tracks.find((track) => track.type === state.type) || tracks[0]);
    rerender();
  }
  if (sort) {
    state.sort = sort.dataset.sort;
    document.querySelectorAll("[data-sort]").forEach((button) => button.classList.toggle("active", button === sort));
    rerender();
  }
  if (scenario) {
    state.scenario = scenarios[Number(scenario.dataset.scenario)];
    document.querySelectorAll("[data-scenario]").forEach((button) => button.classList.toggle("active", button === scenario));
    renderMatch();
  }
  if (remove) {
    const key = remove.dataset.remove;
    if (key === "__loop") $("loopFilter").click();
    else if (key === "__stems") $("stemsFilter").click();
    else if (key === "__duration") {
      state.duration = "";
      $("durationFilter").value = "";
      rerender();
    } else if (key === "__bpm") {
      state.bpm = 180;
      $("bpmFilter").value = "180";
      $("bpmValue").textContent = "180";
      rerender();
    } else {
      state.activeTags.delete(key);
      rerender();
    }
  }
  if (scenePick) {
    resetBrowseFilters();
    state.type = "music";
    syncFilterPreset();
    state.query = scenePick.dataset.scenePick;
    $("searchInput").value = state.query;
    document.getElementById("catalog").scrollIntoView({ block: "start" });
    rerender();
  }
  if (album) {
    resetBrowseFilters();
    state.type = "music";
    syncFilterPreset();
    state.selectedAlbum = album.dataset.album;
    state.activeTags.add(album.dataset.album);
    document.getElementById("catalog").scrollIntoView({ block: "start" });
    rerender();
  }
  if (expand) {
    state.expandedTrack = state.expandedTrack === expand.dataset.expand ? "" : expand.dataset.expand;
    rerender();
  }
  if (licenseAlbum) {
    const albumTracks = tracks.filter((track) => track.album === licenseAlbum.dataset.licenseAlbum);
    projectCart = [...new Map([...projectCart, ...albumTracks].map((track) => [track.id, track])).values()];
    setCurrent(albumTracks[0] || state.current);
    openLicensePanel();
  }
  if (removeProject) {
    projectCart = projectCart.filter((track) => track.id !== removeProject.dataset.removeProject);
    renderProjectCart();
  }
});

$("searchInput").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  rerender();
});

$("durationFilter").addEventListener("change", (event) => {
  state.duration = event.target.value;
  rerender();
});

$("bpmFilter").addEventListener("input", (event) => {
  state.bpm = Number(event.target.value);
  $("bpmValue").textContent = String(state.bpm);
  rerender();
});

$("loopFilter").addEventListener("change", (event) => {
  state.loopOnly = event.target.checked;
  rerender();
});

$("stemsFilter").addEventListener("change", (event) => {
  state.stemsOnly = event.target.checked;
  rerender();
});

$("clearFilters").addEventListener("click", clearFilters);
$("panelToggle").addEventListener("click", () => $("sidebar").classList.toggle("open"));

$("playerPlay").addEventListener("click", toggleCurrent);
$("playerWave").addEventListener("click", seekPlayer);
$("addToProject").addEventListener("click", addCurrentToProject);
$("licenseAction").addEventListener("click", openLicensePanel);
$("closeLicense").addEventListener("click", closeLicensePanel);
$("licenseModal").addEventListener("click", (event) => {
  if (event.target === $("licenseModal")) closeLicensePanel();
});
previewAudio.addEventListener("timeupdate", updatePlayerProgress);
previewAudio.addEventListener("ended", pauseCurrent);
