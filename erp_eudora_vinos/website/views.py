from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import datetime
from django.utils import timezone
import random
from.models import *
from .sync import SyncWoocomerce 


# HOME

@login_required
def home(request):
    verificar_vencimientos()
    return render(request, 'home.html')

# PRODUCTOS

@login_required
def producto(request):
    productos = Producto.objects.all()
    return render(request, 'producto.html', {'productos': productos})

# insertar un producto
@login_required
def insert_producto(request):
    member = Producto(SKU=request.POST.get('SKU'), tipo_producto=request.POST.get('tipo_producto'), viña=request.POST.get('viña'), cepa=request.POST.get('cepa'), nombre_producto=request.POST.get('nombre_producto'), cosecha=request.POST.get('cosecha'))
    member.save()
    return redirect('/')

#borrar un producto
@login_required
@require_POST
def delete_producto(request, SKU):
    try:
        member = Producto.objects.get(SKU=SKU)
        member.delete()
        return JsonResponse({'status': 'success', 'message': 'Producto eliminado'})
    except Producto.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)

# PROVEEDORES

#muestra los proveedores
@login_required
def proveedor(request):
    proveedores = Proveedores.objects.all()
    return render(request, 'proveedores.html', {'proveedores': proveedores})
#inserta un proveedor
@login_required
def insert_proveedor(request):
    member = Proveedores(
                         nombre_prov=request.POST.get('nombre_prov'), 
                         email_empresa=request.POST.get('email_empresa'), 
                         telefono_empresa=request.POST.get('telefono_empresa')
                         )
    member.save()
    return redirect('/')
#borra un proveedor
@login_required
@require_POST
def delete_proveedor(request, nombre_prov):
    try:
        member = Proveedores.objects.get(nombre_prov=nombre_prov)
        member.delete()
        return JsonResponse({'status': 'success', 'message': 'Producto eliminado'})
    except Proveedores.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)

# VENTAS
#muestra las ventas
@login_required
def ventas(request):
    #SyncWoocomerce()
    ventas = Ventas.objects.all()
    return render(request, 'ventas.html', {'ventas': ventas})

#inserta una venta
@login_required
def insert_ventas(request):
    member = Ventas(
        pedido=request.POST.get('pedido'),
        rut_id=request.POST.get('rut'),
        SKU_id=request.POST.get('SKU'),
        precio_unitario=request.POST.get('precio_unitario'),
        cantidad=request.POST.get('cantidad'),
        venta_total=request.POST.get('venta_total'),
        flete=request.POST.get('flete'),
        factura_o_boleta=request.POST.get('factura_o_boleta'),
        fecha_boleta=request.POST.get('fecha_boleta'),
        pago=request.POST.get('pago')
    )
    member.save()
    return redirect('/')
#borra una venta
@login_required
@require_POST
def delete_ventas(request, pedido):
    try:
        venta = Ventas.objects.get(pedido=pedido)
        venta.delete()
        return JsonResponse({'status': 'success'})
    except Ventas.DoesNotExist:
        return JsonResponse({'status': 'error'}, status=404)
# ALERTAS

# Notificaciones de stock
# FUNCION QUE VERIFICA LOS STOCKS CUANDO SE REINICIA LA PAGINA
@login_required
def notificaciones(request):
    alertas_stock = Alerta_stock.objects.all()  # Obtén todas las alertas
    #alertas_informe= Alerta_informes.objects.all() # Obtén todas las alertas
    return render(request, 'notificaciones.html', {'alertas_stock': alertas_stock}) 
'''
@login_required
def delete_alerta_stock(request, id_inventario):
    alerta_stock = get_object_or_404(Alerta_stock, id_inventario=id_inventario)
    alerta_stock.delete()
    return redirect('notificaciones')
'''
#borra una alerta de stock
@login_required
@require_POST
def delete_alerta_stock(id_inventario):
    try:
        member = Alerta_stock.objects.get(id_inventario=id_inventario)
        member.delete()
        return JsonResponse({'status': 'success', 'message': 'Producto eliminado'})
    except Alerta_stock.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)

# Notificaciones de fechas de vencimiento

# FUNCION QUE VERIFICA LOS VENCIMIENTOS DE LAS COMPRAS A PROVEEDORES CUANDO SE REINICIA LA PAGINA

def verificar_vencimientos():
    hoy = timezone.now().date()
    compras = Compra_proveedores.objects.filter(status='Pendiente')
    for compra in compras:
        fecha_vencimiento = compra.fecha_vencimiento
        diferencia = (fecha_vencimiento - hoy).days
        if diferencia <= 14:
            Alerta_vencimiento.objects.get_or_create(
                OC=compra,
                defaults={
                    'status': 'Pendiente',
                    'fecha_vencimiento': compra.fecha_vencimiento,
                    'fecha_alerta': hoy
                }
            )
