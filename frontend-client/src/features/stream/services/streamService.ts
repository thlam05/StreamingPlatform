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
    gradientClass: 'from-rose-400 via-pink-500 to-rose-700',
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
    gradientClass: 'from-pink-300 via-fuchsia-500 to-rose-700',
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
    gradientClass: 'from-pink-200 via-rose-500 to-red-700',
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
    gradientClass: 'from-rose-300 via-pink-400 to-fuchsia-800',
  },
]

export async function getStreams(): Promise<Stream[]> {
  return sampleStreams
}
