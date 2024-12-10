from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from datetime import datetime
from django.utils import timezone
import random
from.models import *
from .sync import SyncWoocomerce 
import pandas as pd
from django.shortcuts import render, redirect
from django.contrib import messages

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

# Borrar una venta

@login_required
@require_POST
def delete_ventas(request, id):
    try:
        venta = Ventas.objects.get(id=id)
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

# INVENTARIO Y STOCK
#muestra el inventario y stock
@login_required
def inventario_Y_Stock(request):
    inventario_Y_stocks = Inventario_Y_Stock.objects.all()
    return render(request, 'Inventario_Y_Stock.html', {'inventario_Y_stocks': inventario_Y_stocks})

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

def upload_excel_productos(request):
    if request.method == "POST":
        excel_file = request.FILES.get('file')

        if excel_file:
            print("Archivo subido:", excel_file.name)
        else:
            print("No se subió ningún archivo")
            messages.error(request, 'No se ha seleccionado ningún archivo.')
            return redirect('producto')

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Renombrar las columnas del Excel para que coincidan con los campos del modelo
            df = df.rename(columns={
                'Producto': 'nombre_producto',
                'tipo': 'tipo_producto',
                'cepaje': 'cepa',
            })

            # Iterar sobre las filas del DataFrame y actualizar o crear objetos Producto
            for index, row in df.iterrows():
                Producto.objects.update_or_create(
                    SKU=row['SKU'],  # Busca por SKU
                    defaults={
                        'tipo_producto': row['tipo_producto'],
                        'cepa': row['cepa'],
                        'cosecha': row['cosecha'],
                        'nombre_producto': row['nombre_producto'],
                        'viña': row['viña']
                    }
                )

            # Agregar mensaje de éxito
            messages.success(request, 'Los productos se han subido correctamente.')
        except Exception as e:
            messages.error(request, f'Error al procesar el archivo: {str(e)}')
            print(f"Error al procesar el archivo: {str(e)}")

    return redirect('producto')

