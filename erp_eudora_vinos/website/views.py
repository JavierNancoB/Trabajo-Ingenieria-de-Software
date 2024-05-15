from django.shortcuts import render
from .models import Cliente

# se crea la vista home

def home(request):
    return render(request, 'home.html')

# Create your views here.
