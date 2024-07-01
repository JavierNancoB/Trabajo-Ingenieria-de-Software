$(document).ready(function() {
    $('#table').DataTable();


    
    $(document).ready(function() {
        $('.dt-layout-row.dt-layout-table').addClass('table-responsive');

        $.ajax({
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
        $.ajax({
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

        calcularTotales();
    });

    
    /* AÑADIR */
    
    $('#submit').on('click', function() {
        
        $SKU = $('#SKU').val();
        $nombre_prov = $('#nombre_prov').val();
        $bodega = $('#bodega').val();
        $fecha_de_ingreso = $('#fecha-ingreso').val();
        $cantidad = $('#cantidad').val();
        $salidas = $('#salidas').val();
        $mov_bodegas = $('#mov-bodegas').val();
        $stock = $('#stock').val();
        $precio_unitario = $('#precio-unitario').val();
        $precio_total = $('#precio-total').val();
        
        // Comprobación de campos vacíos
        if ($bodega == '' || $fecha_de_ingreso == '' || $cantidad == '' || $salidas == '' || $mov_bodegas == '' || $stock == '' || $precio_unitario == '' || $precio_total == '') {
            alert('Por favor no deje campos vacíos');
        }
        
        // Aquí insertas las validaciones adicionales
        
        if (isNaN($precio_total) || $precio_total <= 0) {
            alert("El valor de 'precio total' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (isNaN($salidas) || $salidas <= 0) {
            alert("El valor de 'salidas' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (isNaN($stock) || $stock <= 0) {
            alert("El valor de 'stock' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }

        
        // Comprobación de SKU existente en la tabla

        
            // Proceso de inserción si todas las validaciones son correctas
        $.ajax({
            type: 'POST',
            url: 'insert/',
            data: {
                SKU: $SKU,
                nombre_prov: $nombre_prov,
                bodega: $bodega,
                fecha_de_ingreso: $fecha_de_ingreso,
                cantidad: $cantidad,
                salidas: $salidas,
                mov_bodegas: $mov_bodegas,
                stock: $stock,
                precio_unitario: $precio_unitario,
                precio_total: $precio_total,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function() {
                alert('Se guardó correctamente el producto');
                
                // Limpiar campos después de la inserción
                $('#SKU').val('');
                $('#nombre_prov').val('');
                $('#bodega').val('');
                $('#fecha-ingreso').val('');
                $('#cantidad').val('');
                $('#salidas').val('');
                $('#mov-bodegas').val('');
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
    
    // Evento que se activa al hacer doble clic en un elemento con clase 'editable'
    $(document).on('dblclick', '.editable', function() {
        if (isEditingEnabled()) {
            var value=$(this).text();
            var input="<input type='text' class='input-data' value='"+value+"' class='form-control' /> ";
            $(this).html(input);
            $(this).removeClass('editable');
        }
    });
    /*
    // Evento que se activa al perder el foco un input con clase 'input-data'
    $(document).on('blur', '.input-data', function() {
        // Obtiene el valor del input
        var value = $(this).val();
        // Obtiene el elemento padre (td) del input
        var td = $(this).parent('td');
        // Obtiene el SKU del atributo 'data-sku' del td
        var id_inventario = td.data('id_inventario');
        console.log(id_inventario);
        // Elimina el input
        $(this).remove();
        // Inserta el valor en el td
        td.html(value);
        // Añade de nuevo la clase 'editable' al td
        td.addClass('editable');
        // Obtiene el tipo del atributo 'data-type' del td
        var type = td.data('type');
        // Envía los datos al servidor
        sendToServer(td.data("id_inventario"), value, type);
    });
    */
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
        actualizarFila(td.closest('tr'));
        sendToServer(id_inventario, value, type);
    });
    });
    
    $(document).on('keypress', '.input-data', function(e) {
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
        var key = e.which;
        if(key == 13){
            var value = $(this).val();
            console.log(value);
            var td = $(this).parent("td");
            console.log(td);
            var type = td.data("type");
            if (type === 'fecha_de_ingreso') {
                value = transformarFecha(value);
            }
            console.log(type, "AWA", value);
            // td.data("OC"); sirve para obtener el valor de la columna OC
            // si Oc es un numero entero, se debe cambiar por el valor de la columna OC
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            console.log(td.data("id_inventario"));
            sendToServer(td.data("id_inventario"), value, type);
        }
        
    });
    
    function sendToServer(id_inventario, value, type) {
        var td = $("[data-id_inventario='" + id_inventario + "']").parent('td');
        var tr = td.closest('tr');  // Obtener el <tr> más cercano
        
        if (type == "cantidad" && isNaN(value) || value <= 0) { // no se el limite de cantidad
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor o igual a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "precio_unitario" && isNaN(value) || value <= 0) {
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "precio_total" && isNaN(value) || value <= 0) {
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "salidas" && isNaN(value) || value <= 0) {
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "stock" && isNaN(value) || value <= 0) {
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
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
            case "mov_bodegas":
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
            tr.addClass('table-light');
            alert('Se guardó correctamente luego de editarlo');
            //alert('La fecha actual es: ' + año + mes + dia);
            //alert('La fecha de ingreso es: ' + yyyy + mm + dd);
            console.log(response);
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
    
    $('#eliminar-seleccion').on('click', function(e){

        var confirmation = confirm('¿Está seguro de que desea eliminar los productos seleccionados?');
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


    function calcularTotales() {
        let totalIngresos = 0, totalSalidas = 0, totalMovBodegas = 0, totalStock = 0, totalCosto = 0;
    
        document.querySelectorAll("#table tbody tr").forEach(fila => {
            // Convertir los valores a enteros, manejar el caso de NaN estableciendo a 0
            const cantidad = parseInt(fila.cells[5].textContent) || 0;
            const salidas = parseInt(fila.cells[6].textContent) || 0;
            const movBodegas = parseInt(fila.cells[7].textContent) || 0;
            const stock = parseInt(fila.cells[8].textContent) || 0;
            const precioUnitario = parseFloat(fila.cells[9].textContent) || 0;
    
            // Acumular los totales
            totalIngresos += cantidad;
            totalSalidas += salidas;
            totalMovBodegas += movBodegas;
            totalStock += stock;
    
            // Calcular el costo total y redondearlo a entero
            totalCosto += Math.round(stock * precioUnitario);
        });
    
        // Mostrar los totales como enteros y asegurar que sean 0 si no hay datos
        document.querySelector(".ingresos-totales").textContent = totalIngresos || 0;
        document.querySelector(".salidas-totales").textContent = totalSalidas || 0;
        document.querySelector(".movimiento-entre-bodegas").textContent = totalMovBodegas || 0;
        document.querySelector(".stock-total").textContent = totalStock || 0;
        document.querySelector(".costo-total").textContent = totalCosto || 0;
    }
    
    function actualizarFila(fila) {
        const cantidad = parseFloat(fila.find('[data-type="cantidad"]').text()) || 0;
        const salidas = parseFloat(fila.find('[data-type="salidas"]').text()) || 0;
        const movBodegas = parseFloat(fila.find('[data-type="mov_bodegas"]').text()) || 0;
        const precioUnitario = parseFloat(fila.find('[data-type="precio_unitario"]').text()) || 0;

        const stock = cantidad - salidas - movBodegas;
        const precioTotal = stock * precioUnitario;

        fila.find('[data-type="stock"]').text(stock.toFixed(2));
        fila.find('[data-type="precio_total"]').text(precioTotal.toFixed(2));
    }
    
    

    document.addEventListener('DOMContentLoaded', function () {
        function actualizarStockYCosto() {
            const cantidad = parseFloat(document.getElementById('cantidad').value) || 0;
            const salidas = parseFloat(document.getElementById('salidas').value) || 0;
            const precioUnitario = parseFloat(document.getElementById('precio-unitario').value) || 0;

            // Cálculo de stock
            const stock = Math.round(cantidad - salidas);

            // Cálculo de costo total
            const costoTotal = Math.round(stock * precioUnitario);

            // Actualizar los campos con valores enteros
            document.getElementById('stock').value = stock;
            document.getElementById('precio-total').value = costoTotal;
        }

        // Agrega eventos de cambio a los campos relevantes
        document.getElementById('cantidad').addEventListener('input', actualizarStockYCosto);
        document.getElementById('salidas').addEventListener('input', actualizarStockYCosto);
        document.getElementById('precio-unitario').addEventListener('input', actualizarStockYCosto);

        // Aquí asumes que ya existe la funcionalidad para enviar datos en tu archivo JS, se llama en este lugar
        document.getElementById('submit').addEventListener('click', function () {
            
        });
    }
);
