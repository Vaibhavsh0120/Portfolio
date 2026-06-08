import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vaibhav Sharma | Software Developer',
  description:
    'Portfolio of Vaibhav Sharma — BTech Computer Science student, software developer, and hackathon finalist.',

  metadataBase: new URL('https://vaibhavsh0120.vercel.app'),

  openGraph: {
    title: 'Vaibhav Sharma | Software Developer',
    description: 'BTech CSE student • Software Developer • Hackathon Finalist',
    url: 'https://vaibhavsh0120.vercel.app/',
    siteName: 'Vaibhav Sharma Portfolio',
    images: [
      {
        url: '/api/og',
        width: 1080,
        height: 1080,
        alt: 'Vaibhav Sharma | Software Developer',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Sharma | Software Developer',
    description:
      'Portfolio of Vaibhav Sharma — BTech CSE student & software developer',
    images: ['/api/og'],
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/logo-light.png',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/logo-dark.png',
      media: '(prefers-color-scheme: dark)',
    },
    {
      rel: 'apple-touch-icon',
      url: '/logo-light.png',
    },
  ],
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SpeedInsights />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
