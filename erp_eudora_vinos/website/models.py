from django.db import models
# aqui se crean los modelos de la base de datos
# a través de clases que heredan de models.Model

'''

class usuario(models.Model):
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField()
    contrasena = models.CharField(max_length=50)
    def __str__(self):
        return self.nombre

'''

class Cliente(models.Model):
    rut = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField()
    comuna = models.CharField(max_length=50)
    calle = models.CharField(max_length=50)
    numero_de_casa = models.IntegerField()
    telefono = models.IntegerField()

    def __str__(self):
        return self.nombre + ' ' + self.apellido
    
class Ventas(models.Model):
    # falta la foreign key de sku
    SKU = models.CharField(max_length=50)
    fecha_y_hora = models.DateTimeField()
    numero_boleta = models.IntegerField(unique=True)
    nombre_producto = models.CharField(max_length=50)
    precio_unitario = models.IntegerField()
    cantidad = models.IntegerField()
    iva = models.IntegerField()
    medio_de_pago = models.CharField(max_length=50)


    def __str__(self):
        return self.SKU + ' ' + self.numero_boleta
    
class Proveedores(models.Model):
    nombre_prov = models.CharField(max_length=50)
    rut_empresa = models.CharField(max_length=12, unique=True)
    email_empresa = models.EmailField()
    numero_de_casa = models.IntegerField()
    telefono_empresa = models.IntegerField()
    producto_prov = models.CharField(max_length=50)
    SKU_prov = models.CharField(max_length=50) # foreign key para compra de proveedor
    #SKU_prov = models.ForeignKey(Compra_proveedor, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_prov + ' ' + self.rut_empresa