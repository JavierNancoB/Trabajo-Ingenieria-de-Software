# website/apps.py
from django.apps import AppConfig
#crea configuraciones para la app
class WebsiteConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'website'
    
    def ready(self):
        # Importar signals aquí asegura que estén listos para ser usados cuando la app esté lista
        import website.signals  # Asegúrate de que el nombre del módulo sea correcto
