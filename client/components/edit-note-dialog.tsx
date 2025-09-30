"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateChapterNote } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type { Author, ChapterNote } from "@/lib/types"

interface EditNoteDialogProps {
  bookId: string
  chapterId: string
  note: ChapterNote | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteUpdated: () => void
}

export function EditNoteDialog({ bookId, chapterId, note, open, onOpenChange, onNoteUpdated }: EditNoteDialogProps) {
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState<Author>("Serzh")
  const { toast } = useToast()

  useEffect(() => {
    if (note) {
      setContent(note.content)
      setAuthor(note.author)
    }
  }, [note])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note) return

    if (!content.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a note.",
        variant: "destructive",
      })
      return
    }

    updateChapterNote(bookId, chapterId, note.id, {
      content: content.trim(),
      author,
    }).then(() => {
      toast({
        title: "Note updated",
        description: "Note has been updated successfully.",
      })
      onOpenChange(false)
      onNoteUpdated()
    })
  }

  if (!note) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-note-author">Written by *</Label>
            <Select value={author} onValueChange={(value) => setAuthor(value as Author)}>
              <SelectTrigger id="edit-note-author">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Serzh">Serzh</SelectItem>
                <SelectItem value="Bella">Bella</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-note-content">Note *</Label>
            <Textarea
              id="edit-note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              rows={6}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
