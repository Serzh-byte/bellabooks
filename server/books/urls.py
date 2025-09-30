from django.urls import path
from .views import add_book, list_books
from .chapter_views import add_chapter

urlpatterns = [
    path('add/', add_book, name='add_book'),
    path('list/', list_books, name='list_books'),
    path('<str:book_id>/add-chapter/', add_chapter, name='add_chapter'),
]
