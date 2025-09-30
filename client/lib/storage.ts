"use client"

import type { Book, Chapter, ChapterNote } from "./types"

const STORAGE_KEY = "books-notes-data"

export function getBooks(): Book[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  const books = JSON.parse(data)
  // Convert date strings back to Date objects
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

export function updateBook(id: string, updates: Partial<Book>): void {
  const books = getBooks()
  const index = books.findIndex((b) => b.id === id)
  if (index !== -1) {
    books[index] = { ...books[index], ...updates }
    saveBooks(books)
  }
}

export function deleteBook(id: string): void {
  const books = getBooks().filter((b) => b.id !== id)
  saveBooks(books)
}

export function addChapter(bookId: string, chapter: Omit<Chapter, "id" | "notes">): void {
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

export function updateChapter(bookId: string, chapterId: string, updates: Partial<Chapter>): void {
  const books = getBooks()
  const book = books.find((b) => b.id === bookId)
  if (book) {
    const chapterIndex = book.chapters.findIndex((c) => c.id === chapterId)
    if (chapterIndex !== -1) {
      book.chapters[chapterIndex] = { ...book.chapters[chapterIndex], ...updates }
      saveBooks(books)
    }
  }
}

export function deleteChapter(bookId: string, chapterId: string): void {
  const books = getBooks()
  const book = books.find((b) => b.id === bookId)
  if (book) {
    book.chapters = book.chapters.filter((c) => c.id !== chapterId)
    saveBooks(books)
  }
}

export function addChapterNote(bookId: string, chapterId: string, note: Omit<ChapterNote, "id" | "timestamp">): void {
  const books = getBooks()
  const book = books.find((b) => b.id === bookId)
  if (book) {
    const chapter = book.chapters.find((c) => c.id === chapterId)
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

export function updateChapterNote(
  bookId: string,
  chapterId: string,
  noteId: string,
  updates: Partial<ChapterNote>,
): void {
  const books = getBooks()
  const book = books.find((b) => b.id === bookId)
  if (book) {
    const chapter = book.chapters.find((c) => c.id === chapterId)
    if (chapter) {
      const noteIndex = chapter.notes.findIndex((n) => n.id === noteId)
      if (noteIndex !== -1) {
        chapter.notes[noteIndex] = { ...chapter.notes[noteIndex], ...updates }
        saveBooks(books)
      }
    }
  }
}

export function deleteChapterNote(bookId: string, chapterId: string, noteId: string): void {
  const books = getBooks()
  const book = books.find((b) => b.id === bookId)
  if (book) {
    const chapter = book.chapters.find((c) => c.id === chapterId)
    if (chapter) {
      chapter.notes = chapter.notes.filter((n) => n.id !== noteId)
      saveBooks(books)
    }
  }
}
