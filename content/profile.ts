export interface Profile {
  stageName: string
  realName: string
  location: string
  oneLiner: string
  intro: string
  timeline: {
    year?: string
    title: string
    description: string
  }[]
  roles: string[]
  links: {
    email?: string
    netease?: string
    qqMusic?: string
    bilibili?: string
    weibo?: string
  }
}

export const profile: Profile = {
  stageName: 'Sing',
  realName: 'Sing',
  location: '中国',
  oneLiner: '独立音乐人 / 制作人 / 游戏音频设计',
  intro: 'Sing 是一位独立音乐人，专注于电子音乐与氛围音乐的创作。他的作品融合了城市的声音景观与内心的情感流动，用音乐记录行走中的思考与感悟。从深夜的街头到黎明的海边，每一段旋律都是一次灵魂的独白。',
  timeline: [
    {
      year: '2024',
      title: '《行走》EP 发行',
      description: '首张个人 EP，记录城市夜行中的思考与感悟',
    },
    {
      title: '持续创作中',
      description: '探索更多音乐可能性，用声音讲述更多故事',
    },
  ],
  roles: ['独立音乐人', '制作人 / 编曲', '游戏音频设计'],
  links: {
    email: 'sing@example.com',
  },
}
