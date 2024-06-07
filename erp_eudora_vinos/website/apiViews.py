from django.core import serializers
from django.http import JsonResponse
from  django.views.decorators.csrf import csrf_exempt

from .models import Producto
from .models import Proveedores
from .models import Ventas

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
    
