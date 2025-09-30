from django.http import JsonResponse
from .models import Chapter, ChapterNote

def list_notes(request, chapter_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'GET':
        try:
            chapter = Chapter.objects.get(id=chapter_id)
            notes = chapter.notes.all().order_by('-timestamp')
            data = [
                {
                    'id': str(note.id),
                    'content': note.content,
                    'author': note.author,
                    'timestamp': note.timestamp.isoformat(),
                }
                for note in notes
            ]
            return JsonResponse(data, safe=False)
        except Chapter.DoesNotExist:
            return JsonResponse({'error': 'Chapter not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)
