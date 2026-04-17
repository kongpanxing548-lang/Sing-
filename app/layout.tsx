import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GlobalPlayer } from '@/components/GlobalPlayer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '行走 WALKING | Sing 个人音乐展示平台',
  description: 'A Journey of Sound & Self - 音乐人格与内容宇宙的数字载体',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-[#0B0B0B] text-white antialiased`}>
        {children}
        <GlobalPlayer />
      </body>
    </html>
  )
}
