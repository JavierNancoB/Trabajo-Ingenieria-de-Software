from django.core import serializers
from django.http import JsonResponse
from  django.views.decorators.csrf import csrf_exempt
#from .models import Alerta_informes
from .models import Alerta_stock
from .models import Producto
from .models import Proveedores
from .models import Ventas
from .models import Inventario_Y_Stock

# api para obtener todos los productos

# PRODUCTOS

@csrf_exempt
def guardarproducto(request):
    sku = request.POST.get('SKU', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        producto = Producto.objects.get(SKU=sku)
        if type == 'tipo_producto':
            producto.tipo_producto = value
        elif type == 'viña':
            producto.viña = value
        elif type == 'cepa':
            producto.cepa = value
        elif type == 'nombre_producto':
            producto.nombre_producto = value
        elif type == 'cosecha':
            producto.cosecha = value

        producto.save()
        return JsonResponse({'status': 'Updated'})
    except Producto.DoesNotExist:
        return JsonResponse({'status': 'Product not found'}, status=404)
    

# PROVEEDORES

@csrf_exempt
def guardarproveedor(request):
    rut_empresa = request.POST.get('rut_empresa', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        proveedor = Proveedores.objects.get(rut_empresa=rut_empresa)
        if type == 'nombre_prov':
            proveedor.nombre_prov = value
        elif type == 'email_empresa':
            proveedor.email_empresa = value
        elif type == 'telefono_empresa':
            proveedor.telefono_empresa = value

        proveedor.save()
        return JsonResponse({'status': 'Updated'})
    except Proveedores.DoesNotExist:
        return JsonResponse({'status': 'Provider not found'}, status=404)
    
#ALERTAS 
@csrf_exempt
def guardar_alerta_stock(request):
    if request.method == 'POST':
        sku = request.POST.get('SKU', '')
        fecha_alerta = request.POST.get('fecha_alerta', '')
        cantidad = request.POST.get('cantidad', '')

        try:
            alerta_stock = Alerta_stock.objects.get(SKU=sku)
            alerta_stock.fecha_alerta = fecha_alerta
            alerta_stock.cantidad = cantidad
            alerta_stock.save()
            return JsonResponse({'status': 'Alerta de stock actualizada'})
        except Alerta_stock.DoesNotExist:
            alerta_stock = Alerta_stock(SKU=sku, fecha_alerta=fecha_alerta, cantidad=cantidad)
            alerta_stock.save()
            return JsonResponse({'status': 'Alerta de stock creada'}, status=201)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

"""@csrf_exempt
def guardar_alerta_informes(request):
    if request.method == 'POST':
        numero_boleta = request.POST.get('numero_boleta', '')
        fecha_alerta = request.POST.get('fecha_alerta', '')
        fecha_vencimiento = request.POST.get('fecha_vencimiento', '')

        try:
            alerta_informes = Alerta_informes.objects.get(numero_boleta=numero_boleta)
            alerta_informes.fecha_alerta = fecha_alerta
            alerta_informes.fecha_vencimiento = fecha_vencimiento
            alerta_informes.save()
            return JsonResponse({'status': 'Alerta de informes actualizada'})
        except Alerta_informes.DoesNotExist:
            alerta_informes = Alerta_informes(numero_boleta=numero_boleta, fecha_alerta=fecha_alerta, fecha_vencimiento=fecha_vencimiento)
            alerta_informes.save()
            return JsonResponse({'status': 'Alerta de informes creada'}, status=201)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
"""
# VENTAS
@csrf_exempt
def guardarventa(request):
    sku = request.POST.get('SKU', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        venta = venta.objects.get(SKU=sku)
        if type == 'medio_de_pago':
            venta.medio_de_pago = value
        elif type == 'nombre_producto':
            venta.nombre_producto = value
        elif type == 'precio_unitario':
            venta.precio_unitario = value
        elif type == 'cantidad':
            venta.cantidad = value
        elif type == 'iva':
            venta.iva = value

        venta.save()
        return JsonResponse({'status': 'Updated'})
    except venta.DoesNotExist:
        return JsonResponse({'status': 'Sells not found'}, status=404)
    

    
# Inventario_Y_Stock

@csrf_exempt
def guardar_Inventario_Y_Stock(request):
    sku = request.POST.get('SKU', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        Inventario_Y_Stock= Inventario_Y_Stock.objects.get(SKU=sku)
        if type == 'nombre_producto':
            Inventario_Y_Stock.nombre_producto = value
        elif type == 'cantidad':
            Inventario_Y_Stock.cantidad = value
        elif type == 'precio_unitario':
            Inventario_Y_Stock.precio_unitario = value
        elif type == 'fecha_de_ingreso':
            Inventario_Y_Stock.fecha_de_ingreso = value
        elif type == 'venta':
            Inventario_Y_Stock.venta = value

        Inventario_Y_Stock.save()
        return JsonResponse({'status': 'Updated'})
    except Inventario_Y_Stock.DoesNotExist:
        return JsonResponse({'status': 'Stock not found'}, status=404)