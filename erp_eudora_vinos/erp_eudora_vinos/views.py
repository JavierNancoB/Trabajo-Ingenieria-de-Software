from django.http import HttpResponse

# HttpResponse es una clase que devuelve una respuesta HTTP
# a la petición del cliente

def bienvenida(request):
    return HttpResponse("Bienvenido a Eudora Vinos") 