from django.urls import path
from . import views
from .models import Producto

urlpatterns = [
    path('', views.home, name='home'),
    path('producto/', views.producto, name='producto'),
]
