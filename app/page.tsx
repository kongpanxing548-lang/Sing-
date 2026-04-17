import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/videos/city-night-walk.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/50 via-[#0B0B0B]/30 to-[#0B0B0B]" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            行走
            <span className="text-[#E6B800]"> WALKING</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide mb-4">
            A Journey of Sound & Self
          </p>
          <p className="text-white/60 max-w-2xl mx-auto mb-12">
            生命，是一场行走
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/journey"
              className="px-8 py-3 bg-[#E6B800] text-[#0B0B0B] rounded-sm font-medium hover:bg-[#E6B800]/90 transition"
            >
              开始旅程
            </Link>
            <Link
              href="/music"
              className="px-8 py-3 border border-white/30 text-white rounded-sm font-medium hover:bg-white/10 transition"
            >
              探索音乐
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
