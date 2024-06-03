from django.shortcuts import render

# Create your views here.
from django.contrib.auth.decorators import login_required

# se crea la vista home
@login_required
def login(request):
    return render(request, 'login.html')