from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Inventario_Y_Stock, Alerta_stock
from .models import Alerta_vencimiento, Compra_proveedores
from django.utils import timezone
import datetime


@receiver(post_save, sender=Inventario_Y_Stock)
def verificar_stock(sender, instance, **kwargs):
    # Verificar si el stock es igual o menor a 2
    if instance.stock <= 2:
        # Crear alerta de stock bajo
        Alerta_stock.objects.create(
            id_inventario=instance,
            fecha_alerta=timezone.now().date()
        )
        print(f"Alerta de stock bajo para el inventario ID {instance.id_inventario}: Solo quedan {instance.stock} unidades.")

@receiver(post_save, sender=Compra_proveedores)
def indicar_vencimiento(sender, instance, **kwargs):
    # Verificar si el stock es igual o menor a 2

    fecha_objeto = instance.fecha_vencimiento
    if isinstance(fecha_objeto, str):
        fecha_objeto = datetime.datetime.strptime(fecha_objeto, '%Y-%m-%d').date()
    fecha_actual = datetime.date.today()
    diferencia = (fecha_objeto - fecha_actual).days

    # instance contiene la OC que se acaba de crear
    if(diferencia <= 14 and diferencia >=0 and instance.status=="pendiente"):
        # Crear alerta de stock bajo
        Alerta_vencimiento.objects.create(
            OC=instance,
            status='Pendiente',
            fecha_vencimiento=instance.fecha_vencimiento,
            fecha_alerta=timezone.now().date()
        )
        print(f"Alerta de Vencimiento de Orden de compra {instance.OC}: Solo quedan {diferencia} días. el vencimiento es el {instance.fecha_vencimiento}. con status {instance.status}.")