def upload_excel_proveedores(request):
    if request.method == "POST":
        excel_file = request.FILES.get('file')

        if not excel_file:
            messages.error(request, 'No se ha seleccionado ningún archivo.')
            return redirect('proveedor')

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Renombrar las columnas del Excel para que coincidan con los campos del modelo
            df = df.rename(columns={
                'Proveedor': 'nombre_prov',
                'Email': 'email_empresa',
                'Telefono': 'telefono_empresa',
            })

            # Variable para rastrear si hubo errores
            has_errors = False

            # Iterar sobre las filas del DataFrame y actualizar o crear objetos Proveedores
            for index, row in df.iterrows():
                # Validar si el proveedor está presente
                if pd.isna(row['nombre_prov']):
                    messages.error(request, f'Proveedor vacío en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Validar si los otros campos clave están presentes (por ejemplo, email)
                if pd.isna(row['email_empresa']) or pd.isna(row['telefono_empresa']):
                    messages.warning(request, f'Email o teléfono vacíos en la fila {index + 1}. Se asignarán valores nulos.')

                # Intentar actualizar o crear el proveedor
                try:
                    Proveedores.objects.update_or_create(
                        nombre_prov=row['nombre_prov'],  # Busca por nombre_prov
                        defaults={
                            'email_empresa': row.get('email_empresa'),
                            'telefono_empresa': row.get('telefono_empresa'),
                        }
                    )
                except Exception as e:
                    messages.error(request, f'Error en la fila {index + 1}: {str(e)}')
                    has_errors = True
                    continue

            # Si no hubo errores, mostrar mensaje de éxito
            if not has_errors:
                messages.success(request, 'Los proveedores se han subido correctamente.')
        except Exception as e:
            messages.error(request, f'Error al procesar el archivo: {str(e)}')
            print(f"Error al procesar el archivo: {str(e)}")

    return redirect('proveedor')

def upload_excel_clientes(request):
    if request.method == "POST":
        excel_file = request.FILES.get('file')

        if not excel_file:
            messages.error(request, 'No se ha seleccionado ningún archivo.')
            return redirect('cliente')

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Renombrar las columnas del Excel para que coincidan con los campos del modelo
            df = df.rename(columns={
                'Rut': 'rut',
                'Nombre': 'nombre',
                'Email': 'email',
                'Comuna': 'comuna',
                'Calle': 'calle',
                'Numero': 'numero_de_casa',
                'Telefono': 'telefono',
            })

            # Variable para rastrear si hubo errores
            has_errors = False

            # Iterar sobre las filas del DataFrame y actualizar o crear objetos Cliente
            for index, row in df.iterrows():
                # Validar si el RUT está presente
                if pd.isna(row['rut']):
                    messages.error(request, f'RUT vacío en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Validar si los otros campos clave están presentes (por ejemplo, email)
                if pd.isna(row['email']) or pd.isna(row['telefono']):
                    messages.warning(request, f'Email o teléfono vacíos en la fila {index + 1}. Se asignarán valores nulos.')

                # Intentar actualizar o crear el cliente
                try:
                    Cliente.objects.update_or_create(
                        rut=row['rut'],  # Busca por RUT
                        defaults={
                            'nombre': row.get('nombre'),
                            'email': row.get('email'),
                            'comuna': row.get('comuna'),
                            'calle': row.get('calle'),
                            'numero_de_casa': row.get('numero_de_casa'),
                            'telefono': row.get('telefono'),
                        }
                    )
                except Exception as e:
                    messages.error(request, f'Error en la fila {index + 1}: {str(e)}')
                    has_errors = True
                    continue

            # Si no hubo errores, mostrar mensaje de éxito
            if not has_errors:
                messages.success(request, 'Los clientes se han subido correctamente.')
        except Exception as e:
            messages.error(request, f'Error al procesar el archivo: {str(e)}')
            print(f"Error al procesar el archivo: {str(e)}")

    return redirect('cliente')

def procesar_fecha(fecha):
    meses = {
        'ene': 1, 'feb': 2, 'mar': 3, 'abr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'ago': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dic': 12
    }
    
    if pd.isna(fecha):
        return None
    
    # Caso 1: Si el formato ya es fecha, retornamos la fecha
    try:
        return pd.to_datetime(fecha, format='%d-%m-%Y', errors='raise').date()
    except:
        pass

    # Caso 2: Manejar días o meses en formato corto (ejemplo: 1-2-24)
    try:
        return pd.to_datetime(fecha, format='%d-%m-%y', errors='raise').date()
    except:
        pass

    # Caso 3: Manejar meses escritos como texto (Ej: Ene, Feb)
    fecha_str = str(fecha).strip().lower()
    if fecha_str in meses:
        year = datetime.now().year
        return datetime(year, meses[fecha_str], 1).date()

    raise ValueError(f"Formato de fecha inválido: {fecha}")

import pandas as pd
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Ventas, Cliente, Producto

@login_required
def upload_excel_ventas(request):
    if request.method == "POST":
        excel_file = request.FILES.get('file')

        if not excel_file:
            messages.error(request, 'No se ha seleccionado ningún archivo.')
            return redirect('venta')

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Renombrar las columnas del Excel para que coincidan con los campos del modelo
            df = df.rename(columns={
                'Pedido': 'pedido',
                'Rut': 'rut',
                'SKU': 'SKU',
                'Precio unitario': 'precio_unitario',
                'Cantidad': 'cantidad',
                'Venta total': 'venta_total',
                'Flete': 'flete',
                'Factura o boleta': 'factura_o_boleta',
                'Fecha boleta': 'fecha_boleta',
                'Pago': 'pago',
            })

            # Variable para rastrear si hubo errores
            has_errors = False

            # Iterar sobre las filas del DataFrame y crear objetos Ventas
            for index, row in df.iterrows():
                # Validar si los campos clave están presentes (como el RUT del cliente y SKU)
                if pd.isna(row['rut']) or pd.isna(row['SKU']):
                    messages.error(request, f'Cliente (RUT) o SKU vacíos en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Intentar obtener o crear el cliente y el producto
                cliente, created_cliente = Cliente.objects.get_or_create(
                    rut=row['rut'],  # Busca por RUT
                    defaults={'nombre': 'Nombre no proporcionado'}  # Proporcionar un nombre por defecto o adecuar según el modelo
                )

                producto, created_prod = Producto.objects.get_or_create(
                    SKU=row['SKU'],  # Busca por SKU
                    defaults={'nombre_producto': 'Producto no especificado'}  # Proporcionar un nombre por defecto o adecuar según el modelo
                )

                # Procesar la fecha de boleta si está presente
                fecha_boleta = pd.to_datetime(row['fecha_boleta'], errors='coerce')
                if pd.isnull(fecha_boleta):
                    messages.error(request, f"Error con la fecha en la fila {index + 1}.")
                    has_errors = True
                    continue

                # Crear la venta
                venta = Ventas.objects.create(
                    pedido=row['pedido'],
                    rut=cliente,
                    SKU=producto,
                    precio_unitario=row['precio_unitario'],
                    cantidad=row['cantidad'],
                    venta_total=row['venta_total'],
                    flete=row['flete'],
                    factura_o_boleta=row['factura_o_boleta'],
                    fecha_boleta=fecha_boleta,
                    pago=row['pago'],
                )

            # Si no hubo errores, mostrar mensaje de éxito
            if not has_errors:
                messages.success(request, 'Las ventas se han subido correctamente.')
        except Exception as e:
            messages.error(request, f'Error al procesar el archivo: {str(e)}')

    return redirect('venta')


def upload_excel_compra_proveedores(request):
    if request.method == "POST":
        excel_file = request.FILES.get('file')

        if not excel_file:
            messages.error(request, 'No se ha seleccionado ningún archivo.')
            return redirect('Compra_proveedores')

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Renombrar las columnas del Excel para que coincidan con los campos del modelo
            df = df.rename(columns={
                'OC': 'OC',
                'Fecha OC': 'fecha_oc',
                'SKU': 'SKU',
                'Proveedor': 'nombre_prov',
                'Cantidad': 'cantidad',
                'Numero factura': 'numero_factura',
                'Fecha factura': 'fecha_factura',
                'Status': 'status',
                'Fecha vencimiento': 'fecha_vencimiento',
                'Fecha pago': 'fecha_pago',
                'Costo unitario': 'costo_unitario',
            })

            # Variable para rastrear si hubo errores
            has_errors = False

            # Iterar sobre las filas del DataFrame y crear o actualizar objetos Compra_proveedores
            for index, row in df.iterrows():
                # Validar si los campos clave están presentes (como el proveedor y SKU)
                if pd.isna(row['nombre_prov']) or pd.isna(row['SKU']):
                    messages.error(request, f'Proveedor o SKU vacíos en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Validar y normalizar el campo status
                status = str(row['status']).lower()  # Convertir a minúsculas
                if status not in ['pendiente', 'pagada']:
                    messages.error(request, f"Estatus inválido en la fila {index + 1}. Debe ser 'pendiente' o 'pagada'.")
                    has_errors = True
                    continue

                # Procesar las fechas al formato correcto
                fecha_oc_procesada = procesar_fecha(row['fecha_oc'])
                fecha_factura_procesada = procesar_fecha(row['fecha_factura'])
                fecha_vencimiento_procesada = procesar_fecha(row['fecha_vencimiento'])

                # Validar que las fechas sean correctas
                if not fecha_oc_procesada or not fecha_factura_procesada or not fecha_vencimiento_procesada:
                    messages.error(request, f'Fecha inválida en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Intentar obtener o crear el proveedor
                proveedor, created_prov = Proveedores.objects.get_or_create(
                    nombre_prov=row['nombre_prov'],
                    defaults={'email_empresa': None, 'telefono_empresa': None}
                )

                # Intentar obtener o crear el producto
                producto, created_prod = Producto.objects.get_or_create(
                    SKU=row['SKU'],
                    defaults={
                        'tipo_producto': None,
                        'cepa': None,
                        'cosecha': None,
                        'nombre_producto': None,
                        'viña': None
                    }
                )

                # Crear o actualizar la compra
                Compra_proveedores.objects.update_or_create(
                    OC=row['OC'],
                    defaults={
                        'fecha_oc': fecha_oc_procesada,
                        'SKU': producto,
                        'nombre_prov': proveedor,
                        'cantidad': row['cantidad'],
                        'numero_factura': row['numero_factura'],
                        'fecha_factura': fecha_factura_procesada,
                        'status': status,
                        'fecha_vencimiento': fecha_vencimiento_procesada,
                        'fecha_pago': procesar_fecha(row['fecha_pago']),
                        'costo_unitario': row['costo_unitario'],
                    }
                )

            # Si no hubo errores, mostrar mensaje de éxito
            if not has_errors:
                messages.success(request, 'Las compras a proveedores se han subido correctamente.')
        except Exception as e:
            messages.error(request, f'Error al procesar el archivo: {str(e)}')
            print(f"Error al procesar el archivo: {str(e)}")

    return redirect('Compra_proveedores')

def upload_excel_inventario(request):
    if request.method == "POST":
        excel_file = request.FILES.get('file')

        if not excel_file:
            messages.error(request, 'No se ha seleccionado ningún archivo.')
            return redirect('Inventario_Y_Stock')

        try:
            # Leer el archivo Excel usando pandas
            df = pd.read_excel(excel_file)

            # Renombrar las columnas del Excel para que coincidan con los campos del modelo
            df = df.rename(columns={
                'SKU': 'SKU',
                'Proveedor': 'nombre_prov',
                'Bodega': 'bodega',
                'Fecha de ingreso': 'fecha_de_ingreso',
                'Cantidad': 'cantidad',
                'Salidas': 'salidas',
                'Mov bodegas': 'mov_bodegas',
                'Stock': 'stock',
                'Precio unitario': 'precio_unitario',
                'Precio total': 'precio_total',
            })

            # Variable para rastrear si hubo errores
            has_errors = False

            # Iterar sobre las filas del DataFrame y actualizar o crear objetos Inventario_Y_Stock
            for index, row in df.iterrows():
                # Validar si los campos clave están presentes (como el proveedor y SKU)
                if pd.isna(row['nombre_prov']) or pd.isna(row['SKU']):
                    messages.error(request, f'Proveedor o SKU vacíos en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Intentar obtener o crear el proveedor
                proveedor, created_prov = Proveedores.objects.get_or_create(
                    nombre_prov=row['nombre_prov'],  # Busca por nombre_prov
                    defaults={'email_empresa': None, 'telefono_empresa': None}  # Datos por defecto si no existe
                )

                # Intentar obtener o crear el producto
                producto, created_prod = Producto.objects.get_or_create(
                    SKU=row['SKU'],  # Busca por SKU
                    defaults={
                        'tipo_producto': None,
                        'cepa': None,
                        'cosecha': None,
                        'nombre_producto': None,
                        'viña': None
                    }
                )

                # Si se creó un nuevo proveedor o producto, indicarlo en los logs o mensajes
                if created_prov:
                    print(f"Proveedor '{row['nombre_prov']}' creado con datos nulos.")
                if created_prod:
                    print(f"Producto (SKU) '{row['SKU']}' creado con datos nulos.")

                # Procesar la fecha de ingreso
                fecha_ingreso_procesada = procesar_fecha(row['fecha_de_ingreso'])

                if not fecha_ingreso_procesada:
                    messages.error(request, f'Fecha inválida en la fila {index + 1}. Verifica el archivo.')
                    has_errors = True
                    continue

                # Crear o actualizar el inventario
                Inventario_Y_Stock.objects.update_or_create(
                    SKU=producto,  # Relacionar con el producto creado u obtenido
                    nombre_prov=proveedor,  # Relacionar con el proveedor creado u obtenido
                    defaults={
                        'bodega': row['bodega'],
                        'fecha_de_ingreso': fecha_ingreso_procesada,
                        'cantidad': row['cantidad'],
                        'salidas': row['salidas'],
                        'mov_bodegas': row['mov_bodegas'],
                        'stock': row['stock'],
                        'precio_unitario': row['precio_unitario'],
                        'precio_total': row['precio_total'],
                    }
                )

            # Si no hubo errores, mostrar mensaje de éxito
            if not has_errors:
                messages.success(request, 'El inventario se ha subido correctamente.')
        except Exception as e:
            messages.warning(request, f'Error al procesar el archivo: {str(e)}')
            print(f"Error al procesar el archivo: {str(e)}")

    return redirect('Inventario_Y_Stock')
