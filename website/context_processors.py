from datetime import datetime, timedelta
from website.models import Alerta_stock

# Context processor para notificaciones de stock
def notificaciones(request):
    fecha_limite = datetime.now().date() - timedelta(days=7)
    notificaciones_activas = Alerta_stock.objects.filter(fecha_alerta__gte=fecha_limite)
    return {'notificaciones_activas': notificaciones_activas}