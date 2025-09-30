"use client"

import { useState } from "react"
import type { Book, Chapter, ChapterNote } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, BookOpen } from "lucide-react"
import { AddChapterDialog } from "./add-chapter-dialog"
import { EditChapterDialog } from "./edit-chapter-dialog"
import { AddNoteDialog } from "./add-note-dialog"
import { EditNoteDialog } from "./edit-note-dialog"
import { deleteChapter, deleteChapterNote } from "@/lib/storage"
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
import Image from "next/image"

interface BookDetailViewProps {
  book: Book
  onBack: () => void
  onUpdate: () => void
}

export function BookDetailView({ book, onBack, onUpdate }: BookDetailViewProps) {
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [editingNote, setEditingNote] = useState<{ chapterId: string; note: ChapterNote } | null>(null)
  const [deleteChapterDialog, setDeleteChapterDialog] = useState<string | null>(null)
  const [deleteNoteDialog, setDeleteNoteDialog] = useState<{ chapterId: string; noteId: string } | null>(null)
  const { toast } = useToast()

  const handleDeleteChapter = (chapterId: string) => {
    deleteChapter(book.id, chapterId)
    toast({
      title: "Chapter deleted",
      description: "Chapter has been removed.",
    })
    setDeleteChapterDialog(null)
    onUpdate()
  }

  const handleDeleteNote = (chapterId: string, noteId: string) => {
    deleteChapterNote(book.id, chapterId, noteId)
    toast({
      title: "Note deleted",
      description: "Note has been removed.",
    })
    setDeleteNoteDialog(null)
    onUpdate()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/5">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>

        <div className="mb-8 flex flex-col gap-6 md:flex-row">
          <div className="relative aspect-[2/3] w-full max-w-[200px] shrink-0 overflow-hidden rounded-lg border shadow-lg">
            {book.coverImage ? (
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
                <BookOpen className="h-20 w-20 text-muted-foreground/40" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-balance text-3xl font-bold leading-tight md:text-4xl">{book.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{book.author}</p>
            {book.notes && (
              <Card className="mt-4 bg-amber-50/50 p-4 dark:bg-amber-950/20">
                <h3 className="mb-2 font-semibold">Book Notes</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{book.notes}</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Chapters</h2>
          <AddChapterDialog bookId={book.id} nextChapterNumber={book.chapters.length + 1} onChapterAdded={onUpdate} />
        </div>

        {book.chapters.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No chapters yet. Add your first chapter to get started!</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {book.chapters
              .sort((a, b) => a.chapterNumber - b.chapterNumber)
              .map((chapter) => (
                <Card key={chapter.id} className="overflow-hidden">
                  <div className="flex items-start justify-between gap-4 bg-muted/30 p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Chapter {chapter.chapterNumber}</Badge>
                        <h3 className="text-balance text-lg font-semibold leading-tight">{chapter.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setEditingChapter(chapter)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteChapterDialog(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-medium">Notes</h4>
                      <AddNoteDialog bookId={book.id} chapterId={chapter.id} onNoteAdded={onUpdate} />
                    </div>

                    {chapter.notes.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No notes yet. Add your first note!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {chapter.notes
                          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                          .map((note) => (
                            <Card
                              key={note.id}
                              className={`p-4 ${
                                note.author === "Serzh"
                                  ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                                  : "border-l-4 border-l-pink-500 bg-pink-50/50 dark:bg-pink-950/20"
                              }`}
                            >
                              <div className="mb-2 flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      note.author === "Serzh"
                                        ? "border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        : "border-pink-500 bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                                    }
                                  >
                                    {note.author}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{formatDate(note.timestamp)}</span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => setEditingNote({ chapterId: chapter.id, note })}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => setDeleteNoteDialog({ chapterId: chapter.id, noteId: note.id })}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
                            </Card>
                          ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      <EditChapterDialog
        bookId={book.id}
        chapter={editingChapter}
        open={!!editingChapter}
        onOpenChange={(open) => !open && setEditingChapter(null)}
        onChapterUpdated={onUpdate}
      />

      <EditNoteDialog
        bookId={book.id}
        chapterId={editingNote?.chapterId || ""}
        note={editingNote?.note || null}
        open={!!editingNote}
        onOpenChange={(open) => !open && setEditingNote(null)}
        onNoteUpdated={onUpdate}
      />

      <AlertDialog open={!!deleteChapterDialog} onOpenChange={(open) => !open && setDeleteChapterDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chapter and all its notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteChapterDialog && handleDeleteChapter(deleteChapterDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteNoteDialog} onOpenChange={(open) => !open && setDeleteNoteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this note. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteNoteDialog && handleDeleteNote(deleteNoteDialog.chapterId, deleteNoteDialog.noteId)}
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
