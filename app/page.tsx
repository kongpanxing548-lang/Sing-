import Link from 'next/link'
import { Music, Disc, User, ArrowRight } from 'lucide-react'
import { PlayButton } from '@/components/PlayButton'
import { WaveBackground } from '@/components/WaveBackground'

// 示例音乐数据 - 实际应从 Notion 或 API 获取
const featuredTracks = [
  {
    id: '1',
    title: '夜行者',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: '2',
    title: '城市微光',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 285,
  },
  {
    id: '3',
    title: '独白',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 198,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] overflow-x-hidden">
      {/* Hero Section - 重新设计的视觉背景 */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* 动态渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a2e] to-[#16213e]" />
        
        {/* 金色光晕效果 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E6B800]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#E6B800]/10 rounded-full blur-[100px]" />
        
        {/* 波形背景装饰 */}
        <WaveBackground />
        
        {/* 网格纹理叠加 */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(230, 184, 0, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(230, 184, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
          {/* 主标题区域 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-[#E6B800]" />
              <span className="text-[#E6B800] text-sm tracking-[0.3em] uppercase font-medium">
                Music Platform
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-6">
              行走
              <span className="text-[#E6B800] font-extralight"> WALKING</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide max-w-2xl leading-relaxed">
              A Journey of Sound & Self
            </p>
          </div>
          
          {/* 副标题与描述 */}
          <div className="max-w-xl mb-12">
            <p className="text-white/50 text-lg leading-relaxed mb-6">
              生命，是一场行走。每一步都留下音符的印记，每一段旋律都是灵魂的独白。
            </p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2">
                <Disc className="w-4 h-4" />
                12 首原创作品
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Sing 个人音乐展示
              </span>
            </div>
          </div>
          
          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/music"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#E6B800] text-[#0B0B0B] rounded-none font-medium hover:bg-[#E6B800]/90 transition-all duration-300"
            >
              <Music className="w-5 h-5" />
              探索音乐
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/journey"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white rounded-none font-medium hover:bg-white/5 hover:border-white/40 transition-all duration-300"
            >
              开始旅程
            </Link>
          </div>
        </div>
        
        {/* 底部滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>
      
      {/* 精选作品区域 */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#E6B800] text-sm tracking-[0.3em] uppercase font-medium mb-2 block">
                Featured
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-white">
                精选作品
              </h2>
            </div>
            <Link 
              href="/music" 
              className="text-white/50 hover:text-[#E6B800] transition-colors text-sm flex items-center gap-2"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* 作品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTracks.map((track) => (
              <div 
                key={track.id}
                className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-500"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayButton track={track} size="lg" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1">{track.title}</h3>
                  <p className="text-white/50 text-sm">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
