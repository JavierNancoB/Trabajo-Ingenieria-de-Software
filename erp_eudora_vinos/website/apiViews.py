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
        inventario = Inventario_Y_Stock.objects.get(SKU=sku)  # Cambiar el nombre de la variable a `inventario`
        if type == 'nombre_prov':
            inventario.nombre_prov = value
        elif type == 'cepa':
            inventario.cepa = value
        elif type == 'cosecha':
            inventario.cosecha = value
        elif type == 'nombre_producto':
            inventario.nombre_producto = value
        elif type == 'viña':
            inventario.viña = value
        
        elif type == 'bodega':
            inventario.bodega = value
        elif type == 'fecha_de_ingreso':
            inventario.fecha_de_ingreso = value
        elif type == 'cantidad': #ingreso
            inventario.cantidad = value
        elif type == 'salidas': 
            inventario.salidas = value
        elif type == 'mov_bodegas':
            inventario.mov_bodega = value
        elif type == 'stock':
            inventario.stock = value
        elif type == 'precio_unitario':
            inventario.precio_unitario = value
        elif type == 'precio_total':
            inventario.precio_total = value
        
        

        inventario.save()
        return JsonResponse({'status': 'Updated'})
    except Inventario_Y_Stock.DoesNotExist:
        return JsonResponse({'status': 'Stock not found'}, status=404)