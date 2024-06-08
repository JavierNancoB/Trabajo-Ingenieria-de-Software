from django.contrib import admin
from .models import Cliente
from.models import Producto
from.models import Ventas
from.models import Inventario_Y_Stock
from.models import Alerta_stock
# Register your models here.

admin.site.register(Cliente)
admin.site.register(Producto)
admin.site.register(Ventas)
admin.site.register(Inventario_Y_Stock)
admin.site.register(Alerta_stock)