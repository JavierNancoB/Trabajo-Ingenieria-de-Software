from django.shortcuts import render, redirect, get_object_or_404
from.models import Producto
from.models import Proveedores
from.models import Alerta_stock
from.models import Inventario_Y_Stock
from.models import Ventas
#from.models import Alerta_informes
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView

# Vista para manejar el formulario de login
#class LoginView(LoginView):
 #   template_name = 'login.html'

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
    member = Proveedores(rut_empresa=request.POST.get('rut_empresa'), nombre_prov=request.POST.get('nombre_prov'), email_empresa=request.POST.get('email_empresa'), telefono_empresa=request.POST.get('telefono_empresa'))
    member.save()
    return redirect('/')

@login_required
def delete_proveedor(request, rut_empresa):
    member = Proveedores.objects.get(rut_empresa=rut_empresa)
    member.delete()
    return redirect('/proveedor')

# se crea la vista edit_producto, editamos desde>

# Alertas
@login_required
def notificaciones(request):
    alertas_stock = Alerta_stock.objects.all()  # Obtén todas las alertas
    return render(request, 'notificaciones.html', {'alertas_stock': alertas_stock})

"""@login_required
def insert_alerta_stock(request):
    if request.method == 'POST':
        id_inventario_id = request.POST.get('id_inventario')  # Cambiado a id_inventario
        fecha_alerta = request.POST.get('fecha_alerta')
        if id_inventario_id and fecha_alerta:  # Validación básica
            id_inventario = get_object_or_404(Inventario_Y_Stock, id_inventario=id_inventario_id)
            Alerta_stock.objects.create(id_inventario=id_inventario, fecha_alerta=fecha_alerta)
    member.save()        
    return redirect('/notificaciones')
    
    """
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

"""@login_required
def insert_alerta_informes(request):
    if request.method == 'POST':
        numero_boleta = request.POST.get('numero_boleta')
        fecha_alerta = request.POST.get('fecha_alerta')
        fecha_vencimiento = request.POST.get('fecha_vencimiento')
        if numero_boleta and fecha_alerta and fecha_vencimiento:  # Validación básica
            Alerta_informes.objects.create(numero_boleta=numero_boleta, fecha_alerta=fecha_alerta, fecha_vencimiento=fecha_vencimiento)
    return redirect('notificaciones')

@login_required
def delete_alerta_informes(request, numero_boleta):
    alerta_informes = get_object_or_404(Alerta_informes, numero_boleta=numero_boleta)
    alerta_informes.delete()
    return redirect('notificaciones')"""