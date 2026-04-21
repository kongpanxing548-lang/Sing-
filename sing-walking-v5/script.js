const fallbackContent = {
  nav: [
    { label: "Home", href: "#home" },
    { label: "Music", href: "#music" },
    { label: "Journey", href: "#journey" },
    { label: "Journal", href: "#journal" },
    { label: "About", href: "#about" },
  ],
  songs: [
    {
      id: "walking",
      title: "行走",
      mood: "在城市与自我之间迷失，又重新出发。",
      tags: ["城市夜路", "自我反思", "独立音乐"],
      note: "生命，是一场行走，但也是一次反思。",
    },
    {
      id: "midnight",
      title: "无数个凌晨",
      mood: "写给那些还没有睡下的人。",
      tags: ["深夜", "Demo", "内心"],
      note: "把失败、疲惫和微弱的光都放进旋律里。",
    },
    {
      id: "city",
      title: "梦想抵抗城市",
      mood: "梦想仍在顽固抵抗这座城市。",
      tags: ["电影感", "吉他", "叙事"],
      note: "不是赢过现实，而是不被现实完全吞没。",
    },
  ],
  journeyBeats: [
    {
      step: "01",
      quote: "我们需要在有限的生命里，重新审视当下。",
      body: "不是回忆过去，而是把当下从惯性里拉回来。",
    },
    {
      step: "02",
      quote: "梦想仍在顽固抵抗这座城市。",
      body: "路灯、工作、深夜、吉他，都变成一条还没有走完的线。",
    },
    {
      step: "03",
      quote: "无数个凌晨。",
      body: "那些安静的时刻，决定了音乐里最真实的部分。",
    },
    {
      step: "04",
      quote: "如今一切是你想要的吗？",
      body: "这是《行走》的核心问题，也是整个网站的入口。",
    },
    {
      step: "05",
      quote: "行走吧。",
      body: "人生没有边界，行走就是答案。",
    },
  ],
  journals: [
    {
      date: "Walking Note 01",
      title: "把一首歌写成一段路",
      body: "从一句自我追问开始，把城市夜色拆成节奏、和声和呼吸。",
      tags: ["创作过程", "行走"],
    },
    {
      date: "Walking Note 02",
      title: "游戏音频给我的叙事训练",
      body: "每个声音都需要解释空间、动作和情绪，这也会成为 Sing 的专业差异。",
      tags: ["游戏音频", "制作"],
    },
    {
      date: "Walking Note 03",
      title: "不要把网站做成网盘",
      body: "每首作品都要有故事、歌词、制作信息和人生阶段。",
      tags: ["内容宇宙", "产品"],
    },
  ],
  aboutTimeline: [
    { label: "起点", body: "初中、吉他、乐队，一个人开始用声音理解自己。" },
    { label: "对抗", body: "家人的反对、现实的压力，让音乐从爱好变成自我证明。" },
    { label: "行走", body: "城市、工作、驻唱和深夜，把生活不断写进歌里。" },
    { label: "现在", body: "独立音乐人，也带着游戏音频的项目经验继续创作。" },
  ],
  buildPhases: [
    { phase: "Phase 1", title: "情绪入口", body: "首页、视觉系统、精选音乐和 Journey 叙事原型。" },
    { phase: "Phase 2", title: "音乐系统", body: "播放器、单曲详情、歌词、创作故事和制作信息。" },
    { phase: "Phase 3", title: "内容宇宙", body: "日志、人生阶段、内容 CMS、SEO 与持续运营节奏。" },
  ],
};

const content = window.SING_CONTENT || fallbackContent;

const navLinks = document.querySelector("#navLinks");
const songRail = document.querySelector("#songRail");
const journeyBeats = document.querySelector("#journeyBeats");
const journeyStep = document.querySelector("#journeyStep");
const journeySong = document.querySelector("#journeySong");
const journeyHint = document.querySelector("#journeyHint");
const journeyDots = document.querySelector("#journeyDots");
const journalGrid = document.querySelector("#journalGrid");
const aboutTimeline = document.querySelector("#aboutTimeline");
const phaseGrid = document.querySelector("#phaseGrid");
const player = document.querySelector(".player");
const playerToggle = document.querySelector("#playerToggle");
const playerTitle = document.querySelector("#playerTitle");
const playerNote = document.querySelector("#playerNote");
const progressTrack = document.querySelector("#progressTrack");
const progressBar = document.querySelector("#progressBar");
const nextButton = document.querySelector("#nextButton");
const songDialog = document.querySelector("#songDialog");
const dialogClose = document.querySelector("#dialogClose");
const dialogKicker = document.querySelector("#dialogKicker");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogMood = document.querySelector("#dialogMood");
const dialogPlay = document.querySelector("#dialogPlay");
const dialogDuration = document.querySelector("#dialogDuration");
const dialogStory = document.querySelector("#dialogStory");
const dialogLyrics = document.querySelector("#dialogLyrics");
const dialogProduction = document.querySelector("#dialogProduction");

let isPlaying = false;
let activeSong = content.songs[0];
let progress = 0;
let progressTimer = null;
let audioElement = null;
let audioContext = null;
let synthGain = null;
let synthOscillators = [];
let activeJourneyIndex = -1;

