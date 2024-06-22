# Trabajo-Ingenieria-de-Software Eudora Vinos

Integrantes
  * Constanza Olivos
  * Nicolas Pozo
  * Javier Nanco
  * Leonardo Farias
  * Ignacio Baeza
  * Aranza Diaz

Profesor
  * Diego Hernandez

# Objetivos

El objetivo principal del sistema ERP es proporcionar a Eudora Vinos una plataforma centralizada que les permita gestionar eficientemente sus operaciones comerciales. Los objetivos específicos incluyen:

- **Gestión de inventario:** Seguir el flujo de productos desde la entrada al almacén hasta la venta, asegurando una visibilidad completa del inventario en tiempo real.

- **Gestión de ventas:** Facilitar el proceso de ventas, desde la generación de cotizaciones y pedidos hasta la facturación y el seguimiento de pagos.

# Informe

Link de drive del informe: [Drive](https://docs.google.com/document/d/137e2b0gxBhvrPRsoXeRnSfCmz_jwkFPa/edit?usp=sharing&ouid=108234290173319771276&rtpof=true&sd=true)

# Tutoriales

[tutorial django en español](https://youtube.com/playlist?list=PL_wRgp7nihyZsEnudJ-XUAEdnOGUojbnn&si=lmIfMRbt3h9VGOOC)

[Manipular base de datos con django en ingles](https://youtube.com/playlist?list=PLCC34OHNcOtoYVT2654KIzait8_eYO_j5&si=VQfLkIDE1sClg27T)

[Aprende JQuery(ingles)](https://www.youtube.com/watch?v=hMxGhHNOkCU&list=PLoYCgNOIyGABdI2V8I_SWo22tFpgh2s6_)

# Asegurate de tener estos archivos instalados previamente en tu PC
Asegúrate de tener instalados los siguientes programas antes de comenzar:

Git: Descarga e instala [Git](git-scm.com).

Python: Instala [Python](python.org). Recomiendo actualizarlo a la ultima version si ya lo tienen con:
```
pip install --upgrade python
```
El framework django se instala a través del comando:
```
pip install django
```

Visual Studio Code (VSCode): Descarga e instala [VSCode](code.visualstudio.com).

Ademas entrego el link para los diagramas en [Miro](https://miro.com/welcomeonboard/SHppTnZjTTdDWFNZRFBIOHhhR3NCNG1mUDhzRTN6M1Uwd2szRldmYmdxa2NzdmJ1alFDdE9idlo5TUdlQnBObnwzNDU4NzY0NTQwMTAxMjMyMjU4fDI=?share_link_id=529325488959) y [lucid.app](https://lucid.app/lucidchart/4d45984c-0718-4767-a863-238db76c7586/edit?viewport_loc=-312%2C123%2C3330%2C1509%2C0_0&invitationId=inv_b011c8f9-acce-484b-b04a-d92b47c672a5), que representan tanto el diagrama ERP, como el diagrama relacional y el de flujo de la logica.

Link para el diseño de la visuañizacion grafica en [figma](https://www.figma.com/design/cpWvZ6CCEcePlhQqiP0nn0/Untitled?t=YFmOn6KdnBKQN3vU-1)

# Configuración de VSCode

Abre VSCode y asegúrate de tener instalada la extensión "Python" para el soporte de Python. Puedes instalarla desde la pestaña de extensiones en VSCode.

# Fork

Un "fork" en GitHub es una copia de un repositorio en el que puedes trabajar de forma independiente. Al hacer un "fork" de un repositorio, se crea una versión separada del mismo en tu propia cuenta de GitHub. Esto te permite modificar el código, realizar experimentos y contribuir al proyecto original a través de solicitudes de extracción ("pull requests") sin afectar el repositorio original.
**Cómo hacer un fork en GitHub**:
 * Visita el repositorio: Ve al repositorio que deseas "forkear" en GitHub.
 * Encuentra el botón de "Fork": En la esquina superior derecha del repositorio, verás un botón llamado "Fork". Haz clic en él.
   
# Clonar un Repositorio
Para clonar un repositorio de Git, ejecuta el siguiente comando en tu terminal (debes estar en la carpeta que te acomode):

```
git clone <URL_del_repositorio>
```
Reemplaza <URL_del_repositorio> con la URL del repositorio que deseas clonar.

# Configuración de base de datos

Los cambios a la base de datos se realizan de 2 formas, las tablas se crean en el archivo **models.py** y para agregar informacion uno lo hace manualmente (por el momento) a traves del superusuario.

Para guardar tus cambios en la base de datos (cuando trabajes en **models.py**) se deben usar los siguientes comandos cuando estes en el repositorio **Trabajo-Ingenieria-de-Software/erp_eudora_vinos**:

```
python manage.py makemigrations
```
Luego
```
python manage.py migrate
```
OJO solo si no tienes las tablas cargadas
```
python manage.py migrate --run-syncdb
```

## como hacer llaves foraneas

En los modelos puedes representar las llaves foraneas como en el siguiente ejemplo.

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

Aquí profesor comparte el nombre con la tabla personas.

# Subir repositorio a github**

Para subir un repositorio a tu fork debes estar en la carpeta **Trabajo-Ingenieria-de-Software**:

```
git add .
```
```
git commit -m "<Tu comentario>"
```
Recuerda reemplazar <Tu comentario> por los cambios que realizaste.
```
git push
```
Cuando estes listo ve a tu repositorio y haz un pull request y avisame para aceptarlo.

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
nombre: eudoravinos@ejemplo.com
contraseña: G8#z&9kP
```

