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
    id: '1',
    slug: 'walking',
    title: '行走',
    artist: 'Sing',
    releaseDate: '2024-01',
    cover: '/images/covers/walking.jpg',
    audioUrl: '/audio/walking.mp3',
    duration: 372,
    moodTag: '深夜城市中的自我对话',
    genre: ['独立音乐', '电子'],
    featured: true,
    excerpt: '生命是一场行走，每一步都留下音符的印记。',
    story: {
      background: '创作于无数个凌晨回家的夜路',
      trigger: '路灯下的影子被拉得很长',
      expression: '用脚步声作为节奏，用城市噪音作为和声',
    },
  },
  {
    id: '2',
    slug: 'night-walker',
    title: '夜行者',
    artist: 'Sing',
    releaseDate: '2024-03',
    cover: '/images/covers/night-walker.jpg',
    audioUrl: '/audio/night-walker.mp3',
    duration: 285,
    moodTag: '在黑暗中寻找光的方向',
    genre: ['独立音乐', '氛围'],
    featured: true,
    excerpt: '当城市入睡，真正的旅程才开始。',
  },
  {
    id: '3',
    slug: 'city-glow',
    title: '城市微光',
    artist: 'Sing',
    releaseDate: '2024-05',
    cover: '/images/covers/city-glow.jpg',
    audioUrl: '/audio/city-glow.mp3',
    duration: 198,
    moodTag: '繁华背后的温柔角落',
    genre: ['独立音乐', '流行'],
    featured: true,
    excerpt: '每一盏灯下都有一个故事。',
  },
  {
    id: '4',
    slug: 'monologue',
    title: '独白',
    artist: 'Sing',
    releaseDate: '2024-06',
    cover: '/images/covers/monologue.jpg',
    audioUrl: '/audio/monologue.mp3',
    duration: 245,
    moodTag: '说给夜晚听的话',
    genre: ['独立音乐', '民谣'],
    featured: false,
    excerpt: '有些话，只能说给自己听。',
  },
]

export const featuredTracks = tracks.filter(t => t.featured)
export const getTrackBySlug = (slug: string) => tracks.find(t => t.slug === slug)
