from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Cliente
from.models import Producto
from .forms import ProductoForm

# se crea la vista home

def home(request):
    return render(request, 'home.html')

def producto(request):
    productos = Producto.objects.all()
    return render(request, 'producto.html', {'productos': productos})

def insert_producto(request):
    member = Producto(SKU=request.POST.get('SKU'), tipo_producto=request.POST.get('tipo_producto'), viña=request.POST.get('viña'), cepa=request.POST.get('cepa'), nombre_producto=request.POST.get('nombre_producto'), cosecha=request.POST.get('cosecha'))
    member.save()
    return redirect('/')

def delete_producto(request, SKU):
    member = Producto.objects.get(SKU=SKU)
    member.delete()
    return redirect('/producto')

# se crea la vista edit_producto, editamos desde>