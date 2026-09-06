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
    gradientClass: 'from-violet-500 via-fuchsia-500 to-rose-500',
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
    gradientClass: 'from-cyan-400 via-blue-500 to-indigo-700',
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
    gradientClass: 'from-amber-300 via-orange-500 to-red-600',
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
    gradientClass: 'from-emerald-300 via-teal-500 to-cyan-700',
  },
]

export async function getStreams(): Promise<Stream[]> {
  return sampleStreams
}
