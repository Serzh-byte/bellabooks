from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Book

@csrf_exempt
def add_book(request):
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
