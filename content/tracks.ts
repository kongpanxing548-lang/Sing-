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

const defaultCover = '/images/covers/default-cover.jpg'

export const tracks: Track[] = [
  {
    id: 'walking',
    slug: 'walking',
    title: '行走',
    artist: 'Sing',
    releaseDate: '2018',
    cover: '/images/covers/walking.jpg',
    audioUrl: '/audio/walking.mp3',
    duration: 272,
    moodTag: '在恐惧、黑夜与现实里继续往前走',
    genre: ['独立摇滚', '城市叙事', '现场感'],
    featured: true,
    note: '这首歌像整个网站的起点，也像 Sing 对自己的一次凝视与发问。',
    lyrics:
      '这是哪里啊 我曾经看见你\n这世界 慢慢变得 那么恐惧 那么悲伤\n这世界 慢慢的离我越来越遥远\n那些你的脸上 那些你的悲伤 那些微不足道的眼光\n握着你的手 走在路上 那么坚强\nHu hu hu hu hu\n这是哪 这是哪\n我曾经看见 这世界变了\n那么恐惧 那么悲伤 这世界与我越来越遥远\nRap：\n我 努力挥舞着双手 想要看清你 但黑夜就像紧箍\n让我无法反抗 无力的再挣脱 挣脱\n不 不要在我坚定之后 yo 抹去我的轨迹\n也许 也许 在那遥远的未来 我会找那不一样的精彩\nIf I go away\nIf I go away\nIf I go away\nIf I go away',
    excerpt: '恐惧、悲伤和不肯被抹去的轨迹，一起构成了《行走》最核心的力量。',
    story: {
      background: '写在城市压迫感越来越强的阶段，像是对现实、关系和自我状态的同时发问。',
      trigger: '“这世界慢慢变得那么恐惧、那么悲伤”这句感受，直接点燃了整首歌的气质。',
      expression: '前半段是压迫感，后半段是挣脱与坚持，最后落到“继续走”的意志上。',
    },
    credits: {
      compose: '邢孔攀（Sing）/ 邢孔俊',
      arrange: '邢孔攀（Sing）',
      mix: '时俊峰',
      master: '时俊峰',
      daw: 'Pro Tools',
    },
  },
  {
    id: 'how-much-downtown',
    slug: 'how-much-downtown',
    title: '师傅，到市区多少钱',
    artist: 'Sing',
    releaseDate: '2018',
    cover: '/images/covers/how-much-downtown.jpg',
    audioUrl: '/audio/how-much-downtown.mp3',
    duration: 250,
    moodTag: '困在城市里的青春、理想与霓虹路口',
    genre: ['城市民谣', '现实叙事', '独立流行'],
    featured: true,
    note: '标题很生活，但歌里写的是一整代人在城市里漂浮、寻找出口的状态。',
    lyrics:
      '这城市里，那些匆忙的人们\n每天都为谁，在坚强活着\n那个夏天，南方的雨天\n那些被淋湿的发烫的青春\n我被困在这座不眠的城市\n听见每天，每天都有人哭泣\n\n这座城市里 ，你的青春里\n就像鱼儿不知道天空有多远\n你的城市里 ，你的天空里\n就像鸟儿失去了它的翅膀\n我被困在原地，我被困在原地\n我被困在这座城市里，\n\n我走在这城市，每个霓虹的路口\n每一个纯洁的理想，每一次慌张和不堪\n我只能坚强的走在，寻找我该去的地方\n我穿过了人潮汹涌，翻越了山丘',
    excerpt: '一句“师傅，到市区多少钱”，把漂泊、困顿、理想和青春都装进了这座不眠城市。',
    story: {
      background: '这首歌从现实生活的一个瞬间切入，最后却写到了整座城市里的年轻人处境。',
      trigger: '南方雨天、霓虹路口、人潮汹涌，这些生活细节让歌从一句问路变成一次自我盘问。',
      expression: '不是抱怨城市，而是在城市里承认脆弱、继续寻找方向。',
    },
    credits: {
      compose: '邢孔攀（Sing）',
      arrange: '邢孔攀（Sing）',
      mix: '邢孔攀',
      daw: '声扬动力录音室',
    },
  },
  {
    id: 'empty',
    slug: 'empty',
    title: '空',
    artist: 'Sing',
    releaseDate: '2019',
    cover: '/images/covers/empty.jpg',
    audioUrl: '/audio/empty.mp3',
    duration: 384,
    moodTag: '凌晨、酒杯、沙发与回到儿时的空幻旅行',
    genre: ['氛围音乐', '自省', '慢叙事'],
    featured: true,
    note: '“每一个凌晨都是一次儿时的远离”，这句像整首歌的门。',
    excerpt: '一天劳累之后，一张沙发、一杯红酒、一段音乐，把人带回儿时记忆和远去的自己。',
    story: {
      background: '更像一次深夜状态记录，不急着给答案，而是让听者停留在空白与回忆里。',
      trigger: '凌晨独处时那种似醒非醒的漂浮感，像穿越，也像回到一个旧自己身边。',
      expression: '这首歌不是强烈叙事，而是用氛围把“空”本身变成可被进入的空间。',
    },
  },
  {
    id: 'rain-silent-hurt',
    slug: 'rain-silent-hurt',
    title: '雨静.伤',
    artist: 'Sing',
    releaseDate: '2019',
    cover: '/images/covers/rain-silent-hurt.jpg',
    audioUrl: '/audio/rain-silent-hurt.mp3',
    duration: 210,
    moodTag: '古风意象里的相思、月光与苍茫遗憾',
    genre: ['古风', '抒情', '独立创作'],
    featured: true,
    note: '相比城市叙事，这首歌更像一幅被月光照亮的情绪画卷。',
    lyrics:
      '人生短 我亦心感伤\n爱恨晚 我独自心伤\n淌泪光 奈何于纠缠\n嘘无常 淡然的欣赏\n仰明月 悲喜一壶酒\n叹一世 浮华尽不归\n花非花 如烟云声叹\n雨霏雨 飘飘缭绕\n\n那么多的悲伤\n那么多人都一样\n那么多的泪光\n那么多人都心伤\n相遇的时光\n你我眼中黯神伤\n静侯的月光\n相思落泪俩相望',
    excerpt: '在古风意象里写相思与心伤，月光、泪光和岁月一起落在歌里。',
    story: {
      background: '这首歌把 Sing 更东方、更含蓄的一面拿出来，气质和其他城市歌明显不同。',
      trigger: '月光、酒意、相望而不能抵达的距离，构成了这首歌的核心画面。',
      expression: '不是直白诉苦，而是让伤感像雨一样慢慢落下来。',
    },
    credits: {
      compose: '邢孔攀（Sing）',
      arrange: '邢孔攀（Sing）',
      mix: '邢孔攀',
      daw: '声扬动力录音室',
    },
  },
  {
    id: 'stories-in-time',
    slug: 'stories-in-time',
    title: '时间里的故事',
    artist: 'Sing',
    releaseDate: '2017',
    cover: '/images/covers/stories-in-time.jpg',
    audioUrl: '/audio/stories-in-time.mp3',
    duration: 224,
    moodTag: '时间带走悲伤，也留下惊喜与回忆',
    genre: ['抒情流行', '时间主题', '成长叙事'],
    featured: false,
    note: '这首歌先有创作思路，再长成完整作品，像一篇写给时光的记录。',
    lyrics:
      '忽然间发现时间渐渐远去\n那么多的快乐\n那么多的美丽\n没有惊心动魄\n没有生死相依\n简简单单就这样变成回忆\n\n生活给了你许多悲伤\n总有无数的惊喜\n她一转眼在身边，那迷人的笑脸\n生活给了你许多无奈\n却依然充满着希望\n思念被一转眼留在了这时光里',
    excerpt: '没有惊心动魄，也没有生死相依，生活最后却把许多回忆悄悄沉淀成故事。',
    story: {
      background: '创作思路本身就在写时间流逝、快乐与无奈共存的日常人生。',
      trigger: '“忽然间发现时间渐渐远去”像一个开关，所有回忆和情绪一起涌出来。',
      expression: '想把那些并不轰烈、却真正打动人的生命瞬间留下来。',
    },
    credits: {
      compose: 'Caca / Sing',
      arrange: '乐喜音乐',
      daw: '2017 单曲版本',
    },
  },
  {
    id: 'best-time',
    slug: 'best-time',
    title: '最美的时光',
    artist: 'Sing',
    releaseDate: '2017',
    cover: '/images/covers/best-time.jpg',
    audioUrl: '/audio/best-time.mp3',
    duration: 238,
    moodTag: '旅行、日出、屋顶和多年后仍发光的回忆',
    genre: ['旅行民谣', '抒情', '回忆'],
    featured: false,
    note: '有明确地点感和画面感，像一首写给旅途、也写给旧时光的歌。',
    lyrics:
      '在一次美好的旅行中\n在这座最高的城市里\n我会牵着你的手经过\n那一条条悠长的巷子口\n\n爬过屋顶等待着日出\n去留住每一次的感动\n我们穿过一座座高山\n只为旅途最美的风景\n\n那些欢乐美好的时光\n那些曾经悲伤的泪水\n那些阳光明媚的早晨\n那样灿烂美好的一天',
    excerpt: '旅行带来的不只是风景，而是很多年后回头看仍会发光的那段时光。',
    story: {
      background: '明显带着旅行记忆，地点、屋顶、日出和旧客栈都像真实存在过。',
      trigger: '许多年后重新回到同一个地方，过去的感动和失落一起被重新唤醒。',
      expression: '写“最美的时光”，其实也是在写已经过去却仍不愿放下的东西。',
    },
  },
  {
    id: 'if',
    slug: 'if',
    title: '如果',
    artist: 'Sing',
    releaseDate: '2019',
    cover: '/images/covers/if.jpg',
    audioUrl: '/audio/if.mp3',
    duration: 206,
    moodTag: '甜蜜、刚刚好与愿意陪你到老的轻盈告白',
    genre: ['流行', '情歌', '轻快'],
    featured: false,
    note: '曲风更轻，更靠近“刚刚好”的温暖关系感。',
    lyrics:
      '如果 如果\n如果心情会说话\n它会告诉我\n扑通 扑通 我在想她\n如果 如果\n如果时光会唱歌\n它会告诉我\n滴答 滴答 我很爱他\n\n我喜欢看你甜甜的微笑\n我喜欢看你小小的骄傲\n如果我已无可救药\n你是否愿意陪我到老',
    excerpt: '没有复杂修辞，直接把“喜欢你”和“陪你到老”唱成了一首明亮的歌。',
    story: {
      background: '这首歌明显更靠近日常情感，不是挣扎与城市，而是彼此依靠的轻松时刻。',
      trigger: '“如果心情会说话”“如果时光会唱歌”这些句子，把心动感直接写了出来。',
      expression: '用一种不费力的方式去唱爱情里最简单、也最珍贵的确认。',
    },
    credits: {
      compose: 'Sing / Caca',
      arrange: 'Sing',
      mix: 'Sing',
      daw: '吉他编写版',
    },
  },
  {
    id: 'mama-dont-cry',
    slug: 'mama-dont-cry',
    title: '妈妈别哭',
    artist: 'Sing',
    releaseDate: '2018',
    cover: '/images/covers/mama-dont-cry.jpg',
    audioUrl: '/audio/mama-dont-cry.mp3',
    duration: 281,
    moodTag: '写给母亲的平凡、伟大与不愿再让她受伤',
    genre: ['亲情', '抒情', '独立创作'],
    featured: false,
    note: '这是最直接、最私人也最真诚的一首歌之一。',
    lyrics:
      '妈妈 曾经掉下的眼泪\n妈妈 那么多的痛与悲伤\n承受着岁月的沧桑与枯萎\n等待着命运的眷恋与呼喊\n\n妈妈 你像大地一样拥抱着我\n妈妈 我会坚强的活着直到你笑了\n\nfollow me don’t you cry\n你的样子 you don’t cry',
    excerpt: '不是宏大叙事，而是把想对母亲说的话，一句一句地唱给她听。',
    story: {
      background: '文档里就写得很直接：这是送给妈妈的歌，写给一位平凡而伟大的母亲。',
      trigger: '面对母亲承受过的痛与泪，想把“别哭”和“我会坚强”唱成真正能抵达她的话。',
      expression: '既有柔软也有力量，是站在母亲身后说“你不用再一个人扛”的歌。',
    },
    credits: {
      compose: '邢孔攀（Sing）',
      arrange: '邢孔攀（Sing）',
      mix: '邢孔攀',
      daw: '声扬动力录音室',
    },
  },
  {
    id: 'return',
    slug: 'return',
    title: '回归',
    artist: 'Sing',
    releaseDate: '2018-05',
    cover: '/images/covers/return.jpg',
    audioUrl: '/audio/return.mp3',
    duration: 301,
    moodTag: '城市忧伤、理想被遗忘后重新回到自己',
    genre: ['独立摇滚', '城市感', '复归'],
    featured: false,
    note: '这首歌更像一次从混乱里抽身，重新看见自己和理想的过程。',
    lyrics:
      '在一瞬间的忧伤里不经意的恐慌\n我站在这座城市的路上\n生活是一次狂妄幻想，没有力量的灵魂叫喊\n消失在慌乱的城市，不复存在\n\n九月的每个地方，回归以往的阳光\n曾经执着理想，被遗忘\n\n我要离开这里 痛苦虚伪的东西\n会慢慢慢慢的消失在这里',
    excerpt: '忧伤、城市、理想和离开，一起把“回归”写成了从混乱中返回自己的动作。',
    story: {
      background: '明显写在一段理想被现实消磨、但仍不愿彻底放弃的时期。',
      trigger: '“九月的每个地方，回归以往的阳光”这句很像整首歌的精神支点。',
      expression: '不是回到过去，而是经过失落之后，重新回到仍想相信的自己。',
    },
    credits: {
      compose: 'Sing',
      arrange: '邢孔攀（Sing）',
      mix: '时俊峰',
      master: '时俊峰',
      daw: 'Pro Tools',
    },
  },
  {
    id: 'inner-light',
    slug: 'inner-light',
    title: '内心的光芒',
    artist: 'Sing',
    releaseDate: '2018',
    cover: '/images/covers/inner-light.jpg',
    audioUrl: '/audio/inner-light.mp3',
    duration: 230,
    moodTag: '在悲伤、慌张和远行之后，仍在心里闪耀的光',
    genre: ['抒情摇滚', '治愈', '成长'],
    featured: false,
    note: '它更像在告诉一个正在沉默的人：你心里还有光，还没熄灭。',
    lyrics:
      '在一样的城市里\n那应该拥挤的人群\n我想你应该会沉默\n那冷笑嘈杂的眼睛\n那些悲伤 那些慌张\n她已远行\n也许沧桑 也许迷惘\n\n看 那么多的隐藏\n在你的心里闪耀着的光芒\n他已拥有 生命中的坚强',
    excerpt: '这首歌不是喊口号，它更温柔：即使悲伤、慌张、迷惘，也别忘了心里还亮着光。',
    story: {
      background: '城市、人群、沉默和远行，让这首歌天然带着一层现实的冷色。',
      trigger: '真正触发它的不是戏剧事件，而是日常中那些压抑、被忽略、又说不出口的情绪。',
      expression: '想给听的人一个很具体的安慰：你没有彻底失去，你心里还有光。',
    },
    credits: {
      compose: '邢孔攀（Sing）',
      arrange: '邢孔攀（Sing）',
      mix: '邢孔攀',
      daw: '声扬动力录音室',
    },
  },
  {
    id: 'hear-sorrow',
    slug: 'hear-sorrow',
    title: '听见悲伤',
    artist: 'Sing',
    releaseDate: '2018',
    cover: '/images/covers/hear-sorrow.jpg',
    audioUrl: '/audio/hear-sorrow.mp3',
    duration: 255,
    moodTag: '在雨声、等待与回忆里听见自己心里的伤',
    genre: ['抒情流行', '雨夜', '回忆'],
    featured: false,
    note: '歌里有很强的时间感：滴答、雨声、没有消息、最后一次见面。',
    lyrics:
      '滴答 滴答滴\n你的歌曲，听了一遍又一遍\n滴答 滴答答\n你的信息，看了一遍又一遍\n滴答 滴答滴\n窗外面的雨水，缓缓落下\n滴答 滴答答\n时间整整一天，没你的消息\n\n我听见悲伤 那心里的平凡\n那一路的风景在我心里\n我听见悲伤 那深邃的星空\n穿越了现实在你我生命中',
    excerpt: '时间像雨一样往下落，最后落进心里，变成这首《听见悲伤》。',
    story: {
      background: '失去联系后的等待、最后一次相见的泪滴、旅途中的温暖，都被留在歌里。',
      trigger: '“滴答”这个节奏不是修辞，而是整首歌最真实的情绪脉搏。',
      expression: '把悲伤唱出来，不是为了沉溺，而是为了让那段记忆真正被听见。',
    },
    credits: {
      compose: 'Caca / Sing',
      arrange: 'Sing',
      daw: '旅途叙事版本',
    },
  },
  {
    id: 'you-are-beautiful',
    slug: 'you-are-beautiful',
    title: 'You are beautiful',
    artist: 'Sing',
    releaseDate: '2017-12',
    cover: '/images/covers/you-are-beautiful.jpg',
    audioUrl: '/audio/you-are-beautiful.mp3',
    duration: 245,
    moodTag: '北方晚风、城市灯火与温柔圣诞夜',
    genre: ['英文流行', '冬日氛围', '抒情'],
    featured: false,
    note: '一首冬天感很强的歌，既有中文叙事，也有非常直接的英文副歌。',
    lyrics:
      '这风里如刀 这岁月如歌\n这思念是爱 再不见人来\n踏上这趟列车 我满怀期待\n这时间流淌 我无法挣扎\n\n北方的晚风 轻轻吹过眼下的天空\n吹过城市的灯火 吹到我的脸庞\n请你带走我的思念 去到一个温暖的地方\n这美景如她 她美丽如画\n\nit’s beautiful you are beautiful\nMerry Christmas Merry Christmas',
    excerpt: '晚风、列车、灯火和 “you are beautiful”，让这首歌天然带着冬天和远方的气息。',
    story: {
      background: '比起其他歌的城市压迫感，这首更温暖，也更像一封写给远方与思念的信。',
      trigger: '北方晚风和城市灯火构成了非常清晰的季节感，像一幅冬夜画面。',
      expression: '想把思念写得不苦，而是写成一种仍然愿意相信美的情绪。',
    },
    credits: {
      compose: '邢孔攀（Sing）',
      arrange: '邢孔攀（Sing）',
      mix: '梁冬盛',
      daw: 'Pro Tools',
    },
  },
  {
    id: 'dark-struggle',
    slug: 'dark-struggle',
    title: '黑暗中的挣扎',
    artist: 'Sing',
    releaseDate: '2018',
    cover: '/images/covers/dark-struggle.jpg',
    audioUrl: '/audio/dark-struggle.mp3',
    duration: 286,
    moodTag: '痛苦、困境、怒火与从黑暗里挣脱的呼喊',
    genre: ['另类摇滚', '情绪爆发', '独立创作'],
    featured: false,
    note: '这是歌单里最锋利、最直接的一首之一，几乎没有保留。',
    lyrics:
      '你寻找的是否是你想要的\n我们都花了太多时间\n你兜兜转转 又回到了原点\n才发现自己灵魂早已被困住\n\n黑暗中我不能自拔\n我不想再这样下去\n我需要走出这困境\n穿过你灵魂的骨头\n\n我不要 不要这样\n滚 滚 滚\nDon’t cry\n我需要你的灵魂救赎',
    excerpt: '这首歌像一场撕开表面的自我拷问，黑暗、愤怒和求救都被直接喊了出来。',
    story: {
      background: '它显然写在非常痛苦、很想摆脱困境的阶段，几乎每一段都带着逼仄感。',
      trigger: '“你寻找的是否是你想要的”像是对自己发出的第一击。',
      expression: '不是优雅地表达脆弱，而是把挣扎、愤怒、求救全部摊开。',
    },
    credits: {
      compose: '邢孔攀（Sing）',
      arrange: '邢孔攀（Sing）',
      mix: '邢孔攀',
      daw: '声扬动力录音室',
    },
  },
]

export const featuredTracks = tracks.filter((track) => track.featured)
export const getTrackBySlug = (slug: string) => tracks.find((track) => track.slug === slug)
