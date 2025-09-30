"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateChapter } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type { Chapter } from "@/lib/types"

interface EditChapterDialogProps {
  bookId: string
  chapter: Chapter | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChapterUpdated: () => void
}

export function EditChapterDialog({ bookId, chapter, open, onOpenChange, onChapterUpdated }: EditChapterDialogProps) {
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title)
    }
  }, [chapter])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chapter) return

    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a chapter title.",
        variant: "destructive",
      })
      return
    }

    updateChapter(bookId, chapter.id, {
      title: title.trim(),
    }).then(() => {
      toast({
        title: "Chapter updated",
        description: "Chapter has been updated successfully.",
      })
      onOpenChange(false)
      onChapterUpdated()
    })
  }

  if (!chapter) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Chapter {chapter.chapterNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-chapter-title">Chapter Title *</Label>
            <Input
              id="edit-chapter-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title"
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
