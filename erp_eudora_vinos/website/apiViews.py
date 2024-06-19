from django.core import serializers
from django.http import JsonResponse
from  django.views.decorators.csrf import csrf_exempt
#from .models import Alerta_informes
from .models import Alerta_stock, Compra_proveedores
from .models import Producto
from .models import Proveedores
from .models import Cliente
from .models import Ventas
from .models import Inventario_Y_Stock
from django.shortcuts import get_object_or_404

# api para obtener todos los productos

# PRODUCTOS
def get_product_skus(request):
    skus = list(Producto.objects.values_list('SKU', flat=True))
    return JsonResponse({'skus': skus})

def get_proveedor_nombre(request):
    nombres = list(Proveedores.objects.values_list('nombre_prov', flat=True))
    return JsonResponse({'nombres': nombres})

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
    nombre_prov = request.POST.get('nombre_prov', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        proveedor = Proveedores.objects.get(nombre_prov=nombre_prov)
        if type == 'email_empresa':
            proveedor.email_empresa = value
        elif type == 'telefono_empresa':
            proveedor.telefono_empresa = value

        proveedor.save()
        return JsonResponse({'status': 'Updated'})
    except Proveedores.DoesNotExist:
        return JsonResponse({'status': 'Provider not found'}, status=404)
    
#ALERTAS STOCK
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




# VENTAS
@csrf_exempt
def guardarventa(request):
    sku = request.POST.get('SKU', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        venta = Ventas.objects.get(SKU=sku)
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
        inventario_Y_Stock= Inventario_Y_Stock.objects.get(SKU=sku)
        if type == 'nombre_producto':
            inventario_Y_Stock.nombre_producto = value
        elif type == 'cantidad':
            inventario_Y_Stock.cantidad = value
        elif type == 'precio_unitario':
            inventario_Y_Stock.precio_unitario = value
        elif type == 'fecha_de_ingreso':
            inventario_Y_Stock.fecha_de_ingreso = value
        elif type == 'venta':
            inventario_Y_Stock.venta = value

        Inventario_Y_Stock.save()
        return JsonResponse({'status': 'Updated'})
    except Inventario_Y_Stock.DoesNotExist:
        return JsonResponse({'status': 'Stock not found'}, status=404)
    
# COMPRA A PROVEEDORES

@csrf_exempt
def guardar_compra_proveedor(request):
    oc = request.POST.get('OC', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        compra_proveedor = Compra_proveedores.objects.get(OC=oc)
        if type == 'fecha_oc':
            compra_proveedor.fecha_oc = value
        elif type == 'nombre_prov':
            compra_proveedor.nombre_prov = value
        elif type == 'cantidad':
            compra_proveedor.cantidad = value
        elif type == 'numero_factura':
            compra_proveedor.numero_factura = value
        elif type == 'fecha_factura':
            compra_proveedor.fecha_factura = value
        elif type == 'status':
            compra_proveedor.status= value
        elif type == 'fecha_vencimiento':
            compra_proveedor.fecha_vencimiento = value
        elif type == 'fecha_pago':
            compra_proveedor.fecha_pago = value
        elif type == 'costo_unitario':
            compra_proveedor.costo_unitario = value

        if not oc:
            return JsonResponse({'status': 'OC no puede estar vacío.'}, status=400)
    
        try:
            oc = int(oc)
        except ValueError:
            return JsonResponse({'status': 'OC debe ser un número entero válido.'}, status=400)


        compra_proveedor.save()
        return JsonResponse({'status': 'Updated'})
    except Compra_proveedores.DoesNotExist:
        return JsonResponse({'status': 'Product not found'}, status=404)
    
def guardar_cliente(request):
    rut = request.POST.get('rut','')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        cliente = Cliente.objects.get(rut=rut)
        if type == 'nombre':
            cliente.nombre = value
        elif type == 'apellido':
            cliente.apellido = value
        elif type == 'email':
            cliente.email = value
        elif type == 'comuna':
            cliente.comuna = value
        elif type == 'calle':
            cliente.calle = value
        elif type == 'numero_de_casa':
            cliente.numero_de_casa = value
        elif type == 'telefono':
            cliente.telefono = value

        cliente.save()
        return JsonResponse({'status': 'Updated'})
    except Cliente.DoesNotExist:
        return JsonResponse({'status': 'Client not found'}, status=404)

@csrf_exempt
def guardar_Inventario_Y_Stock(request):
    id_inventario = request.POST.get('id_inventario', '')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        inventario = Inventario_Y_Stock.objects.get(id_inventario=id_inventario)  # Cambiar el nombre de la variable a `inventario`
        if type == 'bodega':
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