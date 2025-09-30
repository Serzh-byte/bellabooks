from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Chapter, ChapterNote

@csrf_exempt
def add_note(request, chapter_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            content = data.get('content')
            author = data.get('author')
            if not content or not author:
                return JsonResponse({'error': 'Missing content or author'}, status=400)
            chapter = Chapter.objects.get(id=chapter_id)
            note = ChapterNote.objects.create(
                chapter=chapter,
                content=content,
                author=author
            )
            return JsonResponse({
                'id': note.id,
                'content': note.content,
                'author': note.author,
                'timestamp': note.timestamp.isoformat(),
            }, status=201)
        except Chapter.DoesNotExist:
            return JsonResponse({'error': 'Chapter not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
