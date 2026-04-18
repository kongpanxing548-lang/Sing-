import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'

export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="pt-32 pb-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-16 h-16 text-[#E6B800] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            旅程页面
          </h1>
          <p className="text-xl text-white/60 mb-8">
            正在构建中...
          </p>
          <p className="text-white/40 max-w-xl mx-auto">
            Journey 页面将展示音乐创作的历程、幕后故事和创作日志。敬请期待。
          </p>
        </div>
      </div>
    </main>
  )
}
