from django.urls import path
from . import views
from . import apiViews

urlpatterns = [
    path('', views.home, name='home'),
    path('producto/', views.producto, name='producto'),
    path('producto/insert/', views.insert_producto, name='insert_producto'),
    path('producto/update/', apiViews.guardarproducto, name='update_producto'),
    path('producto/delete/<str:SKU>', views.delete_producto, name='delete_producto'),
    path('proveedor/', views.proveedor, name='proveedor'),
    path('proveedor/insert/', views.insert_proveedor, name='insert_proveedor'),
    path('proveedor/update/', apiViews.guardarproveedor, name='update_proveedor'),
    path('proveedor/delete/<str:rut_empresa>', views.delete_proveedor, name='delete_proveedor'),   
    #Ventas
    path('venta/', views.ventas, name='venta'),
    path('venta/insert/', views.insert_ventas, name='insert_venta'),
    path('venta/update/', apiViews.guardarventa, name='update_venta'),
    path('venta/delete/<str:SKU>', views.delete_ventas, name='delete_venta'),
]