#muestra las notificaciones de vencimiento
@login_required
def notificaciones_fecha_vencimiento(request):
    alertas_de_fecha_vencimiento = Alerta_vencimiento.objects.all()  # Obtén todas las alertas
    #alertas_informe= Alerta_informes.objects.all() # Obtén todas las alertas
    return render(request, 'home.html', {'alertas_de_fecha_vencimiento': alertas_de_fecha_vencimiento}) 


#extra 
'''
@login_required
def delete_alerta_informes(request, numero_boleta):
    alerta_informes = get_object_or_404(Alerta_informes, numero_boleta=numero_boleta)
    alerta_informes.delete()
    return redirect('notificaciones')
'''

# INVENTARIO Y STOCK
#muestra el inventario y stock
@login_required
def inventario_Y_Stock(request):
    inventario_Y_stocks = Inventario_Y_Stock.objects.all()
    return render(request, 'Inventario_Y_Stock.html', {'inventario_Y_stocks': inventario_Y_stocks})

'''
@login_required
def insert_ventas(request):
    member = Ventas(
        pedido=request.POST.get('pedido'),
        nombre_id=request.POST.get('nombre'),
        SKU_id=request.POST.get('SKU'),
        precio_unitario=request.POST.get('precio_unitario'),
        cantidad=request.POST.get('cantidad'),
        venta_total=request.POST.get('venta_total'),
        flete=request.POST.get('flete'),
        factura_o_boleta=request.POST.get('factura_o_boleta'),
        fecha_boleta=request.POST.get('fecha_boleta'),
        pago=request.POST.get('pago')
    )
    member.save()
    return redirect('/')
'''
'''
@login_required
def insert_Inventario_Y_Stock(request):
    if request.method == 'POST':
        SKU_id = request.POST.get('SKU')
        nombre_prov_id = request.POST.get('nombre_prov')
        bodega = request.POST.get('bodega')
        fecha_de_ingreso = request.POST.get('fecha_de_ingreso')
        cantidad = request.POST.get('cantidad')
        salidas = request.POST.get('salidas')
        mov_bodegas = request.POST.get('mov_bodegas')
        stock = request.POST.get('stock')
        precio_unitario = request.POST.get('precio_unitario')
        precio_total = request.POST.get('precio_total')

        # Validar que todos los campos necesarios estén presentes
        if not all([SKU_id, nombre_prov_id, bodega, fecha_de_ingreso, cantidad, salidas, mov_bodegas, stock, precio_unitario, precio_total]):
            return render(request, 'Inventario_Y_Stock.html', {'error': 'Por favor, complete todos los campos'})

        try:
            # Obtener los objetos relacionados
            SKU = get_object_or_404(Producto, SKU=SKU_id)
            nombre_prov = get_object_or_404(Proveedores, nombre_prov=nombre_prov_id)

            # Crear el registro de inventario
            inventario = Inventario_Y_Stock.objects.create(
                SKU=SKU,
                nombre_prov=nombre_prov,
                bodega=bodega,
                fecha_de_ingreso=fecha_de_ingreso,
                cantidad=cantidad,
                salidas=salidas,
                mov_bodegas=mov_bodegas,
                stock=stock,
                precio_unitario=precio_unitario,
                precio_total=precio_total
            )

            return redirect('/Inventario_Y_Stock')
        except Producto.DoesNotExist:
            return render(request, 'Inventario_Y_Stock.html', {'error': 'Producto no encontrado'})
        except Proveedores.DoesNotExist:
            return render(request, 'Inventario_Y_Stock.html', {'error': 'Proveedor no encontrado'})
    else:
        return render(request, 'Inventario_Y_Stock.html')   
'''
#inserta un inventario y stock
@login_required
def insert_Inventario_Y_Stock(request):
    member = Inventario_Y_Stock(
        SKU_id=request.POST.get('SKU'),
        nombre_prov_id=request.POST.get('nombre_prov'),
        bodega=request.POST.get('bodega'),
        fecha_de_ingreso=request.POST.get('fecha_de_ingreso'),
        cantidad=request.POST.get('cantidad'),
        salidas=request.POST.get('salidas'),
        mov_bodegas=request.POST.get('mov_bodega'),
        stock=request.POST.get('stock'),
        precio_unitario=request.POST.get('precio_unitario'),
        precio_total=request.POST.get('precio_total'),
    )
    member.save()
    return redirect('/')

