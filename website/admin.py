from django.contrib import admin
from .models import Cliente
from .models import Producto
from .models import Proveedores
from .models import Ventas
from .models import Inventario_Y_Stock
from .models import Alerta_stock
from .models import Compra_proveedores
# Register your models here.

#Aqui se registran los modelos en el sitio de administracion 
admin.site.register(Cliente)
admin.site.register(Producto)
admin.site.register(Ventas)
admin.site.register(Inventario_Y_Stock)
admin.site.register(Alerta_stock)
admin.site.register(Proveedores)
admin.site.register(Compra_proveedores)

