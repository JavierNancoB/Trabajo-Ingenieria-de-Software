from django.shortcuts import render
from .models import Cliente
from django.shortcuts import render

# se crea la vista home

def home(request):
    return render(request, 'home.html')

def mi_vista(request):
    # Suponiendo que tienes una lista de elementos
    items = ['Inicio', 'Clientes', 'Productos', 'Contacto']
    return render(request, 'mi_template.html', {'items': items})

# Create your views here.