#borra un inventario y stock
@login_required
@require_POST
def delete_Inventario_Y_Stock(request, id_inventario):
    try:
        member = Inventario_Y_Stock.objects.get(id_inventario=id_inventario)
        member.delete()
        return JsonResponse({'status': 'success', 'message': 'Producto eliminado'})
    except Inventario_Y_Stock.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)

# COMPRA PROVEEDORES
#muestra las compras a proveedores
@login_required
def compra_proveedor(request):
    compra_proveedores = Compra_proveedores.objects.all()
    return render(request, 'compra_proveedor.html', {'compra_proveedores': compra_proveedores})
#inserta una compra a proveedores
@login_required
def insert_compra_proveedor(request): #inserta una compra a proveedores con metodo post
    if request.method == 'POST':
        OC = request.POST.get('OC')
        fecha_oc = request.POST.get('fecha_oc')
        SKU_id = request.POST.get('SKU')
        nombre_prov_id = request.POST.get('nombre_prov')
        cantidad = request.POST.get('cantidad')
        numero_factura = request.POST.get('numero_factura')
        fecha_factura = request.POST.get('fecha_factura')
        status = request.POST.get('status')
        fecha_vencimiento = request.POST.get('fecha_vencimiento')
        fecha_pago = request.POST.get('fecha_pago') or None
        costo_unitario = request.POST.get('costo_unitario')

        if not all([OC, fecha_oc, SKU_id, nombre_prov_id, cantidad, numero_factura, fecha_factura, status, fecha_vencimiento, costo_unitario]):
            return render(request, 'compra_proveedor.html', {'error': 'Por favor, complete todos los campos necesarios'})

        try:
            SKU = get_object_or_404(Producto, SKU=SKU_id)
            nombre_prov = get_object_or_404(Proveedores, nombre_prov=nombre_prov_id)

            compra_proveedor, created = Compra_proveedores.objects.get_or_create( 
                OC=OC,
                defaults={
                    'fecha_oc': fecha_oc,
                    'SKU': SKU,
                    'nombre_prov': nombre_prov,
                    'cantidad': cantidad,
                    'numero_factura': numero_factura,
                    'fecha_factura': fecha_factura,
                    'status': status,
                    'fecha_vencimiento': fecha_vencimiento,
                    'fecha_pago': fecha_pago,
                    'costo_unitario': costo_unitario
                }
            )

            if not created: #
                compra_proveedor.fecha_oc = fecha_oc
                compra_proveedor.SKU = SKU
                compra_proveedor.nombre_prov = nombre_prov
                compra_proveedor.cantidad = cantidad
                compra_proveedor.numero_factura = numero_factura
                compra_proveedor.fecha_factura = fecha_factura
                compra_proveedor.status = status
                compra_proveedor.fecha_vencimiento = fecha_vencimiento
                compra_proveedor.fecha_pago = fecha_pago
                compra_proveedor.costo_unitario = costo_unitario
                compra_proveedor.save()

            return redirect('/compra_proveedor')
        except Producto.DoesNotExist:
            return render(request, 'compra_proveedor.html', {'error': 'Producto no encontrado'})
        except Proveedores.DoesNotExist:
            return render(request, 'compra_proveedor.html', {'error': 'Proveedor no encontrado'})
    else:
        return render(request, 'compra_proveedor.html')

#borra una compra a proveedores
@login_required
@require_POST
def delete_compra_proveedor(request, OC):
    try:
        member = Compra_proveedores.objects.get(OC=OC)
        member.delete()
        return JsonResponse({'status': 'success', 'message': 'Producto eliminado'})
    except Compra_proveedores.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)

# CLIENTE
#muestra los clientes
@login_required
def cliente(request):
    clientes = Cliente.objects.all()
    return render(request, 'cliente.html', {'clientes': clientes})
#inserta un cliente
@login_required
def insert_cliente(request):
    member = Cliente(rut=request.POST.get('rut'), nombre=request.POST.get('nombre'), email=request.POST.get('email'), comuna=request.POST.get('comuna'), calle=request.POST.get('calle'), numero_de_casa=request.POST.get('numero_de_casa'), telefono=request.POST.get('telefono'))
    member.save()
    return redirect('/')
#borra un cliente
@login_required
@require_POST
def delete_cliente(request, rut):
    try:
        member = Cliente.objects.get(rut=rut)
        member.delete()
        return JsonResponse({'status': 'success', 'message': 'Producto eliminado'})
    except Cliente.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Producto no encontrado'}, status=404)
# muestra el navbar    
def navbar_view(request):
    notificaciones_activas = Alerta_stock.objects.all()
    return render(request, 'navbar.html', {'notificaciones_activas': notificaciones_activas})


def sync_woocommerce_view(request):
    if request.method == 'POST':
        SyncWoocomerce()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})