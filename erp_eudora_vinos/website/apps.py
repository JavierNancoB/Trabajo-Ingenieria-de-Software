# website/apps.py
from django.apps import AppConfig

class WebsiteConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'website'
    
    def ready(self):
        # Importar signals aquí asegura que estén listos para ser usados cuando la app esté lista
        import website.signals  # Asegúrate de que el nombre del módulo sea correcto
        
        # Importar y iniciar el scheduler
        from website.scheduler import scheduler
        scheduler.start()