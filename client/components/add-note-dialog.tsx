"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { addChapterNote } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type { Author } from "@/lib/types"

interface AddNoteDialogProps {
  bookId: string
  chapterId: string
  onNoteAdded: () => void
}

export function AddNoteDialog({ bookId, chapterId, onNoteAdded }: AddNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState<Author>("Serzh")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a note.",
        variant: "destructive",
      })
      return
    }

    addChapterNote(bookId, chapterId, {
      chapterId,
      content: content.trim(),
      author,
    })

    toast({
      title: "Note added",
      description: `Note by ${author} has been added.`,
    })

    setContent("")
    setAuthor("Serzh")
    setOpen(false)
    onNoteAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-author">Written by *</Label>
            <Select value={author} onValueChange={(value) => setAuthor(value as Author)}>
              <SelectTrigger id="note-author">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Serzh">Serzh</SelectItem>
                <SelectItem value="Bella">Bella</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-content">Note *</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              rows={6}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
