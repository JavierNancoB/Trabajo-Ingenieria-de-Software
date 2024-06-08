from django.shortcuts import render, redirect
from.models import Producto
from.models import Proveedores
from.models import Ventas
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView


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

        if all([SKU, medio_de_pago, nombre_producto, precio_unitario, cantidad, iva]):
            try:
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
            except Producto.DoesNotExist:
                return render(request, 'venta.html', {'error': 'Producto no encontrado'})
        else:
            return render(request, 'venta.html', {'error': 'Por favor no deje campos vacíos'})
    else:
        return render(request, 'venta.html')

@login_required
def delete_ventas(request, SKU):
    member = Ventas.objects.get(SKU=SKU)
    member.delete()
    return redirect('/venta')
