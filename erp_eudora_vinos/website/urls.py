from django.urls import path
from . import views
from . import apiViews

urlpatterns = [
    # HOME
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
    path('proveedor/delete/<str:nombre_prov>', views.delete_proveedor, name='delete_proveedor'),
    
    # NOTIFICACIONES
    path('notificaciones/', views.notificaciones, name='notificaciones'),
    path('notificaciones/insert_alerta_stock/', views.insert_alerta_stock, name='insert_alerta_stock'),
    path('notificaciones/delete/<int:id_inventario>/', views.delete_alerta_stock, name='delete_alerta_stock'),
    path('navbar/', views.navbar_view, name='navbar'), 
    path('venta/', views.ventas, name='venta'),
    path('venta/insert/', views.insert_ventas, name='insert_venta'),
    path('venta/update/', apiViews.guardarventa, name='update_venta'),
    path('venta/delete/<str:sku>', views.delete_ventas, name='delete_ventas'),

    # INVETARIO Y STOCK
    path('Inventario_Y_Stock/', views.inventario_Y_Stock, name='Inventario_Y_Stock'),
    path('Inventario_Y_Stock/insert/', views.insert_Inventario_Y_Stock, name='insert_Inventario_Y_Stock'),
    path('Inventario_Y_Stock/update/', apiViews.guardar_Inventario_Y_Stock, name='update_Inventario_Y_Stock'),
    path('Inventario_Y_Stock/delete/<int:id_inventario>', views.delete_Inventario_Y_Stock, name='delete_Inventario_Y_Stock'),  

    # COMPRAS PROVEEDORES
    path('compra_proveedor/', views.compra_proveedor, name='Compra_proveedores'),
    path('compra_proveedor/insert/', views.insert_compra_proveedor, name='insert_Compra_proveedores'),
    path('compra_proveedor/update/', apiViews.guardar_compra_proveedor, name='update_Compra_proveedores'),
    path('compra_proveedor/delete/<int:OC>', views.delete_compra_proveedor, name='delete_Compra_proveedores'),

    # API
    path('api/skus/', apiViews.get_product_skus, name='api_skus'),
    path('api/proveedores/', apiViews.get_proveedor_nombre, name='api_proveedores'),

    # CLIENTE  
    path('cliente/', views.cliente, name='cliente'),
    path('cliente/insert/', views.insert_cliente, name='insert_cliente'),
    path('cliente/update/', apiViews.guardar_cliente, name='update_cliente'),
    path('cliente/delete/<str:rut>', views.delete_cliente, name='delete_cliente'), 

]

