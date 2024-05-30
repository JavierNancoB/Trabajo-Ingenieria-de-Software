from django.shortcuts import render
from .models import Cliente
from.models import Producto

# se crea la vista home

def home(request):
    return render(request, 'home.html')

def producto(request):
    productos = Producto.objects.all()
    return render(request, 'producto.html', {'productos': productos})

# Create your views here.
