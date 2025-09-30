from django.urls import path
from .views import add_book, list_books, update_book, delete_book, delete_chapter, delete_note, update_chapter, update_note
from .comment_api import add_comment, list_comments, delete_comment
from .chapter_views import add_chapter
from .chapter_api import list_chapters
from .note_api import add_note
from .note_list_api import list_notes

urlpatterns = [
    path('add/', add_book, name='add_book'),
    path('list/', list_books, name='list_books'),
    path('<str:book_id>/update/', update_book, name='update_book'),
    path('chapter/<str:chapter_id>/update/', update_chapter, name='update_chapter'),
    path('note/<str:note_id>/update/', update_note, name='update_note'),
    path('<str:book_id>/add-chapter/', add_chapter, name='add_chapter'),
    path('<str:book_id>/chapters/', list_chapters, name='list_chapters'),
    path('chapter/<str:chapter_id>/add-note/', add_note, name='add_note'),
    path('chapter/<str:chapter_id>/notes/', list_notes, name='list_notes'),
    path('<str:book_id>/delete/', delete_book, name='delete_book'),
    path('chapter/<str:chapter_id>/delete/', delete_chapter, name='delete_chapter'),
    path('note/<str:note_id>/delete/', delete_note, name='delete_note'),
    path('note/<str:note_id>/add-comment/', add_comment, name='add_comment'),
    path('note/<str:note_id>/comments/', list_comments, name='list_comments'),
    path('comment/<str:comment_id>/delete/', delete_comment, name='delete_comment'),
]
