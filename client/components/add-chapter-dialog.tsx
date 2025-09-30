"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { addChapter } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface AddChapterDialogProps {
  bookId: string
  nextChapterNumber: number
  onChapterAdded: () => void
}

export function AddChapterDialog({ bookId, nextChapterNumber, onChapterAdded }: AddChapterDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a chapter title.",
        variant: "destructive",
      })
      return
    }

    addChapter(bookId, {
      bookId,
      title: title.trim(),
      chapterNumber: nextChapterNumber,
    })

    toast({
      title: "Chapter added",
      description: `Chapter ${nextChapterNumber} has been added.`,
    })

    setTitle("")
    setOpen(false)
    onChapterAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Chapter {nextChapterNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chapter-title">Chapter Title *</Label>
            <Input
              id="chapter-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chapter title"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Chapter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
