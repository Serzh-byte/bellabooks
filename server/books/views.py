from .models import Book, Chapter, ChapterNote

# DELETE BOOK
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def delete_book(request, book_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'DELETE':
        try:
            book = Book.objects.get(id=book_id)
            book.delete()
            return JsonResponse({'success': True}, status=200)
        except Book.DoesNotExist:
            return JsonResponse({'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)

# DELETE CHAPTER
@csrf_exempt
def delete_chapter(request, chapter_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'DELETE':
        try:
            chapter = Chapter.objects.get(id=chapter_id)
            chapter.delete()
            return JsonResponse({'success': True}, status=200)
        except Chapter.DoesNotExist:
            return JsonResponse({'error': 'Chapter not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)

# DELETE NOTE
@csrf_exempt
def delete_note(request, note_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'DELETE':
        try:
            note = ChapterNote.objects.get(id=note_id)
            note.delete()
            return JsonResponse({'success': True}, status=200)
        except ChapterNote.DoesNotExist:
            return JsonResponse({'error': 'Note not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Book

@csrf_exempt
def update_book(request, book_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "PATCH, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'PATCH':
        try:
            book = Book.objects.get(id=book_id)
            data = json.loads(request.body)
            for field in ['title', 'author', 'notes', 'coverImage']:
                if field in data:
                    if field == 'coverImage':
                        setattr(book, 'cover_image', data[field])
                    else:
                        setattr(book, field, data[field])
            book.save()
            return JsonResponse({'id': book.id, 'title': book.title, 'author': book.author, 'notes': book.notes, 'coverImage': book.cover_image}, status=200)
        except Book.DoesNotExist:
            return JsonResponse({'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Book
@csrf_exempt
def add_book(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            author = data.get('author')
            notes = data.get('notes', '')
            cover_image = data.get('coverImage', None)
            if not title or not author:
                return JsonResponse({'error': 'Missing title or author'}, status=400)
            book = Book.objects.create(
                title=title,
                author=author,
                notes=notes,
                cover_image=cover_image
            )
            return JsonResponse({'id': book.id, 'title': book.title, 'author': book.author}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Book

@csrf_exempt
def list_books(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'GET':
        books = Book.objects.all()
        data = [
            {
                'id': str(book.id),
                'title': book.title,
                'author': book.author,
                'notes': book.notes,
                'coverImage': book.cover_image,
                'createdAt': book.created_at.isoformat(),
            }
            for book in books
        ]
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Invalid method'}, status=405)
    if request.method == 'OPTIONS':
        # CORS preflight response
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title')
            author = data.get('author')
            notes = data.get('notes', '')
            cover_image = data.get('coverImage', None)
            if not title or not author:
                return JsonResponse({'error': 'Missing title or author'}, status=400)
            book = Book.objects.create(
                title=title,
                author=author,
                notes=notes,
                cover_image=cover_image
            )
            return JsonResponse({'id': book.id, 'title': book.title, 'author': book.author}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
