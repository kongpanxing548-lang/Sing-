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
    quote: '这世界慢慢变得那么恐惧，那么悲伤。',
    body: [
      'Journey 现在不再是示例叙事，而是真正从《行走》这首歌里长出来的一条路。',
      '它从城市、黑夜和失重感开始，也从“我还要不要继续往前走”这个问题开始。',
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
    id: 'city',
    slug: 'city',
    eyebrow: 'Chapter 01',
    title: '困在城市里',
    quote: '这座城市里，有没有你的理想。',
    body: [
      '《师傅，到市区多少钱》把漂泊写得很生活：一句问路，背后是整座城市里的理想、困顿和人潮汹涌。',
      '当霓虹和雨夜一层层压下来，音乐就成了继续辨认方向的方式。',
    ],
    trackId: 'how-much-downtown',
    palette: 'resist',
    align: 'left',
  },
  {
    id: 'struggle',
    slug: 'struggle',
    eyebrow: 'Chapter 02',
    title: '黑暗中的挣扎',
    quote: '你寻找的是否是你想要的。',
    body: [
      '有些歌不是为了讲故事，而是为了把疼痛和愤怒直接撕开。《黑暗中的挣扎》就是这样的一首。',
      '它像一次对自己的质问：绕了这么久，回到原点以后，灵魂是不是还被困在原地。',
    ],
    trackId: 'dark-struggle',
    palette: 'midnight',
    align: 'center',
  },
  {
    id: 'memory',
    slug: 'memory',
    eyebrow: 'Chapter 03',
    title: '时间里的故事',
    quote: '生活给了你许多悲伤，却依然充满着希望。',
    body: [
      '不是所有作品都来自爆裂的情绪，有些歌更像回头看见生活留下的痕迹。',
      '《时间里的故事》把快乐、遗憾、无奈和惊喜都放在同一首歌里，像一段正在慢慢沉淀的回忆。',
    ],
    trackId: 'stories-in-time',
    palette: 'self',
    align: 'center',
  },
  {
    id: 'light',
    slug: 'light',
    eyebrow: 'Chapter 04',
    title: '看见内心的光',
    quote: '在你的心里闪耀着的光芒。',
    body: [
      '经历过慌张、远行和失落之后，真正重要的不是把伤口掩住，而是承认心里仍有光。',
      '《内心的光芒》把这个阶段唱得很温柔：不是喊口号，而是告诉你还没有熄灭。',
    ],
    trackId: 'inner-light',
    palette: 'city',
    align: 'center',
  },
  {
    id: 'return',
    slug: 'return',
    eyebrow: 'Chapter 05',
    title: '回归自己',
    quote: '九月的每个地方，回归以往的阳光。',
    body: [
      'Journey 的结尾不想停在绝望里，而是停在“重新回到自己”这一步。',
      '《回归》像一次慢慢抽身：把痛苦和虚伪留在身后，再试着走回还愿意相信的地方。',
    ],
    trackId: 'return',
    palette: 'forward',
    align: 'center',
    cta: {
      label: '继续听真实歌单',
      href: '/music',
    },
  },
]
