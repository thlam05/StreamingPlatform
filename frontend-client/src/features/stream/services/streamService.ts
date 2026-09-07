import type { Stream } from '../types/stream.types'

const sampleStreams: Stream[] = [
  {
    id: 'night-shift-coding',
    title: 'Night Shift Coding',
    creator: 'Nora Chen',
    initials: 'NC',
    category: 'Creative',
    viewers: 1240,
    duration: '02:18:42',
    description: 'Building a calm creator dashboard with a live design review.',
    gradientClass: 'from-zinc-300 via-zinc-600 to-zinc-950',
  },
  {
    id: 'ranked-arena',
    title: 'Ranked Arena',
    creator: 'Kai Rivers',
    initials: 'KR',
    category: 'Gaming',
    viewers: 894,
    duration: '01:04:18',
    description: 'High-energy ranked matches, strategy breakdowns, and community play.',
    gradientClass: 'from-zinc-200 via-zinc-700 to-zinc-950',
  },
  {
    id: 'lofi-studio',
    title: 'Lofi Studio Sessions',
    creator: 'Mina Park',
    initials: 'MP',
    category: 'Music',
    viewers: 672,
    duration: '03:36:09',
    description: 'Live beat-making sessions from a warm analog-inspired studio.',
    gradientClass: 'from-zinc-400 via-zinc-800 to-zinc-950',
  },
  {
    id: 'pixel-workshop',
    title: 'Pixel Workshop',
    creator: 'Owen Lee',
    initials: 'OL',
    category: 'Creative',
    viewers: 418,
    duration: '00:48:35',
    description: 'A practical workshop on building expressive pixel art environments.',
    gradientClass: 'from-zinc-300 via-zinc-700 to-zinc-900',
  },
]

export async function getStreams(): Promise<Stream[]> {
  return sampleStreams
}
