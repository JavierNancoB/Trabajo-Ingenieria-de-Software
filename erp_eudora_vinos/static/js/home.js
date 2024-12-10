$(document).ready(function() {
    // Función para convertir fecha en español a un formato compatible con JavaScript
    function convertirFecha(fechaTexto) {
        var partes = fechaTexto.split(" ");
        var dia = parseInt(partes[0]);
        var mes = partes[2]; // El mes está en español
        var anio = parseInt(partes[4]);

        // Diccionario para convertir mes en español a número de mes
        var meses = {
            'enero': 0,
            'febrero': 1,
            'marzo': 2,
            'abril': 3,
            'mayo': 4,
            'junio': 5,
            'julio': 6,
            'agosto': 7,
            'septiembre': 8,
            'octubre': 9,
            'noviembre': 10,
            'diciembre': 11
        };

        var mesNumero = meses[mes.toLowerCase()]; // Convertimos el mes a número
        return new Date(anio, mesNumero, dia); // Creamos el objeto Date con el año, mes y día
    }

    // Seleccionamos todas las celdas con la clase 'Fecha'
    $('.Fecha').each(function() {
        // Convertimos la fecha de texto a un objeto Date utilizando la función anterior
        var fechaTexto = $(this).text().trim();
        var fechaVencimiento = convertirFecha(fechaTexto);

        // Obtenemos la fecha actual
        var fechaActual = new Date();

        // Calculamos la diferencia en milisegundos y la convertimos a días
        var diferenciaDias = Math.round((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));

        // Añadimos la clase 'table-warning' si la diferencia de días cumple las condiciones
        if (diferenciaDias <= 0) {
            // Añadimos la clase 'table-danger' al padre (tr) de la celda actual (td)
            $(this).closest('tr').addClass('table-danger');
        }
        if (diferenciaDias > 0 && diferenciaDias <= 3) {
            // Añadimos la clase 'table-warning' al padre (tr) de la celda actual (td)
            $(this).closest('tr').addClass('table-warning');
        }
        if (diferenciaDias > 3 && diferenciaDias < 14) {
            // Añadimos la clase 'table-warning' al padre (tr) de la celda actual (td)
            $(this).closest('tr').addClass('table-info')
        }
    });
});