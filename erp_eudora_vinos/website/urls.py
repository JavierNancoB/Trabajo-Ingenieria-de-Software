from django.urls import path
from . import views
from .models import Producto
from . import apiViews

from .views import home, producto

urlpatterns = [
    path('', views.home, name='home'),
    path('producto/', views.producto, name='producto'),
    path('producto/insert/', views.insert_producto, name='insert_producto'),
    path('producto/update/', apiViews.guardarproducto, name='update_producto'),
    path('producto/delete/<str:SKU>', views.delete_producto, name='delete_producto'),
]
