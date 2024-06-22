from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from django.utils import timezone
import sys
from website.models import Compra_proveedores, Alerta_vencimiento  # Asegúrate de que estos modelos existen

def verificar_vencimientos():
    hoy = timezone.now().date()
    compras = Compra_proveedores.objects.filter(status='Pendiente')
    for compra in compras:
        fecha_vencimiento = compra.fecha_vencimiento
        diferencia = (fecha_vencimiento - hoy).days
        if diferencia <= 14:
            Alerta_vencimiento.objects.get_or_create(
                OC=compra,
                defaults={
                    'status': 'Pendiente',
                    'fecha_vencimiento': compra.fecha_vencimiento,
                    'fecha_alerta': hoy
                }
            )
    print(f"Verificación de vencimientos completada a las {timezone.now()}")

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    scheduler.add_job(verificar_vencimientos, 'interval', hours=12, name='verificar_vencimientos', jobstore='default')
    register_events(scheduler)
    scheduler.start()
    print("Scheduler started...", file=sys.stdout)
