export type StreamCategory = 'Gaming' | 'Music' | 'Creative'

export interface Stream {
  id: string
  title: string
  creator: string
  initials: string
  category: StreamCategory
  viewers: number
  duration: string
  description: string
  gradientClass: string
}
