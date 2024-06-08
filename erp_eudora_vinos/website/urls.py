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
    path('notificaciones/', views.notificaciones, name='notificaciones'),  
    path('notificaciones/insert_alerta_stock/', views.insert_alerta_stock, name='insert_alerta_stock'),
    #path('delete_alerta_stock/<str:SKU>/', views.delete_alerta_stock, name='delete_alerta_stock'),
    ##path('insert_alerta_informes/', views.insert_alerta_informes, name='insert_alerta_informes'),
    ##path('delete_alerta_informes/<int:numero_boleta>/', views.delete_alerta_informes, name='delete_alerta_informes'), 
]
