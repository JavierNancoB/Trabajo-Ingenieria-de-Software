from django.shortcuts import render, redirect

# Create your views here.
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

# se crea la vista home
@login_required
def login(request):
    return render(request, 'login.html')

@login_required
def salir(request): 
    logout(request)
    return redirect('/')
