from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    cover_image = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title


class Chapter(models.Model):
    book = models.ForeignKey(Book, related_name='chapters', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    chapter_number = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} - Chapter {self.chapter_number}: {self.title}"



class ChapterNote(models.Model):
    chapter = models.ForeignKey(Chapter, related_name='notes', on_delete=models.CASCADE)
    content = models.TextField()
    author = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.author} on {self.chapter.title}"


# New: NoteComment model
class NoteComment(models.Model):
    note = models.ForeignKey(ChapterNote, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    author = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on note {self.note.id}"
