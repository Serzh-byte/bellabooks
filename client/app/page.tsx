"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/lib/types"
import { getBooks, deleteBook } from "@/lib/storage"
import { BookCard } from "@/components/book-card"
import { AddBookDialog } from "@/components/add-book-dialog"
import { EditBookDialog } from "@/components/edit-book-dialog"
import { BookDetailView } from "@/components/book-detail-view"
import { BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deleteBookDialog, setDeleteBookDialog] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"books" | "coming-soon">("books")
  const { toast } = useToast()

  const loadBooks = async () => {
    const books = await getBooks()
    setBooks(books)
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const handleViewBook = (book: Book) => {
    setSelectedBook(book)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
  }

  const handleDeleteBook = (bookId: string) => {
    deleteBook(bookId)
    toast({
      title: "Book deleted",
      description: "Book has been removed from your library.",
    })
    setDeleteBookDialog(null)
    loadBooks()
  }

  const handleBackToLibrary = () => {
    setSelectedBook(null)
    loadBooks()
  }

  if (selectedBook) {
    // Use books from state, which is loaded asynchronously
    const currentBook = books.find((b) => b.id === selectedBook.id)
    if (!currentBook) {
      setSelectedBook(null)
      return null
    }
    return <BookDetailView book={currentBook} onBack={handleBackToLibrary} onUpdate={loadBooks} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/5">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <h1 className="text-xl font-bold md:text-2xl">Our Reading Nook</h1>
            </div>
            <nav className="flex items-center gap-2">
              <Button
                variant={activeTab === "books" ? "default" : "ghost"}
                onClick={() => setActiveTab("books")}
                className="font-medium"
              >
                Books & Notes
              </Button>
              <Button variant="ghost" disabled className="font-medium text-muted-foreground/50 cursor-not-allowed">
                Coming Soon
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {activeTab === "books" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold md:text-3xl">Your Library</h2>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  A cozy space for Serzh & Bella to share their reading journey
                </p>
              </div>
              <AddBookDialog onBookAdded={loadBooks} />
            </div>

            {books.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 md:p-12">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 md:h-16 md:w-16 text-muted-foreground/40" />
                  <h3 className="mb-2 text-lg md:text-xl font-semibold">No books yet</h3>
                  <p className="mb-6 text-sm md:text-base text-muted-foreground">
                    Start building your reading collection!
                  </p>
                  <AddBookDialog onBookAdded={loadBooks} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onView={() => handleViewBook(book)}
                    onEdit={() => handleEditBook(book)}
                    onDelete={() => setDeleteBookDialog(book.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "coming-soon" && (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-card p-12">
            <div className="text-center">
              <p className="text-6xl mb-4">😈</p>
              <h3 className="mb-2 text-2xl font-semibold">Coming Soon</h3>
              <p className="text-muted-foreground">Star maps and voice messages are on their way!</p>
            </div>
          </div>
        )}
      </div>

      <EditBookDialog
        book={editingBook}
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        onBookUpdated={loadBooks}
      />

      <AlertDialog open={!!deleteBookDialog} onOpenChange={(open) => !open && setDeleteBookDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this book and all its chapters and notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteBookDialog && handleDeleteBook(deleteBookDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
