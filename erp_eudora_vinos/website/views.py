from django.shortcuts import render, redirect
from.models import Producto
from.models import Proveedores
from.models import Cliente
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

@login_required
def cliente(request):
    clientes = Cliente.objects.all()
    return render(request, 'cliente.html', {'clientes': clientes})

@login_required
def insert_cliente(request):
    member = Cliente(rut=request.POST.get('rut'), nombre=request.POST.get('nombre'), apellido=request.POST.get('apellido'), email=request.POST.get('email'), comuna=request.POST.get('comuna'), calle=request.POST.get('calle'), numero_de_casa=request.POST.get('numero_de_casa'), telefono=request.POST.get('telefono'))
    member.save()
    return redirect('/')

@login_required
def delete_cliente(request, rut):
    member = Cliente.objects.get(rut=rut)
    member.delete()
    return redirect('/cliente')