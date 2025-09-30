"use client"

import type { Book, Chapter, ChapterNote } from "./types"

const STORAGE_KEY = "books-notes-data"

export async function getBooks(): Promise<Book[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/books/list/`)
      if (res.ok) {
        const books = await res.json()
        return books.map((book: any) => ({
          ...book,
          createdAt: new Date(book.createdAt),
          chapters: [], // Chapters will be fetched separately if needed
        }))
      }
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  const books = JSON.parse(data)
  return books.map((book: any) => ({
    ...book,
    createdAt: new Date(book.createdAt),
    chapters: book.chapters.map((chapter: any) => ({
      ...chapter,
      notes: chapter.notes.map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp),
      })),
    })),
  }))
}

export function saveBooks(books: Book[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export function addBook(book: Omit<Book, "id" | "createdAt" | "chapters">): Book {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    // Send to backend
    return fetch(`${apiUrl}/books/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to add book")
        const data = await res.json()
        return {
          ...book,
          id: data.id,
          createdAt: new Date(),
          chapters: [],
        }
      })
      .catch(() => {
        // fallback to localStorage if backend fails
        const books = getBooks()
        const newBook: Book = {
          ...book,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          chapters: [],
        }
        books.push(newBook)
        saveBooks(books)
        return newBook
      })
  } else {
    // fallback to localStorage
    const books = getBooks()
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      chapters: [],
    }
    books.push(newBook)
    saveBooks(books)
    return newBook
  }
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/books/${id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  const index = books.findIndex((b: any) => b.id === id)
  if (index !== -1) {
    books[index] = { ...books[index], ...updates }
    saveBooks(books)
  }
}

export async function deleteBook(id: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/books/${id}/delete/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete book")
      return
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  saveBooks(books.filter((b: Book) => b.id !== id))
}

export async function addChapter(bookId: string, chapter: Omit<Chapter, "id" | "notes">): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/books/${bookId}/add-chapter/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chapter),
      })
      if (!res.ok) throw new Error("Failed to add chapter")
      await res.json()
    } catch {
      // fallback to localStorage if backend fails
      const books = getBooks()
      const book = books.find((b) => b.id === bookId)
      if (book) {
        const newChapter: Chapter = {
          ...chapter,
          id: crypto.randomUUID(),
          notes: [],
        }
        book.chapters.push(newChapter)
        saveBooks(books)
      }
    }
  } else {
    // fallback to localStorage
    const books = getBooks()
    const book = books.find((b) => b.id === bookId)
    if (book) {
      const newChapter: Chapter = {
        ...chapter,
        id: crypto.randomUUID(),
        notes: [],
      }
      book.chapters.push(newChapter)
      saveBooks(books)
    }
  }
}

export async function updateChapter(bookId: string, chapterId: string, updates: Partial<Chapter>): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/books/chapter/${chapterId}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      return
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  const book = books.find((b: Book) => b.id === bookId)
  if (book) {
    const chapterIndex = book.chapters.findIndex((c: Chapter) => c.id === chapterId)
    if (chapterIndex !== -1) {
      book.chapters[chapterIndex] = { ...book.chapters[chapterIndex], ...updates }
      saveBooks(books)
    }
  }
}

export async function deleteChapter(bookId: string, chapterId: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/books/chapter/${chapterId}/delete/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete chapter")
      return
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  const book = books.find((b: Book) => b.id === bookId)
  if (book) {
    book.chapters = book.chapters.filter((c: Chapter) => c.id !== chapterId)
    saveBooks(books)
  }
}

export async function addChapterNote(bookId: string, chapterId: string, note: Omit<ChapterNote, "id" | "timestamp">): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/books/chapter/${chapterId}/add-note/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      })
      return
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  const book = books.find((b: any) => b.id === bookId)
  if (book) {
    const chapter = book.chapters.find((c: any) => c.id === chapterId)
    if (chapter) {
      const newNote: ChapterNote = {
        ...note,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      }
      chapter.notes.push(newNote)
      saveBooks(books)
    }
  }
}

export async function updateChapterNote(
  bookId: string,
  chapterId: string,
  noteId: string,
  updates: Partial<ChapterNote>,
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/books/note/${noteId}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      return
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  const book = books.find((b: Book) => b.id === bookId)
  if (book) {
    const chapter = book.chapters.find((c: Chapter) => c.id === chapterId)
    if (chapter) {
      const noteIndex = chapter.notes.findIndex((n: ChapterNote) => n.id === noteId)
      if (noteIndex !== -1) {
        chapter.notes[noteIndex] = { ...chapter.notes[noteIndex], ...updates }
        saveBooks(books)
      }
    }
  }
}

export async function deleteChapterNote(bookId: string, chapterId: string, noteId: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/books/note/${noteId}/delete/`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete note")
      return
    } catch {
      // fallback to localStorage
    }
  }
  // fallback to localStorage
  const books = await getBooks()
  const book = books.find((b: Book) => b.id === bookId)
  if (book) {
    const chapter = book.chapters.find((c: Chapter) => c.id === chapterId)
    if (chapter) {
      chapter.notes = chapter.notes.filter((n: ChapterNote) => n.id !== noteId)
      saveBooks(books)
    }
  }
}
