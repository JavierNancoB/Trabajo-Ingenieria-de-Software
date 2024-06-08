from django.core import serializers
from django.http import JsonResponse
from  django.views.decorators.csrf import csrf_exempt

from .models import Producto
from .models import Proveedores
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