from django.shortcuts import render
from .models import Cliente
from.models import Producto
from .forms import ProductoForm

# se crea la vista home

def home(request):
    return render(request, 'home.html')

def producto(request):
    productos = Producto.objects.all()
    return render(request, 'producto.html', {'productos': productos})

def ajuste_producto(request):
    if request.method == 'POST':
        form = ProductoForm(request.POST or None)
        if form.is_valid():
            form.save()
        return render(request, 'productoform.html', {})
        
    else:
        return render(request, 'productoform.html', {})

# Create your views here.
