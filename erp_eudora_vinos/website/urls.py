from django.urls import path
from . import views
from . import apiViews

urlpatterns = [
     path('', views.home, name='home'),
    #producto
    path('producto/', views.producto, name='producto'),
    path('producto/insert/', views.insert_producto, name='insert_producto'),
    path('producto/update/', apiViews.guardarproducto, name='update_producto'),
    path('producto/delete/<str:SKU>', views.delete_producto, name='delete_producto'),
    #proveedor
    path('proveedor/', views.proveedor, name='proveedor'),
    path('proveedor/insert/', views.insert_proveedor, name='insert_proveedor'),
    path('proveedor/update/', apiViews.guardarproveedor, name='update_proveedor'),
    path('proveedor/delete/<str:rut_empresa>', views.delete_proveedor, name='delete_proveedor'), 
    #cliente  
    path('cliente/', views.cliente, name='cliente'),
    path('cliente/insert/', views.insert_cliente, name='insert_cliente'),
    path('cliente/update/', apiViews.guardarcliente, name='update_cliente'),
    path('cliente/delete/<str:rut>', views.delete_cliente, name='delete_cliente'), 
]
