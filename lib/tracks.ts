export interface Track {
  id: string
  title: string
  artist: string
  cover: string
  audioUrl: string
  duration: number
  genre: string
  year: string
  description?: string
  lyrics?: string
  bpm?: number
  key?: string
  tags?: string[]
}

export const allTracks: Track[] = [
  {
    id: '1',
    title: '夜行者',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    genre: '电子',
    year: '2024',
    description: '城市的脉搏在深夜跳动，霓虹与阴影交织的独行篇章。电子合成器与深沉贝斯构建出都市夜行的氛围，适合驾驶、独处或创作时聆听。',
    bpm: 128,
    key: 'C minor',
    tags: ['电子', '氛围', '夜行', '都市'],
  },
  {
    id: '2',
    title: '城市微光',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 285,
    genre: '氛围',
    year: '2024',
    description: '清晨五点，城市尚未苏醒，只有零星灯火像未眠的眼睛。钢琴与弦乐交织出温柔的唤醒序曲，适合冥想、阅读或作为工作背景音乐。',
    bpm: 85,
    key: 'F major',
    tags: ['氛围', '钢琴', '清晨', '治愈'],
  },
  {
    id: '3',
    title: '独白',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 198,
    genre: '独立',
    year: '2023',
    description: '一个人的内心戏，无需观众。原声吉他与呢喃人声编织的私密空间，适合独处、散步或深夜沉思时聆听。',
    bpm: 72,
    key: 'A minor',
    tags: ['独立', '民谣', '内省', '私密'],
  },
  {
    id: '4',
    title: '归途',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 324,
    genre: '电子',
    year: '2023',
    description: '无论走多远，总有一条路指向内心。渐进式电子结构与层次分明的合成器音色，从静谧到澎湃再回归平静的情绪旅程。',
    bpm: 110,
    key: 'G major',
    tags: ['电子', '渐进', '旅程', '情绪'],
  },
  {
    id: '5',
    title: '晨光',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 256,
    genre: '氛围',
    year: '2024',
    description: '第一缕阳光穿透窗帘的缝隙，新的一天从温柔中开始。氛围电子与自然采样融合，适合瑜伽、晨间routine或创意启动。',
    bpm: 90,
    key: 'D major',
    tags: ['氛围', '自然', '晨光', '启动'],
  },
  {
    id: '6',
    title: '边界',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 289,
    genre: '实验',
    year: '2023',
    description: '规则的边界之外，是无限的可能性。实验性音色设计与不规则节拍结构的探索，适合创意工作、艺术空间或突破思维定式时聆听。',
    bpm: 95,
    key: 'E minor',
    tags: ['实验', '不规则', '创意', '突破'],
  },
]

export function getTrackById(id: string): Track | undefined {
  return allTracks.find((track) => track.id === id)
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
