"""import requests
from requests.auth import HTTPBasicAuth
from .models import Ventas

def SyncWoocomerce():

    # URL de la API de WooCommerce
    url = "https://erp.eudoravinos.cl/wp-json/wc/v3/products"

    #URL: https://erp.eudoravinos.cl/

    # Claves proporcionadas por WooCommerce
    consumer_key = "ck_c6f3618108c67d62e512c3cd080284d448ce8ede"
    consumer_secret = "cs_b812402f4fe07c64a061cc6d2489aebc436fdc3d"

    # Realiza una solicitud GET
    response = requests.get(url, auth=HTTPBasicAuth(consumer_key, consumer_secret))

    if response.status_code == 200:
        data = response.json()
        for venta in data:
            # lo que va entre corchetes debe ponerlo la coniiiiiii
            # coni tambien comente una weas en views.py, en la funcion ventas

            pedido = venta['id']

            # nombre = producto['name']
            # precio = producto['price']

            # Verifica si el producto ya existe
            if not Ventas.objects.filter(pedido=pedido).exists():
                # Si no existe, crea un nuevo registro

                # este debe verse asi por ejemplo: Ventas.objects.create(nombre=nombre, precio_unitario=precio) 

                Ventas.objects.create(pedido=pedido)
                print(f"Añadido: {pedido}")
            else:
                print(f"Ya existe en la base de datos: {pedido}")
    else:
        print(f"Error al realizar la solicitud: {response.status_code}")

######## IMPORTANTE ########

# Variable de ejemplo para acceso a datos
# product_name = data[0]['name'] if data else 'No Data Available'"""