function renderNav() {
  navLinks.innerHTML = content.nav
    .map((item) => `<a href="${item.href}">${item.label}</a>`)
    .join("");
}

function renderSongs() {
  songRail.innerHTML = content.songs
    .map(
      (song, index) => `
        <article class="song-card reveal">
          <span class="song-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>${song.title}</h3>
            <p>${song.mood}</p>
          </div>
          <div class="song-meta">
            ${song.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="song-actions">
            <button class="song-play" type="button" aria-label="播放${song.title}" data-play-song="${song.id}">▶</button>
            <button class="song-detail" type="button" data-open-song="${song.id}">查看故事</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderJourney() {
  journeyBeats.innerHTML = content.journeyBeats
    .map((beat, index) => {
      const song = content.songs.find((item) => item.id === beat.songId);
      return `
        <article class="beat reveal" data-journey-index="${index}" data-song-id="${beat.songId}" data-tone="${beat.tone}">
          <small>${beat.step}</small>
          <blockquote>${beat.quote}</blockquote>
          <p>${beat.body}</p>
          <button class="song-detail journey-play" type="button" data-play-song="${beat.songId}">
            ${song ? `播放 ${song.title}` : "播放这一段"}
          </button>
        </article>
      `;
    })
    .join("");

  journeyDots.innerHTML = content.journeyBeats
    .map(
      (beat, index) => `
        <button class="journey-dot" type="button" aria-label="跳到 ${beat.step}" data-jump-journey="${index}"></button>
      `,
    )
    .join("");
}

function renderJournals() {
  journalGrid.innerHTML = content.journals
    .map(
      (entry) => `
        <article class="journal-card reveal">
          <time>${entry.date}</time>
          <h3>${entry.title}</h3>
          <p>${entry.body}</p>
          <div class="tag-list">${entry.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </article>
      `,
    )
    .join("");
}

function renderAbout() {
  aboutTimeline.innerHTML = content.aboutTimeline
    .map(
      (item) => `
        <div class="timeline-item reveal">
          <strong>${item.label}</strong>
          <p>${item.body}</p>
        </div>
      `,
    )
    .join("");
}

function renderPhases() {
  phaseGrid.innerHTML = content.buildPhases
    .map(
      (phase) => `
        <article class="phase-card reveal">
          <small>${phase.phase}</small>
          <h3>${phase.title}</h3>
          <p>${phase.body}</p>
        </article>
      `,
    )
    .join("");
}

function durationToSeconds(duration = "03:30") {
  const [minutes = "3", seconds = "30"] = duration.split(":");
  return Number(minutes) * 60 + Number(seconds);
}

function stopRealAudio() {
  if (!audioElement) return;
  audioElement.pause();
  audioElement = null;
}

function startSynth() {
  if (audioElement || synthGain) return;
  audioContext = audioContext || new AudioContext();
  synthGain = audioContext.createGain();
  synthGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  synthGain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.6);
  synthGain.connect(audioContext.destination);

  const notes = [110, 164.81, 220];
  synthOscillators = notes.map((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = index === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index * 4;
    oscillator.connect(synthGain);
    oscillator.start();
    return oscillator;
  });
}

function stopSynth() {
  if (!synthGain) return;
  const now = audioContext.currentTime;
  synthGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  synthOscillators.forEach((oscillator) => oscillator.stop(now + 0.4));
  synthGain = null;
  synthOscillators = [];
}

function stopAudio() {
  stopRealAudio();
  stopSynth();
}

function startAudio() {
  stopAudio();
  if (activeSong.audio) {
    audioElement = new Audio(activeSong.audio);
    audioElement.addEventListener("ended", nextSong);
    audioElement.play().catch(() => {
      audioElement = null;
      startSynth();
    });
  } else {
    startSynth();
  }
}

function startProgress(reset = false) {
  if (reset) progress = 0;
  window.clearInterval(progressTimer);
  progressTimer = window.setInterval(() => {
    const duration = durationToSeconds(activeSong.duration);
    if (audioElement && Number.isFinite(audioElement.duration)) {
      progress = Math.min(100, (audioElement.currentTime / audioElement.duration) * 100);
    } else {
      progress = Math.min(100, progress + 100 / duration);
    }

    if (progress >= 100) {
      nextSong();
      return;
    }

    updatePlayer();
  }, 1000);
}

function stopProgress() {
  window.clearInterval(progressTimer);
  progressTimer = null;
}

function setPlayer(songId, options = {}) {
  const { play = true, reset = true } = options;
  activeSong = content.songs.find((song) => song.id === songId) || activeSong;
  playerTitle.textContent = activeSong.title;
  playerNote.textContent = activeSong.note || "试听片段";
  if (reset) progress = 0;
  if (play) {
    isPlaying = true;
    startAudio();
    startProgress(reset);
  } else if (isPlaying) {
    startAudio();
    startProgress(reset);
  }
  updatePlayer();
}

function updatePlayer() {
  player.classList.toggle("is-playing", isPlaying);
  playerToggle.innerHTML = `<span aria-hidden="true">${isPlaying ? "Ⅱ" : "▶"}</span>`;
  progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  progressTrack?.setAttribute("aria-valuenow", String(Math.round(progress)));
}

function togglePlayer() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    if (audioElement) audioElement.play();
    else startAudio();
    startProgress(false);
  } else {
    if (audioElement) audioElement.pause();
    stopSynth();
    stopProgress();
  }
  updatePlayer();
}

function nextSong() {
  const index = content.songs.findIndex((song) => song.id === activeSong.id);
  const next = content.songs[(index + 1) % content.songs.length];
  setPlayer(next.id);
}

function setJourney(index, options = {}) {
  const beat = content.journeyBeats[index];
  if (!beat) return;

  if (index === activeJourneyIndex) {
    if (options.play && beat.songId) setPlayer(beat.songId, { play: true, reset: true });
    return;
  }

  activeJourneyIndex = index;
  const song = content.songs.find((item) => item.id === beat.songId);
  document.body.dataset.journeyTone = beat.tone || "city";
  journeyStep.textContent = beat.step;
  journeySong.textContent = song ? song.title : "Journey";
  journeyHint.textContent = isPlaying
    ? "正在随叙事切换声音。"
    : "滚动已同步播放器，点击播放即可进入这一段。";

  document.querySelectorAll(".beat").forEach((node) => {
    node.classList.toggle("is-active", Number(node.dataset.journeyIndex) === index);
  });
  document.querySelectorAll(".journey-dot").forEach((node) => {
    node.classList.toggle("is-active", Number(node.dataset.jumpJourney) === index);
  });

  if (beat.songId) setPlayer(beat.songId, { play: options.play ?? false, reset: true });
}

function openSong(songId) {
  const song = content.songs.find((item) => item.id === songId);
  if (!song) return;

  activeSong = song;
  dialogKicker.textContent = "Song Page";
  dialogTitle.textContent = song.title;
  dialogMood.textContent = song.mood;
  dialogDuration.textContent = song.duration || "Preview";
  dialogStory.textContent = song.story || song.note || "";
  dialogLyrics.innerHTML = (song.lyrics || []).map((line) => `<p>${line}</p>`).join("");
  dialogProduction.innerHTML = Object.entries(song.production || {})
    .map(
      ([key, value]) => `
        <div>
          <dt>${key}</dt>
          <dd>${value}</dd>
        </div>
      `,
    )
    .join("");
  songDialog.showModal();
}

function bindPlayer() {
  document.body.addEventListener("click", (event) => {
    const playTrigger = event.target.closest("[data-play-song]");
    if (playTrigger) {
      const beat = playTrigger.closest(".beat");
      if (beat) {
        beat.scrollIntoView({ behavior: "smooth", block: "center" });
        setJourney(Number(beat.dataset.journeyIndex), { play: true });
        return;
      }
      setPlayer(playTrigger.dataset.playSong);
      return;
    }

    const detailTrigger = event.target.closest("[data-open-song]");
    if (detailTrigger) {
      openSong(detailTrigger.dataset.openSong);
      return;
    }

    const journeyTrigger = event.target.closest("[data-jump-journey]");
    if (journeyTrigger) {
      const target = document.querySelector(
        `[data-journey-index="${journeyTrigger.dataset.jumpJourney}"]`,
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  playerToggle.addEventListener("click", togglePlayer);
  nextButton.addEventListener("click", nextSong);
  dialogPlay.addEventListener("click", () => setPlayer(activeSong.id));
  dialogClose.addEventListener("click", () => songDialog.close());
  songDialog.addEventListener("click", (event) => {
    if (event.target === songDialog) songDialog.close();
  });
}

function observeReveals() {
  const revealNodes = [...document.querySelectorAll(".reveal")];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }
    },
    { rootMargin: "180px 0px", threshold: 0.01 },
  );

  function markPassed() {
    revealNodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight + 220) {
        node.classList.add("is-visible");
      }
    });
  }

  revealNodes.forEach((node) => observer.observe(node));
  window.addEventListener("scroll", markPassed, { passive: true });
  markPassed();
}

function observeJourney() {
  const beats = [...document.querySelectorAll(".beat")];
  let ticking = false;

  function updateFromScroll() {
    ticking = false;
    const center = window.innerHeight * 0.48;
    let bestIndex = 0;
    let bestDistance = Infinity;

    beats.forEach((beat, index) => {
      const rect = beat.getBoundingClientRect();
      const beatCenter = rect.top + rect.height / 2;
      const distance = Math.abs(beatCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    setJourney(bestIndex, { play: false });
  }

  function queueUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateFromScroll);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setJourney(Number(visible.target.dataset.journeyIndex), { play: false });
    },
    { rootMargin: "-24% 0px -38% 0px", threshold: [0.2, 0.45, 0.68] },
  );

  beats.forEach((beat) => observer.observe(beat));
  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate);
  setJourney(0, { play: false });
  queueUpdate();
}

renderNav();
renderSongs();
renderJourney();
renderJournals();
renderAbout();
renderPhases();
bindPlayer();
observeReveals();
observeJourney();
updatePlayer();
