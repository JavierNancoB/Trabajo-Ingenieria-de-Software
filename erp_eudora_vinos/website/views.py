from django.shortcuts import render, redirect
from.models import Producto
from.models import Proveedores
from. models import Inventario_Y_Stock
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView

from django.http import JsonResponse

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
    
# Inventario_Y_Stock

@login_required
def inventario_Y_Stock(request):
    inventario_Y_stocks = Inventario_Y_Stock.objects.all()
    return render(request, 'Inventario_Y_Stock.html', {'inventario_Y_stocks': inventario_Y_stocks})
"""

"""


@login_required
def insert_Inventario_Y_Stock(request):
    if request.method == 'POST':
        SKU = request.POST.get('SKU')
        nombre_prov = request.POST.get('nombre_prov')
        cepa = request.POST.get('cepa')
        cosecha = request.POST.get('cosecha')
        nombre_producto = request.POST.get('nombre_producto')
        viña = request.POST.get('viña')
        bodega = request.POST.get('bodega')
        fecha_de_ingreso = request.POST.get('fecha_de_ingreso')
        cantidad = request.POST.get('cantidad')
        salidas = request.POST.get('salidas')
        mov_bodegas = request.POST.get('mov_bodegas')
        stock = request.POST.get('stock')
        precio_unitario = request.POST.get('precio_unitario')
        precio_total = request.POST.get('precio_total')
        
        


        if all([SKU, nombre_prov, cepa, cosecha, nombre_producto, viña, bodega, fecha_de_ingreso, cantidad, salidas, mov_bodegas, stock, precio_unitario, precio_total]):
            try:
                producto = Producto.objects.get(SKU=SKU)
                member = Inventario_Y_Stock(
                    
                    SKU=producto,
                    nombre_prov=nombre_prov,
                    cepa=cepa,
                    cosecha=cosecha,
                    nombre_producto=nombre_producto,
                    viña=viña,
                    bodega=bodega,
                    fecha_de_ingreso=fecha_de_ingreso,
                    cantidad=cantidad,
                    salidas=salidas,
                    mov_bodegas=mov_bodegas,
                    stock=stock,
                    precio_unitario=precio_unitario,
                    precio_total=precio_total
                    
                )
                member.save()
                return redirect('/Inventario_Y_Stock')
            except Producto.DoesNotExist:
                return render(request, 'Inventario_Y_Stock.html', {'error': 'Producto no encontrado'})
        else:
            return render(request, 'Inventario_Y_Stock.html', {'error': 'Por favor no deje campos vacíos'})
    else:
        return render(request, 'Inventario_Y_Stock.html')

@login_required
def delete_Inventario_Y_Stock(request, SKU):
    member = Inventario_Y_Stock.objects.get(SKU=SKU)
    member.delete()
    return redirect('/Inventario_Y_Stock')