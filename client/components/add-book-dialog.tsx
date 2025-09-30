"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Upload, X, LinkIcon } from "lucide-react"
import { addBook } from "@/lib/storage"
import { convertImageToBase64, validateImageFile, validateImageUrl } from "@/lib/image-utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddBookDialogProps {
  onBookAdded: () => void
}

export function AddBookDialog({ onBookAdded }: AddBookDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
      // Test if the image loads
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setCoverImage(imageUrl)
        setImageUrl("")
        toast({
          title: "Image loaded",
          description: "Cover image has been added successfully.",
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
        description: "Cover image has been added successfully.",
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

  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and author.",
        variant: "destructive",
      })
      return
    }
    setIsAdding(true)
    try {
      await addBook({
        title: title.trim(),
        author: author.trim(),
        notes: "",
        coverImage: coverImage || undefined,
      })
      toast({
        title: "Book added",
        description: `"${title}" has been added to your collection.`,
      })
      setTitle("")
      setAuthor("")
      setCoverImage(null)
      setImageUrl("")
      setOpen(false)
      onBookAdded()
    } catch {
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
