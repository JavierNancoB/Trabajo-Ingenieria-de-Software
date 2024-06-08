from django.urls import path
from . import views
from . import apiViews

urlpatterns = [
    path('', views.home, name='home'),
    path('producto/', views.producto, name='producto'),
    path('producto/insert/', views.insert_producto, name='insert_producto'),
    path('producto/update/', apiViews.guardarproducto, name='update_producto'),
    path('producto/delete/<str:SKU>', views.delete_producto, name='delete_producto'),
    
    #PROVEEDORES
    path('proveedor/', views.proveedor, name='proveedor'),
    path('proveedor/insert/', views.insert_proveedor, name='insert_proveedor'),
    path('proveedor/update/', apiViews.guardarproveedor, name='update_proveedor'),
    path('proveedor/delete/<str:rut_empresa>', views.delete_proveedor, name='delete_proveedor'),    

    #Inventario_y_Stock
    path('', views.home, name='home'),
    path('Inventario_Y_Stock/', views.inventario_Y_Stock, name='Inventario_Y_Stock'),
    path('Inventario_Y_Stock/insert/', views.insert_Inventario_Y_Stock, name='insert_Inventario_Y_Stock'),
    path('Inventario_Y_Stock/update/', apiViews.guardar_Inventario_Y_Stock, name='update_Inventario_Y_Stock'),
    path('Inventario_Y_Stock/delete/<str:SKU>', views.delete_Inventario_Y_Stock, name='delete_Inventario_Y_Stock'),  

]

