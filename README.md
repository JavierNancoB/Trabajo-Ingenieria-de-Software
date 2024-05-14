# Trabajo-Ingenieria-de-Software Eudora Vinos

Integrantes
  * Constanza Olivos
  * Nicolas Pozo
  * Javier Nanco
  * Leonardo Farias
  * Ignacio Baeza
  * Aranza Diaz

## Objetivos

El objetivo principal del sistema ERP es proporcionar a Eudora Vinos una plataforma centralizada que les permita gestionar eficientemente sus operaciones comerciales. Los objetivos específicos incluyen:

- **Gestión de inventario:** Seguir el flujo de productos desde la entrada al almacén hasta la venta, asegurando una visibilidad completa del inventario en tiempo real.

- **Gestión de ventas:** Facilitar el proceso de ventas, desde la generación de cotizaciones y pedidos hasta la facturación y el seguimiento de pagos.

- **Facturación:** Generar facturas precisas y detalladas para las transacciones de venta, garantizando la integridad y la legalidad de los documentos financieros.

# Tutoriales

[tutorial django en español](https://youtube.com/playlist?list=PL_wRgp7nihyZsEnudJ-XUAEdnOGUojbnn&si=lmIfMRbt3h9VGOOC)

[Manipular base de datos con django en ingles](https://youtube.com/playlist?list=PLCC34OHNcOtoYVT2654KIzait8_eYO_j5&si=VQfLkIDE1sClg27T)

# Asegurate de tener estos archivos instalados previamente en tu PC
Asegúrate de tener instalados los siguientes programas antes de comenzar:

Git: Descarga e instala [Git](git-scm.com).

Python: Instala [Python](python.org). Recomiendo actualizarlo a la ultima version si ya lo tienen con:
```
pip install --upgrade python
```

MariaDB: Descargar e instalar [MariaDB](https://mariadb.org/), [video tutorial](https://www.youtube.com/watch?v=68TVHdDVUHA) de configuración

Visual Studio Code (VSCode): Descarga e instala [VSCode](code.visualstudio.com).

Ademas entrego el link para los diagramas en [Miro](https://miro.com/welcomeonboard/SHppTnZjTTdDWFNZRFBIOHhhR3NCNG1mUDhzRTN6M1Uwd2szRldmYmdxa2NzdmJ1alFDdE9idlo5TUdlQnBObnwzNDU4NzY0NTQwMTAxMjMyMjU4fDI=?share_link_id=529325488959), que representan tanto el diagrama ERP, como el diagrama relacional y el de flujo de la logica.

link para el diseño de la visuañizacion grafica en [figma](https://www.figma.com/design/SJ8U7sh3zIT8UUOOQfZ1zi/ERP-eudora-vinos?node-id=0%3A1&t=4eMmdY7tV9tEaCjs-1)

# Fork
Un "fork" en GitHub es una copia de un repositorio en el que puedes trabajar de forma independiente. Al hacer un "fork" de un repositorio, se crea una versión separada del mismo en tu propia cuenta de GitHub. Esto te permite modificar el código, realizar experimentos y contribuir al proyecto original a través de solicitudes de extracción ("pull requests") sin afectar el repositorio original.
**Cómo hacer un fork en GitHub**:
 * Visita el repositorio: Ve al repositorio que deseas "forkear" en GitHub.
 * Encuentra el botón de "Fork": En la esquina superior derecha del repositorio, verás un botón llamado "Fork". Haz clic en él.
   
# Clonar un Repositorio
Para clonar un repositorio de Git, ejecuta el siguiente comando en tu terminal (debes estar en la carpeta que te acomode):

**git clone <URL_del_repositorio>**

Reemplaza <URL_del_repositorio> con la URL del repositorio que deseas clonar.

# Instala Django

```
pip install django
```

Configuración de VSCode

Abre VSCode y asegúrate de tener instalada la extensión "Python" para el soporte de Python. Puedes instalarla desde la pestaña de extensiones en VSCode.

# Configuración de MariaDB

MariaDB nos permitira modificar la base de datos en el archivo db.sqlite3, hay que tener ojo porque no debemos crear ni eliminar tablas de ahi solo debemos hacer eso a traves de models en la aplicacion website.

para guardar tus cambios en la base de datos se deben usar los siguientes comandos:

```

python manage.py makemigrations

python manage.py migrate

```

## como hacer llaves foraneas

en los modelos puedes representar las llaves foraneas como en el siguiente ejemplo.

```
from django.db import models

class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    # Otros campos de Persona

class Profesor(models.Model):
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)
    # Otros campos de Profesor
```

aqui profesor comparte el nombre con la tabla personas


# FAQ


**Separar proyectos y aplicaciones**, en Django es una práctica recomendada por varias razones importantes:

para crear una app
```
django-admin startapp nombre_de_la_app
```
Organización y mantenimiento: Dividir tu proyecto en aplicaciones te permite organizar tu código de manera más estructurada y mantenible. Cada aplicación puede manejar una parte específica de la funcionalidad, lo que facilita la comprensión y la realización de cambios en el futuro.
Reutilización de código: Al dividir tu proyecto en aplicaciones más pequeñas y específicas, puedes reutilizar fácilmente el código en otros proyectos si es necesario. Esto promueve la modularidad y evita la duplicación de código.
Escalabilidad: Separar tu proyecto en aplicaciones te permite escalar verticalmente (agregar más funcionalidades a cada aplicación) y horizontalmente (agregar más aplicaciones a tu proyecto) según sea necesario. Esto facilita el manejo de proyectos más grandes y complejos.
Pruebas unitarias: Las aplicaciones separadas facilitan la escritura de pruebas unitarias específicas para cada parte de tu proyecto. Esto simplifica la identificación y corrección de errores, ya que puedes aislar y probar cada componente de manera independiente.
Colaboración: Al dividir tu proyecto en aplicaciones, varias personas pueden trabajar en diferentes partes del proyecto simultáneamente de manera más efectiva. Cada aplicación puede tener su propio equipo de desarrollo responsable de su mantenimiento, lo que promueve la colaboración y la eficiencia.
En resumen, separar proyectos y aplicaciones en Django promueve la organización, la reutilización de código, la escalabilidad, la facilidad de prueba y la colaboración en el desarrollo de software. Es una práctica recomendada que puede mejorar significativamente la calidad y la eficiencia de tu proyecto.

## superuser

```
nombre: admin
contraseña: 123
```

