from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import ChapterNote, NoteComment

@csrf_exempt
def add_comment(request, note_id):
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
            note = ChapterNote.objects.get(id=note_id)
            comment = NoteComment.objects.create(
                note=note,
                content=content,
                author=author
            )
            return JsonResponse({
                'id': comment.id,
                'content': comment.content,
                'author': comment.author,
                'timestamp': comment.timestamp.isoformat(),
            }, status=201)
        except ChapterNote.DoesNotExist:
            return JsonResponse({'error': 'Note not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def list_comments(request, note_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'GET':
        try:
            note = ChapterNote.objects.get(id=note_id)
            comments = note.comments.all().order_by('-timestamp')
            data = [
                {
                    'id': str(comment.id),
                    'content': comment.content,
                    'author': comment.author,
                    'timestamp': comment.timestamp.isoformat(),
                }
                for comment in comments
            ]
            return JsonResponse(data, safe=False)
        except ChapterNote.DoesNotExist:
            return JsonResponse({'error': 'Note not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def delete_comment(request, comment_id):
    if request.method == 'OPTIONS':
        response = JsonResponse({'detail': 'CORS preflight'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    if request.method == 'DELETE':
        try:
            comment = NoteComment.objects.get(id=comment_id)
            comment.delete()
            return JsonResponse({'success': True}, status=200)
        except NoteComment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)
