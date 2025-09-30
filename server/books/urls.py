from django.urls import path
from .views import add_book, list_books, update_book
from .chapter_views import add_chapter
from .chapter_api import list_chapters

urlpatterns = [
    path('add/', add_book, name='add_book'),
    path('list/', list_books, name='list_books'),
    path('<str:book_id>/update/', update_book, name='update_book'),
    path('<str:book_id>/add-chapter/', add_chapter, name='add_chapter'),
    path('<str:book_id>/chapters/', list_chapters, name='list_chapters'),
]
