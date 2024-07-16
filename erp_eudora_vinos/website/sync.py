import os
import sys
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime

# Configura el entorno Django
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_eudora_vinos.settings')
import django
django.setup()

from website.models import Ventas, Producto, Cliente

def SyncWoocomerce():
    # URL de la API de WooCommerce
    url = "https://erp.eudoravinos.cl/wp-json/wc/v3/orders"

    # Claves proporcionadas por WooCommerce
    consumer_key = "ck_c6f3618108c67d62e512c3cd080284d448ce8ede"
    consumer_secret = "cs_b812402f4fe07c64a061cc6d2489aebc436fdc3d"

    # Realiza una solicitud GET
    response = requests.get(url, auth=HTTPBasicAuth(consumer_key, consumer_secret))
    print(f"Solicitud realizada a la API: estado {response.status_code}")

    if response.status_code == 200:
        data = response.json()

        for venta in data:
            pedido = venta['id']
            estado = venta['status']
            
            # Verifica si el estado del pedido es "completed"
            if estado != 'completed':
                print(f"------> Pedido ID: {pedido} no está completado. Estado actual: {estado}. Saltando este pedido.")
                continue

            # Muestra mensaje si el pedido está completado
            print(f"<--------> Pedido ID: {pedido} está completado.")

            nombre_completo = venta['billing']['first_name'] + " " + venta['billing']['last_name']
            
            # Obtener rut de billing o meta_data
            rut = None
            for meta in venta['meta_data']:
                if meta['key'] == 'additional_rut':
                    rut = meta['value']
                    break
            
            flete = int(venta['shipping_total'])
            factura = venta['payment_method_title']
            
            print(f" Rut: {rut}, Pago Total: {flete}, Factura: {factura}")
            
            if factura != "Webpay Plus":
                factura = " "

            # Convertir fecha a objeto datetime.date
            fecha_boleta_str = venta.get('date_completed', None)
            fecha_boleta = None
            if fecha_boleta_str:
                try:
                    fecha_boleta = datetime.fromisoformat(fecha_boleta_str).date()
                    print(f"Fecha convertida correctamente: {fecha_boleta}")
                except ValueError:
                    print(f"Formato de fecha inválido: {fecha_boleta_str}")

            # Verifica si la venta tiene los datos necesarios
            if not rut:
                print(f"Datos incompletos para el pedido ID: {pedido}. Saltando este pedido.")
                continue

            # Imprime el RUT en lugar de guardarlo en la base de datos
            print(f"RUT del cliente: {rut}")

            # Busca el cliente basado en el rut
            cliente = Cliente.objects.filter(rut=rut).first()
            if not cliente:
                # Si no se encuentra el rut, crea un nuevo cliente
                cliente = Cliente.objects.create(rut=rut, nombre=nombre_completo)
                print(f"Cliente creado: {cliente}")
            else:
                print(f"Cliente encontrado: {cliente}")

            # Verifica que el cliente se haya creado correctamente
            if not cliente:
                print(f"No se pudo encontrar o crear un cliente para el RUT: {rut}. Saltando este pedido.")
                continue

            # Agregar depuración para los ítems de cada pedido
            print(f"Pedido ID: {pedido} tiene {len(venta['line_items'])} ítems.")
            for idx, item in enumerate(venta['line_items']):
                print(f"Ítem {idx + 1}: {item}")

                precio_unitario = item['price']
                sku = item['sku']
                cantidad = item['quantity']

                # Depuración: Verificar los valores
                print(f"Procesando ítem - Precio Unitario: {precio_unitario}, SKU: {sku}, Cantidad: {cantidad}")

                # Verifica si el SKU está presente
                if not sku:
                    print(f"SKU faltante para el pedido ID: {pedido}. Saltando este ítem.")
                    continue

                # Verifica si la cantidad es un número válido
                if not isinstance(cantidad, int) or cantidad <= 0:
                    print(f"Cantidad inválida para el pedido ID: {pedido}. Saltando este ítem.")
                    continue

                # Busca o crea el producto basado en el SKU
                producto, created = Producto.objects.get_or_create(SKU=sku)
                if created:
                    print(f"Producto creado: {producto}")
                else:
                    print(f"Producto encontrado: {producto}")

                print(f"Procesando Pedido ID: {pedido}, Precio Unitario: {precio_unitario}, Cantidad: {cantidad}, SKU: {sku}, Fecha Boleta: {fecha_boleta}")

                # Verifica si la combinación de pedido y SKU ya existe
                venta_existente = Ventas.objects.filter(pedido=pedido, SKU=producto).first()
                if venta_existente:
                    # Si existe, actualiza el registro existente NO DEBERIA SER NECESARIO
                    venta_existente.cantidad = cantidad
                    venta_existente.venta_total = precio_unitario * cantidad
                    venta_existente.fecha_boleta = fecha_boleta
                    venta_existente.flete = flete
                    venta_existente.pago = precio_unitario * cantidad + flete
                    venta_existente.factura_o_boleta = factura
                    
                    venta_existente.save()
                    print(f"Actualizado: Pedido ID {pedido}, Precio Unitario: {precio_unitario}, SKU: {sku}, Cantidad: {cantidad}, Fecha Boleta: {fecha_boleta}")
                else:
                    # Si no existe, crea un nuevo registro
                    venta_total = precio_unitario * cantidad
                    pago = precio_unitario * cantidad + flete
                    Ventas.objects.create(pedido=pedido, precio_unitario=precio_unitario, cantidad=cantidad, SKU=producto, rut=cliente, venta_total=venta_total, fecha_boleta=fecha_boleta, flete=flete, pago=pago, factura_o_boleta=factura)
                    print(f"Añadido: Pedido ID {pedido}, Precio Unitario: {precio_unitario}, SKU: {sku}, Cantidad: {cantidad}, Venta Total: {venta_total}, Fecha Boleta: {fecha_boleta}")

    else:
        print(f"Error al realizar la solicitud: {response.status_code}")

######## IMPORTANTE ########

# Llama a la función SyncWoocomerce si este archivo es ejecutado directamente
if __name__ == "__main__":
    print("Ejecutando script directamente")
    SyncWoocomerce()
