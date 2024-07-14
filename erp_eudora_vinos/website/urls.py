from django.urls import path
from . import views
from . import apiViews

urlpatterns = [
    # HOME
    # path('', views.home, name='home'),
    path('', views.notificaciones_fecha_vencimiento, name='home'), #cambiar a home

    # PRODUCTOS
    path('producto/', views.producto, name='producto'), #muestra
    path('producto/insert/', views.insert_producto, name='insert_producto'), #inserta
    path('producto/update/', apiViews.guardarproducto, name='update_producto'), #actualiza
    path('producto/delete/<str:SKU>', views.delete_producto, name='delete_producto'), #borra
    
    # PROVEEDORES
    path('proveedor/', views.proveedor, name='proveedor'), #muestra
    path('proveedor/insert/', views.insert_proveedor, name='insert_proveedor'), #inserta
    path('proveedor/update/', apiViews.guardarproveedor, name='update_proveedor'), #actualiza
    path('proveedor/delete/<str:nombre_prov>', views.delete_proveedor, name='delete_proveedor'), #borra
    
    # NOTIFICACIONES

    path('navbar/', views.navbar_view, name='navbar'),  #muestra
    path('venta/', views.ventas, name='venta'), #muestra
    path('venta/insert/', views.insert_ventas, name='insert_venta'), #inserta
    path('venta/update/', apiViews.guardarventa, name='update_venta'), #actualiza
    path('venta/delete/<str:pedido>', views.delete_ventas, name='delete_ventas'), #borra

    # Alerta inventario
    path('notificaciones/', views.notificaciones, name='notificaciones'), #muestra

    # Alerta vencimiento
    
    #path('notificaciones-fecha-vencimiento/', views.notificaciones_fecha_vencimiento, name='notificaciones_fecha_vencimiento'),

    # INVETARIO Y STOCK
    path('Inventario_Y_Stock/', views.inventario_Y_Stock, name='Inventario_Y_Stock'), #muestra
    path('Inventario_Y_Stock/insert/', views.insert_Inventario_Y_Stock, name='insert_Inventario_Y_Stock'), #inserta
    path('Inventario_Y_Stock/update/', apiViews.guardar_Inventario_Y_Stock, name='guardar_Inventario_Y_Stock'), #actualiza
    path('Inventario_Y_Stock/update_ventas/', views.update_Inventario_Y_Stock, name='update_Inventario_Y_Stock'), #actualiza para ventas
    path('Inventario_Y_Stock/delete/<int:id_inventario>', views.delete_Inventario_Y_Stock, name='delete_Inventario_Y_Stock'),  #borra 

    # COMPRAS PROVEEDORES
    path('compra_proveedor/', views.compra_proveedor, name='Compra_proveedores'), #muestra
    path('compra_proveedor/insert/', views.insert_compra_proveedor, name='insert_Compra_proveedores'), #inserta
    path('compra_proveedor/update/', apiViews.guardar_compra_proveedor, name='update_Compra_proveedores'), #actualiza
    path('compra_proveedor/delete/<int:OC>', views.delete_compra_proveedor, name='delete_Compra_proveedores'), #borra

    # API
    path('api/skus/', apiViews.get_product_skus, name='api_skus'), #muestra
    path('api/proveedores/', apiViews.get_proveedor_nombre, name='api_proveedores'), #muestra
    path('api/cliente/', apiViews.get_cliente_nombre, name='api_ventas'), #muestra

    # CLIENTE  
    path('cliente/', views.cliente, name='cliente'), #muestra
    path('cliente/insert/', views.insert_cliente, name='insert_cliente'), #inserta
    path('cliente/update/', apiViews.guardar_cliente, name='update_cliente'), #actualiza
    path('cliente/delete/<str:rut>', views.delete_cliente, name='delete_cliente'),  #borra

]

