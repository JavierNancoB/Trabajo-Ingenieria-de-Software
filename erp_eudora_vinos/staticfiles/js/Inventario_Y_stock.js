$(document).ready(function() {
    $('#table').DataTable(); // Inicializar la tabla con DataTables


    
    $(document).ready(function() { 
        $('.dt-layout-row.dt-layout-table').addClass('table-responsive');  

        $.ajax({ // petición AJAX para cargar los datos de la tabla
            url: '/api/skus/',  // Asegúrate de que esta URL es correcta según tu configuración de Django
            type: 'GET',
            success: function(data) {
                var select = $('#SKU');
                data.skus.forEach(function(sku) {
                    select.append($('<option>', { value: sku, text: sku }));
                });
            },
            error: function() {
                console.error('Error cargando los SKU');
            }
        });
        $.ajax({ // petición AJAX para cargar los datos de la tabla
            url: '/api/proveedores/',
            type: 'GET',
            success: function(data) {
                var selectProveedor = $('#nombre_prov');
                selectProveedor.empty();
                data.nombres.forEach(function(nombre) {
                    selectProveedor.append($('<option>', { value: nombre, text: nombre }));
                });
            },
            error: function() {
                console.error('Error cargando los nombres de los proveedores');
            }
        });

        calcularTotales(); // Calcular los totales al cargar la página
    });

    
    /* AÑADIR */
 
    function calcularValores() { // Función para calcular los valores de stock y precio total
        var cantidad = parseFloat(document.getElementById('cantidad').value) || 0;
        var salidas = parseFloat(document.getElementById('salidas').value) || 0;
        var movBodegas = parseFloat(document.getElementById('mov-bodega').value) || 0;
        var stock = Math.round(cantidad - salidas - movBodegas);
        var precioUnitario = parseFloat(document.getElementById('precio-unitario').value) || 0;
        var precioTotal = Math.round(stock * precioUnitario);

        document.getElementById('stock').value = stock;
        document.getElementById('precio-total').value = precioTotal;
    }

    // Eventos que disparan el cálculo
    document.getElementById('cantidad').addEventListener('change', calcularValores);
    document.getElementById('salidas').addEventListener('change', calcularValores);
    document.getElementById('mov-bodega').addEventListener('change', calcularValores);
    document.getElementById('precio-unitario').addEventListener('change', calcularValores);
    
    $('#submit').on('click', function() { // Evento para enviar los datos al servidor
        
        $SKU = $('#SKU').val();
        $nombre_prov = $('#nombre_prov').val();
        $bodega = $('#bodega').val();
        $fecha_de_ingreso = $('#fecha-ingreso').val();
        $cantidad = $('#cantidad').val();
        $salidas = $('#salidas').val();
        $mov_bodega = $('#mov-bodega').val();
        $stock = $('#stock').val();
        $precio_unitario = $('#precio-unitario').val();
        $precio_total = $('#precio-total').val();
        
        // Comprobación de campos vacíos
        if ($bodega == '' || $fecha_de_ingreso == '' || $cantidad == '' || $salidas == '' || $mov_bodega == '' || $stock == '' || $precio_unitario == '' || $precio_total == '') {
            alert('Por favor no deje campos vacíos');
        }
        
        // Aquí insertas las validaciones adicionales
        
        if (isNaN($precio_total) || $precio_total <= 0) {
            alert("El valor de 'precio total' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (isNaN($salidas) || $salidas < 0) {
            alert("El valor de 'salidas' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (isNaN($stock) || $stock <= 0) {
            alert("El valor de 'stock' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }

        
        // Comprobación de SKU existente en la tabla

        
            // Proceso de inserción si todas las validaciones son correctas
        $.ajax({ // Petición AJAX para enviar los datos al servidor
            type: 'POST',
            url: 'insert/',
            data: {
                SKU: $SKU,
                nombre_prov: $nombre_prov,
                bodega: $bodega,
                fecha_de_ingreso: $fecha_de_ingreso,
                cantidad: $cantidad,
                salidas: $salidas,
                mov_bodega: $mov_bodega,
                stock: $stock,
                precio_unitario: $precio_unitario,
                precio_total: $precio_total,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function() {
                alert('Se guardó correctamente el inventario');
                
                // Limpiar campos después de la inserción
                $('#SKU').val('');
                $('#nombre_prov').val('');
                $('#bodega').val('');
                $('#fecha-ingreso').val('');
                $('#cantidad').val('');
                $('#salidas').val('');
                $('#mov-bodega').val('');
                $('#stock').val('');
                $('#precio-unitario').val('');
                $('#precio-total').val('');
                window.location='/Inventario_Y_Stock';
                calcularTotales();
                }
            });
        }
    );


    /* EDITAR */

    /* comprobar si la casilla editar esta activada */
    
    function actualizarStock(idInventario) { // Función para actualizar el stock de un producto
        // Buscar en la fila del id_inventario específico
        const row = $(`td[data-id_inventario='${idInventario}'][data-type='cantidad']`).closest('tr');
    
        // Extraer los valores de los inputs de cantidad, salidas y movimiento de bodegas
        const cantidad = parseFloat(row.find(`td[data-id_inventario='${idInventario}'][data-type='cantidad']`).text()) || 0;
        const salidas = parseFloat(row.find(`td[data-id_inventario='${idInventario}'][data-type='salidas']`).text()) || 0;
        //const movBodegas = parseFloat(row.find(`td[data-id_inventario='${idInventario}'][data-type='mov_bodega']`).text()) || 0;
    
        // Calcular el nuevo stock
        const stock = Math.round(cantidad - salidas);
    
        // Actualizar el valor del stock en la fila
        row.find(`td[data-id_inventario='${idInventario}'][data-type='stock']`).text(stock);
    
        // Llamar a la función sendToServer para enviar los cambios al servidor
        sendToServer(idInventario, stock, 'stock');
    }
    

    document.addEventListener('DOMContentLoaded', function () { // Esperar a que el DOM esté completamente cargado
        function actualizarStockYCosto() {
            const cantidad = parseFloat(document.getElementById('cantidad').value) || 0;
            const salidas = parseFloat(document.getElementById('salidas').value) || 0;
            const movBodegas = parseFloat(document.getElementById('mov-bodega').value) || 0;
            const precioUnitario = parseFloat(document.getElementById('precio-unitario').value) || 0;
            
            // Cálculo de stock
            const stock = Math.round(cantidad - salidas - movBodegas);

            // Cálculo de costo total
            const costoTotal = Math.round(stock * precioUnitario);

            // Actualizar los campos con valores enteros
            document.getElementById('stock').value = stock;
            document.getElementById('precio-total').value = costoTotal;
        }

        // Agrega eventos de cambio a los campos relevantes
        document.getElementById('cantidad').addEventListener('input', actualizarStockYCosto);
        document.getElementById('salidas').addEventListener('input', actualizarStockYCosto);
        document.getElementById('mov-bodega').addEventListener('input', actualizarStockYCosto);
        document.getElementById('precio-unitario').addEventListener('input', actualizarStockYCosto);

        // Aquí asumes que ya existe la funcionalidad para enviar datos en tu archivo JS, se llama en este lugar
        document.getElementById('submit').addEventListener('click', function () {
            
        });
    }
);
    
    // Función que comprueba si la casilla de edición está activada
    function isEditingEnabled() {
        // Retorna true si la casilla con id 'flexSwitchCheckDefault' está marcada
        return $('#flexSwitchCheckDefault').prop('checked');
    }

    function transformarFecha(fecha) {
        // Dividimos el string de fecha en partes
        const partes = fecha.split(" de ");
    
        // Asignamos cada parte a una variable
        const dia = partes[0];
        const mes = partes[1];
        const año = partes[2];
    
        // Convertimos el mes de texto a número
        const meses = {
            enero: '01', febrero: '02', marzo: '03', abril: '04',
            mayo: '05', junio: '06', julio: '07', agosto: '08',
            septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
        };
        const mesNumero = meses[mes.toLowerCase()]; // aseguramos que sea minúscula para coincidir con las claves
    
        // Aseguramos que el día tenga dos dígitos
        const diaFormateado = dia.padStart(2, '0');
    
        // Creamos la nueva fecha en formato aaaa-mm-dd
        const fechaFormateada = `${año}-${mesNumero}-${diaFormateado}`;
    
        return fechaFormateada;
    }

    // Cola de solicitudes para manejar actualizaciones secuenciales
    let requestQueue = [];
    let isRequestInProgress = false;

    function addToRequestQueue(id_inventario, value, type) {
        requestQueue.push({ id_inventario, value, type });
        processNextRequest();
    }

    function processNextRequest() {
        if (isRequestInProgress || requestQueue.length === 0) {
            return;
        }

        isRequestInProgress = true;
        const { id_inventario, value, type } = requestQueue.shift();

        $.ajax({
            url: 'update/', // Asegúrate que la URL es la correcta
            type: 'POST',
            data: {
                id_inventario: id_inventario,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                console.log('Success:', response);
                if (type === 'stock') {
                    alert('Stock actualizado correctamente.');
                }
                else 
                {
                    alert('Se guardó correctamente luego de editarlo');
                }
                isRequestInProgress = false;
                processNextRequest(); // Decide si quieres procesar la siguiente solicitud automáticamente o no
            },
            error: function(xhr, status, error) { // Manejar errores
                console.error('Error:', xhr.responseText);
                isRequestInProgress = false;
                processNextRequest();  // Decide si quieres reintentar automáticamente o no
            }
        });
    }

    $(document).on('dblclick', '.editable', function() {
        if (isEditingEnabled()) {
            var value=$(this).text();
            var input="<input type='text' class='input-data' value='"+value+"' class='form-control' /> ";
            $(this).html(input);
            $(this).removeClass('editable');
        }
    });

    $(document).on('blur', '.input-data', function() {
        var td = $(this).parent('td');
        var value = $(this).val();
        var id_inventario = td.data('id_inventario');
        var type = td.data('type');

        if (type === 'fecha_de_ingreso') {
            value = transformarFecha(value);
        }
        
        $(this).remove();
        td.html(value).addClass('editable');

        // Agregamos la solicitud a la cola en lugar de enviarla directamente
        addToRequestQueue(id_inventario, value, type);

        if(type == 'cantidad' || type == 'salidas' || type == 'mov_bodega' || type == 'precio_unitario') {
            var cantidad = parseFloat($(`td[data-id_inventario='${id_inventario}'][data-type='cantidad']`).text()) || 0;
            var salidas = parseFloat($(`td[data-id_inventario='${id_inventario}'][data-type='salidas']`).text()) || 0;
            var movBodegas = parseFloat($(`td[data-id_inventario='${id_inventario}'][data-type='mov_bodega']`).text()) || 0;
            var stock = Math.round(cantidad - salidas - movBodegas);
            var precio_total = stock * parseFloat($(`td[data-id_inventario='${id_inventario}'][data-type='precio_unitario']`).text()) || 0;
            addToRequestQueue(id_inventario, stock, 'stock');
            addToRequestQueue(id_inventario, precio_total, 'precio_total');
        }
    });

    // Eliminar duplicado de transformarFecha dentro de keypress ya que se define fuera
    $(document).on('keypress', '.input-data', function(e) {
        var key = e.which;
        if(key == 13) {
            var value = $(this).val();
            var td = $(this).parent("td");
            var type = td.data("type");
            if (type === 'fecha_de_ingreso') {
                value = transformarFecha(value);
            }

            $(this).remove();
            td.html(value).addClass("editable");
            addToRequestQueue(td.data("id_inventario"), value, type);

            if(type == 'cantidad' || type == 'salidas' || type == 'mov_bodega' || type == 'precio_unitario') {
                actualizarStock(td.data("id_inventario"));
            }
        }
    });

   
    function sendToServer(id_inventario, value, type) { // Función para enviar los datos al servidor
        var td = $("[data-id_inventario='" + id_inventario + "']").parent('td');
        var tr = td.closest('tr');  // Obtener el <tr> más cercano
        var element = $("[data-id_inventario='" + id_inventario + "']");
        element.prop('disabled', true);
        
        if(type == "stock" || type == "precio_total" || type == "salidas" || type == "precio_unitario" || type == "cantidad" || type == "mov_bodega" ){
            if (value < 0 && type != isNaN(value)) {
                tr.addClass('table-warning');
                alert("El valor debe ser numérico y mayor a cero.");
                return; // No enviar los datos al servidor
            }
        }
        // Validaciones para diferentes tipos de datos
        
        switch (type) {
            case "bodega":
                if (value.length > 150) {
                    tr.addClass('table-warning');
                    alert("El valor para 'bodega' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "mov_bodega":
                if (value.length > 50) {
                    tr.addClass('table-warning');
                    alert("El valor para 'bodegas' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "nombre_prov":
                if (value.length > 150) {
                    tr.addClass('table-warning');
                    alert("El valor para 'nombre proveedores' no puede tener más de 150 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            default:
                break;
        }
        // Log para ver qué datos se están enviando
        console.log("Sending to server:", id_inventario, value, type);
        // Envío de datos al servidor mediante AJAX
        $.ajax({
            url: 'update/', // URL a la que se envían los datos
            type: 'POST', // Tipo de petición
            data: {
                id_inventario: id_inventario, // SKU del producto
                value: value, // Valor actualizado
                type: type, // Tipo de dato actualizado
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() // Token CSRF para la seguridad
            }
        })
        .done(function(response) {
            // Alerta y log en caso de éxito
            if (type != 'stock' && type != 'precio_total') {
                alert('Se guardó correctamente luego de editarlo');
            }
            calcularTotales();

        })
        .fail(function() {
            // Log en caso de error
            tr.addClass('table-warning');
            alert('Ocurrio un error, vuelva a intentarlo');
            
            console.log('Error');   
        });
    }
        
    

    /* ELIMINAR */
    
    $('#eliminar-seleccion').on('click', function(e){ // Al hacer clic en el botón de eliminar

        var confirmation = confirm('¿Está seguro de que desea eliminar los inventarios seleccionados?');
        if (confirmation) {
            $('input[name="seleccionar"]:checked').each(function() {
                var id_inventario = $(this).data('id_inventario');
                console.log('Eliminando proveedor ' + id_inventario);
                $.ajax({
                    url: '/Inventario_Y_Stock/delete/' + id_inventario, // Usando la ruta existente
                    type: 'POST',
                    headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                    success: function(response) {
                        console.log('Inventario_Y_Stock ' + id_inventario + ' eliminado');
                        calcularTotales();
                    },
                    error: function(xhr) {
                        console.log('Error al eliminar el proveedor ' + id_inventario);
                    },
                    
                    complete: function() {
                        location.reload(); // Considera recargar después de todas las solicitudes, no en cada una
                    }
                    
                });
            });
        }
    }
    );


    function calcularTotales() { // Función para calcular los totales de ingresos, salidas, stock y costo
        let totalIngresos = 0, totalSalidas = 0, totalMovBodegas = 0, totalStock = 0, totalCosto = 0;
    
        // Selecciona cada fila en el cuerpo de la tabla con id 'table'
        document.querySelectorAll("#table tbody tr").forEach(fila => {
            // Extrae los valores de las celdas de la fila y conviértelos a números apropiados
            // || 0 se usa para manejar celdas vacías o no numéricas
            const cantidad = parseInt(fila.cells[5].textContent) || 0;
            const salidas = parseInt(fila.cells[6].textContent) || 0;
            const movBodegas = parseInt(fila.cells[7].textContent) || 0;
            // Calcula el stock usando la nueva fórmula
            const stock = cantidad - salidas - movBodegas; // Usa la fórmula correcta aquí
            const precioUnitario = parseFloat(fila.cells[9].textContent) || 0;
    
            // Acumula los totales de ingresos, salidas y movimientos de bodega
            totalIngresos += cantidad;
            totalSalidas += salidas;
            totalMovBodegas += movBodegas;
            totalStock += stock; // Asegúrate de sumar el stock calculado
    
            // Calcula el costo total por cada fila y redondea a un entero
            totalCosto += stock * precioUnitario;
        });
    
        // Muestra los totales calculados en los elementos del DOM correspondientes
        document.querySelector(".ingresos-totales").textContent = totalIngresos || 0;
        document.querySelector(".salidas-totales").textContent = totalSalidas || 0;
        document.querySelector(".movimiento-entre-bodegas").textContent = totalMovBodegas || 0;
        document.querySelector(".stock-total").textContent = totalStock || 0; // Actualiza el stock total
        document.querySelector(".costo-total").textContent = totalCosto || 0;
    }
});