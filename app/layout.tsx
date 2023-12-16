import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from 'next/font/google'
import VideoLayout from "./video/videoLayout";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Battle Ship',
    description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en">
            <body className={inter.className}>
                <div style={{ minWidth: '1500px' }}>
                    <VideoLayout />
                    {children}
                    <SpeedInsights />
                </div>
            </body>
        </html>
    )
}
