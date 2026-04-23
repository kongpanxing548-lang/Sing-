export interface JourneyChapter {
  id: string
  slug: string
  eyebrow: string
  title: string
  quote?: string
  body: string[]
  trackId?: string
  backgroundImage?: string
  backgroundVideo?: string
  palette?: 'city' | 'resist' | 'midnight' | 'self' | 'forward'
  align?: 'left' | 'center' | 'right'
  cta?: {
    label: string
    href: string
  }
}

export const journeyChapters: JourneyChapter[] = [
  {
    id: 'intro',
    slug: 'intro',
    eyebrow: 'Chapter 00',
    title: '行走',
    quote: '一段关于声音与自我的旅程',
    body: [
      '在这个城市的深夜里，音乐不是背景，而是唯一的光。',
      '每一次脚步落地，都是一次与自我的对话。',
    ],
    trackId: 'walking',
    palette: 'city',
    align: 'center',
    cta: {
      label: '播放《行走》',
      href: '/music/walking',
    },
  },
  {
    id: 'chapter-1',
    slug: 'reexamine',
    eyebrow: 'Chapter 01',
    title: '重新审视当下',
    body: [
      '我们需要在有限的生命里，重新审视当下。',
      '那些被我们忽略的日常，或许正是生命最真实的模样。',
    ],
    trackId: 'walking',
    palette: 'city',
    align: 'center',
  },
  {
    id: 'chapter-2',
    slug: 'dream-vs-reality',
    eyebrow: 'Chapter 02',
    title: '梦想对抗现实',
    body: [
      '当梦想仍在顽固抵抗着这座城市，而麻木的工作仍在日常的撕咬着。',
      '我们在夹缝中寻找呼吸的空间，在喧嚣中守护内心的宁静。',
    ],
    trackId: 'reflecting-street',
    palette: 'resist',
    align: 'left',
  },
  {
    id: 'chapter-3',
    slug: 'night-city',
    eyebrow: 'Chapter 03',
    title: '深夜城市与行走',
    body: [
      '无数个凌晨，拖着疲惫的身躯走在沉睡的街道。',
      '路灯把影子拉得很长，仿佛要把所有的疲惫都投射到地面上。',
      '但正是在这些时刻，音乐成为了最好的陪伴。',
    ],
    trackId: 'midnight-light',
    palette: 'midnight',
    align: 'center',
  },
  {
    id: 'chapter-4',
    slug: 'self-questioning',
    eyebrow: 'Chapter 04',
    title: '自我拷问',
    body: [
      '如今一切是你想要的吗？',
      '究竟内心追求的是什么？',
      '理想的生活状态又是怎样的？',
    ],
    trackId: 'self-dialogue',
    palette: 'self',
    align: 'center',
  },
  {
    id: 'chapter-5',
    slug: 'walk-on',
    eyebrow: 'Chapter 05',
    title: '行走吧',
    body: [
      '行走吧，不要错过本该属于你的生命。',
      '每一步都是新的开始，每一段旋律都是灵魂的独白。',
    ],
    trackId: 'wind-forward',
    palette: 'forward',
    align: 'center',
    cta: {
      label: '去听《行走》',
      href: '/music/walking',
    },
  },
]
