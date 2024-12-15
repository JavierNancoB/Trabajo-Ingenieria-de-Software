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
import pandas as pd

# api para obtener todos los productos

# PRODUCTOS
def get_product_skus(request):
    skus = list(Producto.objects.values_list('SKU', flat=True))
    return JsonResponse({'skus': skus})

def get_proveedor_nombre(request):
    nombres = list(Proveedores.objects.values_list('nombre_prov', flat=True))
    return JsonResponse({'nombres': nombres})

def get_cliente_rut(request):
    ruts = list(Cliente.objects.values_list('rut', flat=True))
    return JsonResponse({'ruts': ruts})

#api que guarda un producto en la base de datos 
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
#api que guarda un proveedor en la base de datos
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
#api que guarda una alerta de stock en la base de datos
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
#api que guarda una venta en la base de datos
@csrf_exempt
def guardarventa(request):
    # Se recibe el ID del registro específico en lugar de 'pedido'
    id = request.POST.get('id', '')  # Asumiendo que se envía el 'id' desde el cliente
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        # Encuentra la venta por ID en lugar de por 'pedido'
        venta = Ventas.objects.get(id=id)
        if type == 'precio_unitario':
            venta.precio_unitario = value
        elif type == 'cantidad':
            venta.cantidad = value
        elif type == 'venta_total':
            venta.venta_total = value
        elif type == 'flete':
            venta.flete = value
        elif type == 'fecha_boleta':
            # Asegúrate de convertir correctamente la fecha
            try:
                venta.fecha_boleta = pd.to_datetime(value, errors='coerce')
                if pd.isnull(venta.fecha_boleta):
                    raise ValueError("Invalid date format")
            except ValueError as e:
                return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
        elif type == 'factura_o_boleta':
            venta.factura_o_boleta = value
        elif type == 'pago':
            venta.pago = value

        venta.save()
        return JsonResponse({'status': 'Updated'})
    except Ventas.DoesNotExist:
        return JsonResponse({'status': 'Venta not found'}, status=404)

    
# Inventario_Y_Stock
#api que guarda un inventario en la base de datos
@csrf_exempt
def guardar_Inventario_Y_Stock(request):
    id_inventario = request.POST.get('id_inventario', '')  # ID del inventario como cadena
    type = request.POST.get('type', '')  # Tipo de actualización
    value = request.POST.get('value', '')  # Valor recibido como cadena

    try:
        inventario_y_stock = Inventario_Y_Stock.objects.get(id_inventario=id_inventario)
        if type == 'cantidad':
            inventario_y_stock.cantidad = value
        elif type == 'salidas':
            inventario_y_stock.salidas = value
        elif type == 'mov_bodegas':
            inventario_y_stock.mov_bodegas = value
        elif type == 'stock':
            inventario_y_stock.stock = value
        elif type == 'precio_unitario':
            inventario_y_stock.precio_unitario = value
        elif type == 'precio_total':
            inventario_y_stock.precio_total = value

        # Guardar cambios en la base de datos
        inventario_y_stock.save()

        return JsonResponse({'status': 'Updated'})
    except Inventario_Y_Stock.DoesNotExist:
        return JsonResponse({'status': 'Product not found'}, status=404)
    
# COMPRA A PROVEEDORES
#api que guarda una compra a proveedores en la base de datos
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
#api que guarda un cliente en la base de datos    
def guardar_cliente(request):
    rut = request.POST.get('rut','')
    type = request.POST.get('type', '')
    value = request.POST.get('value', '')

    try:
        cliente = Cliente.objects.get(rut=rut)
        if type == 'nombre':
            cliente.nombre = value

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

#api que guarda inventario y stock en la base de datos
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
        elif type == 'mov_bodega':
            inventario.mov_bodegas = value
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