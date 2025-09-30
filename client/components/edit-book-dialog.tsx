"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, LinkIcon } from "lucide-react"
import { updateBook } from "@/lib/storage"
import { convertImageToBase64, validateImageFile, validateImageUrl } from "@/lib/image-utils"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/lib/types"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EditBookDialogProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookUpdated: () => void
}

export function EditBookDialog({ book, open, onOpenChange, onBookUpdated }: EditBookDialogProps) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [notes, setNotes] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (book) {
      setTitle(book.title)
      setAuthor(book.author)
      setNotes(book.notes)
      setCoverImage(book.coverImage || null)
    }
  }, [book])

  const handleImageUrl = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      })
      return
    }

    if (!validateImageUrl(imageUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL (must start with http:// or https://).",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setCoverImage(imageUrl)
        setImageUrl("")
        toast({
          title: "Image loaded",
          description: "Cover image has been updated successfully.",
        })
        setIsUploading(false)
      }
      img.onerror = () => {
        toast({
          title: "Failed to load image",
          description: "Could not load image from URL. Please check the URL and try again.",
          variant: "destructive",
        })
        setIsUploading(false)
      }
      img.src = imageUrl
    } catch (error) {
      toast({
        title: "Failed to load image",
        description: "Could not load image from URL. Please try again.",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!validateImageFile(file)) {
      toast({
        title: "Invalid file",
        description: "Please upload a valid image file (JPEG, PNG, WebP, GIF) under 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const base64 = await convertImageToBase64(file)
      setCoverImage(base64)
      toast({
        title: "Image uploaded",
        description: "Cover image has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!book) return

    if (!title.trim() || !author.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and author.",
        variant: "destructive",
      })
      return
    }

    updateBook(book.id, {
      title: title.trim(),
      author: author.trim(),
      notes: notes.trim(),
      coverImage: coverImage || undefined,
    })

    toast({
      title: "Book updated",
      description: `"${title}" has been updated successfully.`,
    })

    onOpenChange(false)
    onBookUpdated()
  }

  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Image URL</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-3 mt-3">
                {coverImage ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-lg border">
                    <Image
                      src={coverImage || "/placeholder.svg"}
                      alt="Book cover preview"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2 h-7 w-7"
                      onClick={() => setCoverImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="https://example.com/book-cover.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleImageUrl}
                      disabled={isUploading || !imageUrl.trim()}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      {isUploading ? "Loading..." : "Load Image"}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="upload" className="space-y-3 mt-3">
                {coverImage ? (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-lg border">
                    <Image
                      src={coverImage || "/placeholder.svg"}
                      alt="Book cover preview"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2 h-7 w-7"
                      onClick={() => setCoverImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-32 w-full border-dashed bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {isUploading ? "Uploading..." : "Upload cover image"}
                      </span>
                    </div>
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-author">Author *</Label>
            <Input
              id="edit-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Book Notes</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your thoughts about this book..."
              rows={4}
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
