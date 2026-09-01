import '../styles/globals.css'

export const metadata = {
  title: 'AeroPulse Diagnostics — Acoustic Appliance Analysis',
  description:
    'Universal acoustic electronics appliance diagnostic tool. Record or upload audio from your household mechanical systems to receive AI-powered DIY repair instructions.',
  keywords: [
    'appliance diagnosis', 'acoustic analysis', 'washing machine repair',
    'refrigerator repair', 'AC repair', 'microwave repair', 'DIY appliance fix',
  ],
  authors: [{ name: 'AeroPulse Diagnostics' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#FFD100',
  openGraph: {
    title: 'AeroPulse Diagnostics',
    description: 'Acoustic appliance fault detection powered by local algorithmic analysis.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Inter font — system-fallback friendly */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#111111] antialiased">
        {children}
      </body>
    </html>
  )
}
