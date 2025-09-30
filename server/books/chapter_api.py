from django.http import JsonResponse
from .models import Book, Chapter

def list_chapters(request, book_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'GET':
        try:
            book = Book.objects.get(id=book_id)
            chapters = book.chapters.all().order_by('chapter_number')
            data = [
                {
                    'id': str(ch.id),
                    'title': ch.title,
                    'chapterNumber': ch.chapter_number,
                    'createdAt': ch.created_at.isoformat(),
                }
                for ch in chapters
            ]
            return JsonResponse(data, safe=False)
        except Book.DoesNotExist:
            return JsonResponse({'error': 'Book not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)
