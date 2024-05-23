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


class Producto(models.Model):
    SKU = models.CharField(max_length=50, unique=True)
    fecha_fabricacion= models.DateField()
    tipo_producto = models.CharField(max_length=50)
    viña= models.CharField(max_length=150)
    cepa= models.CharField(max_length=50)
    nombre_producto = models.CharField(max_length=50)
    cosecha = models.CharField(max_length=50)
    
    def __str__(self):
        return self.SKU + ' ' + self.nombre_producto    


class Ventas(models.Model):
    # falta la foreign key de sku
    #SKU = models.CharField(max_length=50) 
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE) #foreign
    numero_boleta = models.IntegerField(unique=True)
    nombre_producto = models.CharField(max_length=50)
    precio_unitario = models.IntegerField()
    cantidad = models.IntegerField()
    iva = models.IntegerField()
    medio_de_pago = models.CharField(max_length=50)


    def __str__(self):
        return self.producto.SKU + ' ' + self.numero_boleta
    

