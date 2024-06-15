from django.urls import path
from . import views
from . import apiViews

urlpatterns = [
    path('', views.home, name='home'),
    # PRODUCTOS
    path('producto/', views.producto, name='producto'),
    path('producto/insert/', views.insert_producto, name='insert_producto'),
    path('producto/update/', apiViews.guardarproducto, name='update_producto'),
    path('producto/delete/<str:SKU>', views.delete_producto, name='delete_producto'),
    # PROVEEDORES
    path('proveedor/', views.proveedor, name='proveedor'),
    path('proveedor/insert/', views.insert_proveedor, name='insert_proveedor'),
    path('proveedor/update/', apiViews.guardarproveedor, name='update_proveedor'),
    path('proveedor/delete/<str:rut_empresa>', views.delete_proveedor, name='delete_proveedor'),
    # NOTIFICACIONES
    path('notificaciones/', views.notificaciones, name='notificaciones'),
    path('notificaciones/insert_alerta_stock/', views.insert_alerta_stock, name='insert_alerta_stock'),
    path('notificaciones/delete/<int:id_inventario>/', views.delete_alerta_stock, name='delete_alerta_stock'),
    path('navbar/', views.navbar_view, name='navbar'), 
    path('venta/', views.ventas, name='venta'),
    path('venta/insert/', views.insert_ventas, name='insert_venta'),
    path('venta/update/', apiViews.guardarventa, name='update_venta'),
    path('venta/delete/<str:SKU>', views.delete_ventas, name='delete_ventas'),
]
