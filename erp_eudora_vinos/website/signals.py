from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Inventario_Y_Stock, Alerta_stock
from django.utils import timezone

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
