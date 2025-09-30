export interface Book {
  id: string
  title: string
  author: string
  coverImage?: string
  notes: string
  createdAt: Date
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  bookId: string
  title: string
  chapterNumber: number
  notes: ChapterNote[]
}

export interface ChapterNote {
  id: string
  chapterId: string
  content: string
  author: "Serzh" | "Bella"
  timestamp: Date
}

export type Author = "Serzh" | "Bella"
