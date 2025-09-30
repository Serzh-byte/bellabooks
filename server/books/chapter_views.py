from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Book, Chapter

@csrf_exempt
def add_chapter(request, book_id):
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
            chapter_number = data.get('chapterNumber')
            if not title or not chapter_number:
                return JsonResponse({'error': 'Missing title or chapter number'}, status=400)
            book = Book.objects.get(id=book_id)
            chapter = Chapter.objects.create(
                book=book,
                title=title,
                chapter_number=chapter_number
            )
            return JsonResponse({'id': chapter.id, 'title': chapter.title, 'chapterNumber': chapter.chapter_number}, status=201)
        except Book.DoesNotExist:
            return JsonResponse({'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
