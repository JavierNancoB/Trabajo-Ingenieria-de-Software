from django.shortcuts import render
from .models import Cliente
from.models import Producto
from .forms import ProductoForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView

# Vista para manejar el formulario de login
#class LoginView(LoginView):
 #   template_name = 'login.html'

@login_required
def home(request):
    return render(request, 'home.html')
@login_required
def producto(request):
    productos = Producto.objects.all()
    return render(request, 'producto.html', {'productos': productos})
@login_required
def ajuste_producto(request):
    if request.method == 'POST':
        form = ProductoForm(request.POST or None)
        if form.is_valid():
            form.save()
        return render(request, 'productoform.html', {})
        
    else:
        return render(request, 'productoform.html', {})

# Create your views here.
