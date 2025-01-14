import './globals.css'
import { Nosifer, Creepster } from 'next/font/google'
import HorrorCursor from './components/HorrorCursor'
import JumpScare from './components/JumpScare'
import BackgroundNoise from './components/BackgroundNoise'
import FlickeringLights from './components/FlickeringLights'

const nosifer = Nosifer({ weight: '400', subsets: ['latin'], variable: '--font-nosifer' })
const creepster = Creepster({ weight: '400', subsets: ['latin'], variable: '--font-creepster' })

export const metadata = {
  title: 'Horror Cinema',
  description: 'Enter at your own risk: The most terrifying movie experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nosifer.variable} ${creepster.variable} font-sans bg-black text-gray-200`}>
        <HorrorCursor />
        <JumpScare />
        <BackgroundNoise />
        <FlickeringLights />
        <div className="fog" />
        {children}
      </body>
    </html>
  )
}

