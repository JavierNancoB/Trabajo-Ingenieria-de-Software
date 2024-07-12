from django.utils.deprecation import MiddlewareMixin
from datetime import datetime, timedelta
from website.models import Alerta_stock
# Middleware para notificaciones de stock calcula la alerta hasta 7 días antes 
class NotificationMiddleware(MiddlewareMixin):
    def process_template_response(self, request, response):
        fecha_limite = datetime.now().date() - timedelta(days=7)
        notificaciones_activas = Alerta_stock.objects.filter(fecha_alerta__gte=fecha_limite)
        if response.context_data is None: # Si no hay contexto, crea uno vacio
            response.context_data = {}
        response.context_data['notificaciones_activas'] = notificaciones_activas # Agrega las notificaciones al contexto
        return response # Devuelve la respuesta modificada