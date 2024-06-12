$(document).ready(function() {
    $('#table').DataTable();
    
    $('#submit').on('click', function() {
        var validador = 0;
        
        $SKU = $('#SKU').val();
        $nombre_prov = $('#nombre-prov').val();
        $cepa = $('#cepa').val();
        $cosecha = $('#cosecha').val();
        $nombre_producto = $('#nombre-producto').val();
        $viña = $('#viña').val();
        $bodega = $('#bodega').val();
        $fecha_de_ingreso = $('#fecha-ingreso').val();
        $cantidad = $('#cantidad').val();
        $salidas = $('#salidas').val();
        $mov_bodegas = $('#mov-bodegas').val();
        $stock = $('#stock').val();
        $precio_unitario = $('#precio-unitario').val();
        $precio_total = $('#precio-total').val();

        // Comprobación de campos vacíos
        if ($SKU == '' || $nombre_prov == '' || $cepa == '' || $cosecha == '' || $nombre_producto == '' || $viña == '' || $bodega == '' || $fecha_de_ingreso == '' || $cantidad == '' || $salidas == '' || $mov_bodegas == '' || $stock == '' || $precio_unitario == '' || $precio_total == '') {
            validador = 1;
            alert('Por favor no deje campos vacíos');
        }

        // Aquí insertas las validaciones adicionales
        if (isNaN($cantidad) || $cantidad <= 0) {
            alert("El valor de 'cantidad' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (isNaN($precio_unitario) || $precio_unitario <= 0) {
            alert("El valor de 'precio unitario' debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
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
        var skuExiste = false;
        $('#table tbody tr').each(function() {
            var sku = $(this).find('td').eq(0).text();
            if (sku == $SKU) {
                skuExiste = true;
            }
        });

        if (skuExiste) {
            alert('El SKU ya existe en la tabla');
        } else {
            alert('SKU no existe en la tabla');

            // Proceso de inserción si todas las validaciones son correctas
            $.ajax({
                type: 'POST',
                url: 'insert/',
                data: {
                    SKU: $SKU,
                    nombre_prov: $nombre_prov,
                    cepa: $cepa,
                    cosecha: $cosecha,
                    nombre_producto: $nombre_producto,
                    viña: $viña,
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
                    $('#nombre-prov').val('');
                    $('#cepa').val('');
                    $('#cosecha').val('');
                    $('#nombre-producto').val('');
                    $('#viña').val('');
                    $('#bodega').val('');
                    $('#fecha-ingreso').val('');
                    $('#cantidad').val('');
                    $('#salidas').val('');
                    $('#mov-bodegas').val('');
                    $('#stock').val('');
                    $('#precio-unitario').val('');
                    $('#precio-total').val('');
                    window.location='/Inventario_Y_Stock';
                }
            });
        }
    });


    /* EDITAR */

    /* comprobar si la casilla editar esta activada */

    // Función que comprueba si la casilla de edición está activada
    function isEditingEnabled() {
        // Retorna true si la casilla con id 'flexSwitchCheckDefault' está marcada
        return $('#flexSwitchCheckDefault').prop('checked');
    }

    // Evento que se activa al hacer doble clic en un elemento con clase 'editable'
    $(document).on('dblclick', '.editable', function() {
        // Comprueba si la edición está habilitada
        if (isEditingEnabled()) {
            // Obtiene el texto actual del elemento
            var value = $(this).text();
            // Crea un input con el valor actual y lo inserta en el elemento
            var input = "<input type='text' class='input-data' value='" + value + "' class='form-control' /> ";
            $(this).html(input);
            // Elimina la clase 'editable' del elemento
            $(this).removeClass('editable');
        }
    });

    // Evento que se activa al perder el foco un input con clase 'input-data'
    $(document).on('blur', '.input-data', function() {
        // Obtiene el valor del input
        var value = $(this).val();
        // Obtiene el elemento padre (td) del input
        var td = $(this).parent('td');
        // Obtiene el SKU del atributo 'data-sku' del td
        var SKU = td.data('sku');
        console.log(SKU);
        // Elimina el input
        $(this).remove();
        // Inserta el valor en el td
        td.html(value);
        // Añade de nuevo la clase 'editable' al td
        td.addClass('editable');
        // Obtiene el tipo del atributo 'data-type' del td
        var type = td.data('type');
        // Envía los datos al servidor
        sendToServer(td.data("sku"), value, type);
    });

    // Evento que se activa al presionar una tecla en un input con clase 'input-data'
    $(document).on('keypress', '.input-data', function(e) {
        // Obtiene el código de la tecla presionada
        var key = e.which;
        // Si la tecla presionada es Enter (código 13)
        if (key == 13) {
            // Obtiene el valor del input
            var value = $(this).val();
            console.log(value);
            // Obtiene el elemento padre (td) del input
            var td = $(this).parent("td");
            console.log(td);
            // Obtiene el tipo del atributo 'data-type' del td
            var type = td.data("type");
            console.log(type);
            // Obtiene el SKU del atributo 'data-sku' del td
            var SKU = td.data("sku");
            console.log(SKU);
            // Elimina el input
            $(this).remove();
            // Inserta el valor en el td
            td.html(value);
            // Añade de nuevo la clase 'editable' al td
            td.addClass("editable");
            // Envía los datos al servidor
            sendToServer(td.data("sku"), value, type);
        }
    });

    // Función que envía los datos al servidor
    function sendToServer(SKU, value, type) {
        
        if (type == "cantidad" && isNaN(value) || value <= 0) { // no se el limite de cantidad
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "precio_unitario" && isNaN(value) || value <= 0) {
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "precio_total" && isNaN(value) || value <= 0) {
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "salidas" && isNaN(value) || value <= 0) {
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "stock" && isNaN(value) || value <= 0) {
            alert("El valor debe ser numérico y mayor a cero.");
            return; // No enviar los datos al servidor
        }
        // Validar fecha actual
        var fechaActual = new Date().toISOString().split('T')[0];
        var partesFecha = fechaActual.split('-');
        var año = partesFecha[0];
        var mes = partesFecha[1];
        var dia = partesFecha[2];

        //guardar fecha ingresada
        
        // Fecha ingresada
        var partesFechaIngreso = value.split('-');
        var yyyy = partesFechaIngreso[0];
        var mm = partesFechaIngreso[1];
        var dd = partesFechaIngreso[2];

        if (partesFechaIngreso.includes('-')) {//lo puse ya que si uno apretaba editar fecha y no la editaba le salia que la fecha ingresada no podia ser mayor a la actual
               
            if ((yyyy > año) || (yyyy == año && mm > mes) || (yyyy == año && mm == mes && dd > dia)) {
                alert('La fecha de ingreso no puede ser mayor a la fecha actual, intente nuevamente.');
                alert("partesFechaIngreso: " + partesFechaIngreso);
                alert("partesFechaIngresooooo: " + yyyy + mm + dd);
                return;
            }
        }
        

        // Validaciones para diferentes tipos de datos
        switch (type) {
            case "nombre_producto":
                if (value.length > 50) {
                    alert("El valor para 'nombre de producto' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;

            case "viña":
                if (value.length > 150) {
                    alert("El valor para 'viña' no puede tener más de 150 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "cepa":
                if (value.length > 50) {
                    alert("El valor para 'cepa' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "cosecha":
                if (value.length > 50) {
                    alert("El valor para 'cosecha' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "bodega":
                if (value.length > 150) {
                    alert("El valor para 'bodega' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "mov_bodegas":
                if (value.length > 50) {
                    alert("El valor para 'bodegas' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "nombre_prov":
                if (value.length > 150) {
                    alert("El valor para 'nombre proveedores' no puede tener más de 150 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            default:
                break;
        }
        // Log para ver qué datos se están enviando
        console.log("Sending to server:", SKU, value, type);
        // Envío de datos al servidor mediante AJAX
        $.ajax({
            url: 'update/', // URL a la que se envían los datos
            type: 'POST', // Tipo de petición
            data: {
                SKU: SKU, // SKU del producto
                value: value, // Valor actualizado
                type: type, // Tipo de dato actualizado
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val() // Token CSRF para la seguridad
            }
        })
        .done(function(response) {
            // Alerta y log en caso de éxito
            alert('Se guardó correctamente luego de editarlo');
            //alert('La fecha actual es: ' + año + mes + dia);
            //alert('La fecha de ingreso es: ' + yyyy + mm + dd);
            console.log(response);
        })
        .fail(function() {
            // Log en caso de error
            alert('Ocurrio un error, vuelva a intentarlo');
            
            console.log('Error');
        });
    }


    /* ELIMINAR */
    $(document).on('click', '.delete', function(e){
        if (!isEditingEnabled()) { // Si la edición no está habilitada, prevenir la acción de eliminación
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar productos.');
        }
        else {
            var confirmation = confirm('¿Está seguro de que desea eliminar este producto?');
            if (confirmation==false)
                e.preventDefault();
        }
    });
});