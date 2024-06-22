from django.utils.deprecation import MiddlewareMixin
from datetime import datetime, timedelta
from website.models import Alerta_stock

class NotificationMiddleware(MiddlewareMixin):
    def process_template_response(self, request, response):
        fecha_limite = datetime.now().date() - timedelta(days=7)
        notificaciones_activas = Alerta_stock.objects.filter(fecha_alerta__gte=fecha_limite)
        if response.context_data is None:
            response.context_data = {}
        response.context_data['notificaciones_activas'] = notificaciones_activas
        return response