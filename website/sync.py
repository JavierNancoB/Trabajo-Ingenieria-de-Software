import os
import sys
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime
from django.utils import timezone

# Configura el entorno Django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_eudora_vinos.settings')
import django
django.setup()

from website.models import Ventas, Producto, Cliente, Configuracion

def obtener_fecha_ultima_sincronizacion():
    #print("Obteniendo fecha de última sincronización")
    config, created = Configuracion.objects.get_or_create(clave='ultima_sincronizacion')
    if created or not config.valor:
        return timezone.make_aware(datetime(2000, 1, 1, 0, 0, 0))
    return config.valor

def actualizar_fecha_ultima_sincronizacion(fecha):
    config, created = Configuracion.objects.get_or_create(clave='ultima_sincronizacion')
    config.valor = timezone.make_aware(fecha) if timezone.is_naive(fecha) else fecha
    config.save()

'''
Función para sincronizar los pedidos de WooCommerce con la base de datos local
'''

def SyncWoocomerce():
    # URL de la API de WooCommerce
    url = "https://eudoravinos.cl/wp-json/wc/v3/orders"

    # Claves proporcionadas por WooCommerce
    consumer_key = "ck_bbebdac04ed22251d06d1d39cf8dbc14ae3eac0d"
    consumer_secret = "cs_eda3391a18f4f044f9f8f698736c8ed6c1538502"

    # Obtener la fecha de la última sincronización
    ultima_sincronizacion = obtener_fecha_ultima_sincronizacion()

    # Convertir la fecha a string para la API
    fecha_ultima_sincronizacion_str = ultima_sincronizacion.isoformat()

    # Realiza una solicitud GET con parámetros para obtener pedidos después de la última sincronización
    params = {'after': fecha_ultima_sincronizacion_str}
    response = requests.get(url, auth=HTTPBasicAuth(consumer_key, consumer_secret), params=params)
    
    if response.status_code == 200:
        data = response.json()

        for venta in data:
            pedido = venta['id']
            estado = venta['status']
            
            # Verifica si el estado del pedido es "completed" para poder seguir
            if estado != 'completed':
                continue
            
            # Obtener rut de billing o meta_data
            rut = None
            for meta in venta['meta_data']:
                if meta['key'] == 'additional_rut':
                    rut = meta['value']
                    break

            nombre_completo = venta['billing']['first_name'] + " " + venta['billing']['last_name']
            correo = venta['billing']['email']
            telefono = venta['billing']['phone']
            comuna = venta['billing']['city']
            calle = venta['billing']['address_1']
            numero_de_casa = venta['billing']['address_2']
            
            flete = int(venta['shipping_total'])
            factura = venta['payment_method_title']
            if factura != "Webpay Plus":
                factura = " "

            # Convertir fecha a objeto datetime.date
            fecha_boleta_str = venta.get('date_completed', None)
            fecha_boleta = None
            if fecha_boleta_str:
                try:
                    fecha_boleta = datetime.fromisoformat(fecha_boleta_str).date()
                except ValueError:
                    fecha_boleta = None

            # Verifica si la venta tiene los datos necesarios
            if not rut:
                continue

            # Busca el cliente basado en el rut
            cliente = Cliente.objects.filter(rut=rut).first()
            if not cliente:
                # Si no se encuentra el rut, crea un nuevo cliente
                cliente = Cliente.objects.create(rut=rut, nombre=nombre_completo, email=correo, telefono=telefono, numero_de_casa=numero_de_casa, comuna=comuna, calle=calle)

            # Verifica que el cliente se haya creado correctamente
            if not cliente:
                continue

            # Agregar depuración para los ítems de cada pedido
            for idx, item in enumerate(venta['line_items']):
                precio_unitario = item['price']
                sku = item['sku']
                cantidad = item['quantity']

                # Filtra los productos cuyo SKU comienza con "pck"
                if sku.startswith('PCK'):
                    continue

                # Busca o crea el producto basado en el SKU
                producto, created = Producto.objects.get_or_create(SKU=sku)

                # Crea un nuevo registro de venta
                venta_total = precio_unitario * cantidad
                pago = precio_unitario * cantidad + flete
                nueva_venta = Ventas.objects.create(precio_unitario=precio_unitario, cantidad=cantidad, SKU=producto, rut=cliente, venta_total=venta_total, fecha_boleta=fecha_boleta, flete=flete, pago=pago, factura_o_boleta=factura, pedido=pedido)

        # Actualiza la fecha de última sincronización
        actualizar_fecha_ultima_sincronizacion(timezone.now())
        
    else:
        print(f"Error al realizar la solicitud: {response.status_code}")

######## IMPORTANTE ########

# Llama a la función SyncWoocomerce si este archivo es ejecutado directamente
if __name__ == "__main__":
    print("Ejecutando script directamente")
    #SyncWoocomerce()