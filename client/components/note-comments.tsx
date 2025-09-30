import React, { useEffect, useState } from "react"
import type { ChapterNote } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface NoteComment {
  id: string
  content: string
  author: string
  timestamp: string
}

interface NoteCommentsProps {
  noteId: string
}

export function NoteComments({ noteId }: NoteCommentsProps) {
  const [comments, setComments] = useState<NoteComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [author, setAuthor] = useState("")
  const [loading, setLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchComments = async () => {
    if (!apiUrl) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/books/note/${noteId}/comments/`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line
  }, [noteId])

  const handleAddComment = async () => {
    if (!apiUrl || !newComment || !author) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/books/note/${noteId}/add-comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, author }),
      })
      if (res.ok) {
        setNewComment("")
        setAuthor("")
        fetchComments()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!apiUrl) return
    setLoading(true)
    try {
      await fetch(`${apiUrl}/books/comment/${commentId}/delete/`, { method: "DELETE" })
      fetchComments()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2 border-t pt-2">
      <h4 className="font-semibold mb-2">Comments</h4>
      {loading && <div>Loading...</div>}
      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded px-2 py-1">
            <div>
              <span className="font-bold mr-2">{comment.author}</span>
              <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
              <div>{comment.content}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <Button size="sm" onClick={handleAddComment} disabled={loading || !newComment || !author}>
          Add
        </Button>
      </div>
    </div>
  )
}
