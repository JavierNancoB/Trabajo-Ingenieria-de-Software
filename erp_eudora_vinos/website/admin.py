from django.contrib import admin
from .models import Cliente
from.models import Producto
from.models import Inventario_Y_Stock
# Register your models here.

admin.site.register(Cliente)
admin.site.register(Producto)
admin.site.register(Inventario_Y_Stock)
