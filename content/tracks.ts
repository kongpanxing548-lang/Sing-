export interface Track {
  id: string
  slug: string
  title: string
  artist: string
  releaseDate: string
  cover: string
  audioUrl: string
  duration: number
  moodTag: string
  genre: string[]
  featured: boolean
  lyrics?: string
  note?: string
  excerpt: string
  story?: {
    background: string
    trigger: string
    expression: string
  }
  credits?: {
    compose?: string
    arrange?: string
    mix?: string
    master?: string
    daw?: string
  }
}

export const tracks: Track[] = [
  {
    id: 'walking',
    slug: 'walking',
    title: '行走',
    artist: 'Sing',
    releaseDate: '2024-01',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=800&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 258,
    moodTag: '在城市与自我之间迷失，又重新出发',
    genre: ['独立流行', '电影感叙事'],
    featured: true,
    note: '主题曲。保留呼吸感和留白，让声音先于解释抵达。',
    lyrics: '生命，是一场行走\n但也是一次反思\n在城市的反光里\n我听见另一个自己',
    excerpt: '不是成功故事，而是关于现实压近时，音乐还能不能保留真实自我的追问。',
    story: {
      background: '创作于无数个凌晨回家的夜路。',
      trigger: '路灯下的影子被拉得很长，城市像一段没有写完的和声。',
      expression: '用脚步声作为节奏，用城市噪音作为情绪底色。',
    },
    credits: {
      compose: 'Sing',
      arrange: 'Sing',
      daw: 'Logic / Ableton 预留',
    },
  },
  {
    id: 'midnight-light',
    slug: 'midnight-light',
    title: '凌晨路灯',
    artist: 'Sing',
    releaseDate: '2024-03',
    cover: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=800&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 222,
    moodTag: '孤独不是答案，但它能照见答案',
    genre: ['Acoustic', 'Slow Pop'],
    featured: true,
    note: '偏抒情的夜行单曲，适合承接叙事页的低潮段落。',
    lyrics: '凌晨的路灯没有回答\n只是陪我慢慢走完\n风从身后经过\n像一段没有寄出的和声',
    excerpt: '一首写给凌晨的歌，让疲惫、犹豫和一点点不甘有地方停靠。',
    story: {
      background: '来自没有观众的练习、回家路和安静到刺耳的深夜。',
      trigger: '凌晨路灯下的空白，像给旋律留出的一段呼吸。',
      expression: '干净吉他、远处车流和轻微磁带噪声组成低速叙事。',
    },
  },
  {
    id: 'reflecting-street',
    slug: 'reflecting-street',
    title: '反光的街',
    artist: 'Sing',
    releaseDate: '2024-05',
    cover: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=800&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 236,
    moodTag: '把现实的冷意，写成一束微弱的光',
    genre: ['Ambient Pop', 'Game Audio Texture'],
    featured: true,
    note: '连接独立音乐与游戏音频背景，用环境声做情绪底色。',
    lyrics: '反光的街像一条河\n我从现实的边缘经过\n每一步都很轻\n却没有停止',
    excerpt: '街面反光、雨后空气、脚步和电流声一起组成一个可以进入的城市空间。',
    story: {
      background: '写给现实压力不断推近、但内心仍不愿熄灭的阶段。',
      trigger: '雨后街面把灯光拆成碎片，像被拆开的生活。',
      expression: '城市 Foley、合成器 Pad 和颗粒延迟构成可漫游的声场。',
    },
  },
  {
    id: 'self-dialogue',
    slug: 'self-dialogue',
    title: '自我对峙',
    artist: 'Sing',
    releaseDate: '2024-06',
    cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=800&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 309,
    moodTag: '把沉默摊开，听见真正的自己',
    genre: ['Minimal Ballad', 'Slow Burn'],
    featured: false,
    note: '一首偏内省的作品，适合与创作日志一起阅读。',
    lyrics: '我把沉默摊开\n看见另一个我站在对面\n他没有责怪\n只是问我还要不要往前',
    excerpt: '一个人和自己的谈判，不急着给答案，而是允许矛盾、迟疑和真实同时存在。',
    story: {
      background: '来自“如今一切是你想要的吗？”这个无法轻易跳过的问题。',
      trigger: '沉默变成镜子，照见真正想追求的生活状态。',
      expression: '钢琴、低频 Drone 和近距离人声让问题保持重量。',
    },
  },
  {
    id: 'wind-forward',
    slug: 'wind-forward',
    title: '不回头的风',
    artist: 'Sing',
    releaseDate: '2024-08',
    cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=800&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 241,
    moodTag: '离开不是逃跑，是继续往前',
    genre: ['Band Pop', 'Live Session'],
    featured: false,
    note: '更适合现场版本的歌，副歌留出空间给观众共振。',
    lyrics: '风从背后推我一下\n我没有回头\n那些说不出口的话\n终于变成了路',
    excerpt: '把 Journey 的情绪从自问推向行动：平静地承认，我还要继续。',
    story: {
      background: '写在重新出发之前，像给下一段路开的门。',
      trigger: '不是热血喊口号，而是走出去之后才出现的轻盈。',
      expression: '鼓组、合唱层和现场空间混响保留继续向前的身体感。',
    },
  },
]

export const featuredTracks = tracks.filter(t => t.featured)
export const getTrackBySlug = (slug: string) => tracks.find(t => t.slug === slug)
