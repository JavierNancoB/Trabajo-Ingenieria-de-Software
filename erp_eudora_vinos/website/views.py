from django.shortcuts import render, redirect, get_object_or_404
from.models import Producto
from.models import Proveedores
from.models import Alerta_stock
from.models import Inventario_Y_Stock
from.models import Ventas
#from.models import Alerta_informes
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
import datetime
from django.utils import timezone


@login_required
def home(request):
    return render(request, 'home.html')

# PRODUCTOS

@login_required
def producto(request):
    productos = Producto.objects.all()
    return render(request, 'producto.html', {'productos': productos})


@login_required
def insert_producto(request):
    member = Producto(SKU=request.POST.get('SKU'), tipo_producto=request.POST.get('tipo_producto'), viña=request.POST.get('viña'), cepa=request.POST.get('cepa'), nombre_producto=request.POST.get('nombre_producto'), cosecha=request.POST.get('cosecha'))
    member.save()
    return redirect('/')

@login_required
def delete_producto(request, SKU):
    member = Producto.objects.get(SKU=SKU)
    member.delete()
    return redirect('/producto')

# PROVEEDORES

@login_required
def proveedor(request):
    proveedores = Proveedores.objects.all()
    return render(request, 'proveedores.html', {'proveedores': proveedores})

@login_required
def insert_proveedor(request):
    member = Proveedores(
                         rut_empresa=request.POST.get('rut_empresa'), 
                         nombre_prov=request.POST.get('nombre_prov'), 
                         email_empresa=request.POST.get('email_empresa'), 
                         telefono_empresa=request.POST.get('telefono_empresa')
                         )
    member.save()
    return redirect('/')

@login_required
def delete_proveedor(request, rut_empresa):
    member = Proveedores.objects.get(rut_empresa=rut_empresa)
    member.delete()
    return redirect('/proveedor')

# ventas

@login_required
def ventas(request):
    ventas = Ventas.objects.all()
    return render(request, 'ventas.html', {'ventas': ventas})

@login_required
def insert_ventas(request):
    if request.method == 'POST':
        SKU = request.POST.get('SKU')
        medio_de_pago = request.POST.get('medio_de_pago')
        nombre_producto = request.POST.get('nombre_producto')
        precio_unitario = request.POST.get('precio_unitario')
        cantidad = request.POST.get('cantidad')
        iva = request.POST.get('iva')
        numero_boleta = request.POST.get('numero_boleta')
        if SKU and medio_de_pago and nombre_producto and precio_unitario and cantidad and iva and numero_boleta:
                producto = Producto.objects.get(SKU=SKU)
                member = Ventas(
                    SKU=producto,
                    medio_de_pago=medio_de_pago,
                    nombre_producto=nombre_producto,
                    precio_unitario=precio_unitario,
                    cantidad=cantidad,
                    iva=iva,
                    numero_boleta=numero_boleta
                )
                member.save()
                return redirect('/venta')

@login_required
def delete_ventas(request, SKU):
    member = Ventas.objects.get(SKU=SKU)
    member.delete()
    return redirect('/venta')


# Alertas
@login_required
def notificaciones(request):
    alertas_stock = Alerta_stock.objects.all()  # Obtén todas las alertas
    #alertas_informe= Alerta_informes.objects.all() # Obtén todas las alertas
    return render(request, 'notificaciones.html', {'alertas_stock': alertas_stock}) 
# Alertas de stock
@login_required
def insert_alerta_stock(request):
    if request.method == 'POST':
        id_inventario = request.POST.get('id_inventario')
        fecha_alerta = request.POST.get('fecha_alerta')
        if id_inventario and fecha_alerta :
                alerta = Inventario_Y_Stock.objects.get(id_inventario=id_inventario)
                member = Alerta_stock(
                    id_inventario=alerta,
                    fecha_alerta=fecha_alerta
                )
                member.save()
                return redirect('/notificaciones')

@login_required
def delete_alerta_stock(request, id_inventario):
    alerta_stock = get_object_or_404(Alerta_stock, id_inventario=id_inventario)
    alerta_stock.delete()
    return redirect('notificaciones')

#extra 
@login_required
def navbar_view(request):
    fecha_limite = timezone.now().date() - datetime.timedelta(days=7)
    notificaciones_activas = Alerta_stock.objects.filter(fecha_alerta__gte=fecha_limite)
    return render(request, 'navbar.html', {'notificaciones_activas': notificaciones_activas})