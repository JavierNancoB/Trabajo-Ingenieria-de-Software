from django.urls import path
from . import views
from .models import Producto

from .views import home, producto, ajuste_producto

urlpatterns = [
    path('', home, name='home'),
    path('producto/', producto, name='producto'),
    path('producto/edit/', ajuste_producto, name='ajuste_producto'),
]
