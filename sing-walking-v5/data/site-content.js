(function () {
  const content = {
    nav: [
      { label: "首页", href: "#home" },
      { label: "音乐", href: "#music" },
      { label: "行走", href: "#journey" },
      { label: "日志", href: "#journal" },
      { label: "关于", href: "#about" },
    ],
    songs: [
      {
        id: "walking",
        title: "行走",
        mood: "在城市与自我之间迷失，又重新出发。",
        tags: ["城市夜路", "自我反思", "独立音乐"],
        note: "主题曲。保留呼吸感和留白，让声音先于解释抵达。",
        duration: "04:18",
        audio: "",
        story:
          "《行走》是整个空间的入口。它不是在讲一个成功故事，而是在问：当现实不断压近，音乐还能不能保留一个人真正想成为的样子。",
        lyrics: [
          "生命，是一场行走",
          "但也是一次反思",
          "在城市的反光里",
          "我听见另一个自己",
          "行走吧，别错过本该属于你的生命",
        ],
        production: {
          role: "词 / 曲 / 演唱：Sing",
          daw: "DAW：Logic / Ableton 预留",
          sound: "声音设计：夜路环境、低频脉冲、吉他延音",
          style: "风格：独立流行 / 电影感叙事",
        },
      },
      {
        id: "midnight-light",
        title: "凌晨路灯",
        mood: "孤独不是答案，但它能照见答案。",
        tags: ["深夜", "吉他", "低速叙事"],
        note: "偏抒情的夜行单曲，适合承接叙事页的低潮段落。",
        duration: "03:42",
        audio: "",
        story:
          "一首写给凌晨的歌。它保留很多空白，让听的人可以把自己的疲惫、犹豫和一点点不甘放进去。",
        lyrics: ["凌晨的路灯没有回答", "只是陪我慢慢走完", "风从身后经过", "像一段没有寄出的和声"],
        production: {
          role: "词 / 曲：Sing",
          daw: "DAW：GarageBand Demo / 后续重录",
          sound: "声音设计：干净吉他、远处车流、轻微磁带噪声",
          style: "风格：Acoustic / Slow Pop",
        },
      },
      {
        id: "reflecting-street",
        title: "反光的街",
        mood: "把现实的冷意，写成一束微弱的光。",
        tags: ["城市采样", "电子质感", "游戏音频"],
        note: "连接独立音乐与游戏音频背景，用环境声做情绪底色。",
        duration: "03:56",
        audio: "",
        story:
          "这首歌更接近声音场景：街面反光、雨后空气、脚步和电流声一起组成一个可以进入的城市空间。",
        lyrics: ["反光的街像一条河", "我从现实的边缘经过", "每一步都很轻", "却没有停止"],
        production: {
          role: "作曲 / 声音设计：Sing",
          daw: "DAW：Ableton Live 预留",
          sound: "声音设计：城市 Foley、合成器 Pad、颗粒延迟",
          style: "风格：Ambient Pop / Game Audio Texture",
        },
      },
      {
        id: "wind-forward",
        title: "不回头的风",
        mood: "离开不是逃跑，是继续往前。",
        tags: ["现场感", "副歌", "重新出发"],
        note: "更适合现场版本的歌，副歌留出空间给观众共振。",
        duration: "04:01",
        audio: "",
        story:
          "它负责把 Journey 的情绪从自问推向行动。不是热血的喊口号，而是平静地承认：我还要继续。",
        lyrics: ["风从背后推我一下", "我没有回头", "那些说不出口的话", "终于变成了路"],
        production: {
          role: "词 / 曲 / 演唱：Sing",
          daw: "DAW：现场版编曲预留",
          sound: "声音设计：鼓组、合唱层、现场空间混响",
          style: "风格：Band Pop / Live Session",
        },
      },
      {
        id: "self-dialogue",
        title: "自我对峙",
        mood: "把沉默摊开，听见真正的自己。",
        tags: ["内省", "歌词", "慢燃"],
        note: "一首偏内省的作品，适合与创作日志一起阅读。",
        duration: "05:09",
        audio: "",
        story:
          "这首歌是一个人和自己的谈判。它不急着给答案，而是允许矛盾、迟疑和真实同时存在。",
        lyrics: ["我把沉默摊开", "看见另一个我站在对面", "他没有责怪", "只是问我还要不要往前"],
        production: {
          role: "词 / 曲：Sing",
          daw: "DAW：Piano Sketch 预留",
          sound: "声音设计：钢琴、低频 Drone、近距离人声",
          style: "风格：Minimal Ballad / Slow Burn",
        },
      },
    ],
    journeyBeats: [
      {
        step: "01 · 城市夜",
        songId: "walking",
        tone: "city",
        quote: "我们需要在有限的生命里，重新审视当下。",
        body: "第一屏不是解释，而是把人放进夜路、灯光、湿润的空气和一段还没有说完的旋律里。",
      },
      {
        step: "02 · 抵抗",
        songId: "reflecting-street",
        tone: "resist",
        quote: "梦想仍在顽固抵抗这座城市。",
        body: "工作、现实和稳定生活在不断推近，音乐则像一条不肯熄灭的线，慢慢穿过城市。",
      },
      {
        step: "03 · 凌晨",
        songId: "midnight-light",
        tone: "midnight",
        quote: "无数个凌晨。",
        body: "那些没有观众的时刻，决定了作品里最真实的部分：疲惫、怀疑、沉默和仍然继续。",
      },
      {
        step: "04 · 自问",
        songId: "self-dialogue",
        tone: "self",
        quote: "如今一切是你想要的吗？",
        body: "这不是页面文案，而是整个 Sing Music Space 的核心问题。音乐从这里开始有了重量。",
      },
      {
        step: "05 · 继续",
        songId: "wind-forward",
        tone: "forward",
        quote: "行走吧。",
        body: "人生没有边界，行走就是答案。结尾不是完成，而是把下一首歌、下一篇日志、下一段路打开。",
      },
    ],
    journals: [
      {
        date: "Walking Note 01",
        title: "把一首歌写成一段路",
        body: "从一句自我追问开始，把城市夜色拆成节奏、和声和呼吸。",
        tags: ["创作过程", "行走", "单曲"],
      },
      {
        date: "Walking Note 02",
        title: "游戏音频给我的叙事训练",
        body: "每个声音都需要解释空间、动作和情绪，这会成为 Sing 的专业差异。",
        tags: ["游戏音频", "声音设计", "制作"],
      },
      {
        date: "Walking Note 03",
        title: "不要把网站做成网盘",
        body: "每首作品都要有故事、歌词、制作信息和人生阶段，而不是只留下一个播放按钮。",
        tags: ["内容宇宙", "产品", "品牌"],
      },
    ],
    aboutTimeline: [
      {
        label: "起点",
        body: "初中、吉他、乐队，一个人开始用声音理解自己。",
      },
      {
        label: "对抗",
        body: "家人的反对、现实的压力，让音乐从爱好变成自我证明。",
      },
      {
        label: "行走",
        body: "城市、工作、驻唱和深夜，把生活不断写进歌里。",
      },
      {
        label: "现在",
        body: "独立音乐人，也带着游戏音频的项目经验继续创作。",
      },
    ],
    buildPhases: [
      {
        phase: "Phase 1",
        title: "情绪入口",
        body: "确定视觉气质、首页首屏、精选音乐和 Journey 叙事原型。",
      },
      {
        phase: "Phase 2",
        title: "音乐系统",
        body: "补齐播放器、单曲详情、歌词、创作故事和制作信息。",
      },
      {
        phase: "Phase 3",
        title: "内容宇宙",
        body: "接入日志、人生阶段、CMS、SEO 和持续运营节奏。",
      },
    ],
  };

  window.SING_CONTENT = Object.freeze(content);
})();
