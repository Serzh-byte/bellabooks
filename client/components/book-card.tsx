"use client"

import type { Book } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface BookCardProps {
  book: Book
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function BookCard({ book, onView, onEdit, onDelete }: BookCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {book.coverImage ? (
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
            <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 md:h-9 md:w-9 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 md:h-9 md:w-9"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="cursor-pointer p-3 md:p-4" onClick={onView}>
        <h3 className="line-clamp-2 text-balance text-sm md:text-base font-semibold leading-tight">{book.title}</h3>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        <p className="mt-1.5 md:mt-2 text-xs text-muted-foreground">
          {book.chapters.length} {book.chapters.length === 1 ? "chapter" : "chapters"}
        </p>
      </div>
    </Card>
  )
}
