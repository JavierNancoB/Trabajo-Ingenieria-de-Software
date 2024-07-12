from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Inventario_Y_Stock, Alerta_stock
from .models import Alerta_vencimiento, Compra_proveedores
from django.utils import timezone
import datetime

#manejar automaticamente las alertas de stock y vencimiento

# Signal para verificar el stock de un producto
@receiver(post_save, sender=Inventario_Y_Stock)
def verificar_stock(sender, instance, **kwargs):
    # Verificar si el stock es igual o menor a 2
    stock = int(instance.stock)
    if stock <= 2:
        # Crear alerta de stock bajo
        Alerta_stock.objects.create(
            id_inventario=instance,
            fecha_alerta=timezone.now().date(),
            cantidad=stock
        )
        print(f"Alerta de stock bajo para el inventario ID {instance.id_inventario}: Solo quedan {instance.stock} unidades.")
    elif stock > 2:
        # Eliminar cualquier alerta existente si la compra ha sido pagada
        Alerta_stock.objects.filter(id_inventario=instance).delete()
        print(f"Alertas eliminada para el inventario ID {instance.id_inventario}: quedan {instance.stock} unidades.")

# Signal para verificar el vencimiento de una compra
@receiver(post_save, sender=Compra_proveedores)
def indicar_vencimiento(sender, instance, **kwargs): # instance es la compra 
    fecha_objeto = instance.fecha_vencimiento
    if isinstance(fecha_objeto, str):
        fecha_objeto = datetime.datetime.strptime(fecha_objeto, '%Y-%m-%d').date()
    fecha_actual = datetime.date.today()
    diferencia = (fecha_objeto - fecha_actual).days

    # Revisar y manejar el estado de la compra
    if instance.status == "pendiente" and 0 <= diferencia <= 14:
        Alerta_vencimiento.objects.update_or_create(
            OC=instance,
            defaults={
                'status': 'pendiete',
                'fecha_vencimiento': instance.fecha_vencimiento,
                'fecha_alerta': timezone.now().date()
            }
        )
        print(f"Alerta de Vencimiento de Orden de compra {instance.OC}: Solo quedan {diferencia} días. El vencimiento es el {instance.fecha_vencimiento}. Con status {instance.status}.")
    elif instance.status == "pagado":
        # Eliminar cualquier alerta existente si la compra ha sido pagada
        Alerta_vencimiento.objects.filter(OC=instance).delete()
        print(f"Alertas eliminadas para la Orden de compra {instance.OC} porque ha sido pagada.")
