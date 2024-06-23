$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR */

    $('#submit').on('click', function(){
        var validador = 0;
        var pedido = $('#pedido').val();
        var comprador = $('#comprador').val();
        var venta_total = parseInt($('#venta_total').val()) || 0;  // Asegurar que es un número
        var flete = parseInt($('#flete').val()) || 0;  // Asegurar que es un número
        var fecha_boleta = $('#fecha_boleta').val();
        var pago = venta_total + flete;  // Calcular pago como suma de venta_total y flete
    
        // Comprobación de que no haya campos vacíos
        if (pedido == '' || comprador == '' || $('#venta_total').val() == '' || $('#flete').val() == '' || fecha_boleta == '') {
            validador = 1;
            alert('Por favor no deje campos vacios');
        }

        // Validación de comprador
        if (comprador.length > 50) {
            alert("El valor para 'comprador' no puede tener más de 50 caracteres.");
            e.preventDefault();
            return;
        }

        // Validación de fecha
        var fechaIngresada = new Date(fecha_boleta);
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaIngresada > hoy) {
            alert("La fecha de la boleta no puede ser futura.");
            e.preventDefault();
            return;
        }

        // Validación de venta_total
        if (isNaN(venta_total) || venta_total < 0) {
            alert("El valor para 'venta total' debe ser un número positivo.");
            e.preventDefault();
            return;
        }

        // Validación de flete
        if (isNaN(flete) || flete < 0) {
            alert("El valor para 'flete' debe ser un número positivo.");
            e.preventDefault();
            return;
        }
        else{
            $.ajax({
                type: 'POST',
                url: 'insert/',
                data: {
                    pedido: pedido,
                    comprador: comprador,
                    venta_total: venta_total,  // Enviar como entero
                    flete: flete,              // Enviar como entero
                    fecha_boleta: fecha_boleta,
                    pago: pago,                // Enviar el pago calculado
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(){
                    alert('Se guardó correctamente la venta');
                    $('#pago').val('');  // Limpiar campos
                    $('#pedido').val('');
                    $('#comprador').val('');
                    $('#venta_total').val('');
                    $('#flete').val('');
                    $('#fecha_boleta').val('');
                    window.location='/venta';
                }
            });
        }
    });
    /* EDITAR */

    /* comprobar si la casilla editar esta actfecha_boletada */

    function isEditingEnabled() {
        return $('#flexSwitchCheckDefault').prop('checked');
    }
 
    $(document).on('dblclick', '.editable', function(){
        if (isEditingEnabled()) { // Comprueba si la edición está habilitada
            var value=$(this).text();
            var input="<input type='text' class='input-data' value='"+value+"' class='form-control' /> ";
            $(this).html(input);
            $(this).removeClass('editable');
        }
    });
    $(document).on('blur', '.input-data', function(){
        var value=$(this).val();
        var td=$(this).parent('td');
        var pedido=td.data('pedido');
        console.log(pedido);
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        var type=td.data('type');
        sendToServer(td.data("pedido"), value, type);
    }); 
    $(document).on('keypress', '.input-data', function(e){
        var key = e.which;
        if(key == 13){
            var value = $(this).val();
            console.log(value);
            var td = $(this).parent("td");
            console.log(td);
            var type = td.data("type");
            console.log(type);
            var pedido = td.data("pedido");
            console.log(pedido);
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            sendToServer(td.data("pedido"), value, type);
        }
    });
    function sendToServer(pedido, value, type){
        switch (type) {
            case "comprador":
                if (value.length > 50) {
                    alert("El valor para 'tipo de producto' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "fecha_boleta":
                var fechaIngresada = new Date(value);
                var hoy = new Date();
                hoy.setHours(0, 0, 0, 0);  // Ajustar la hora a medianoche para comparaciones precisas.
        
                // Validar que la fecha está en el formato correcto y no es futura
                if (isNaN(fechaIngresada.getTime())) {
                    alert("La fecha ingresada no es válida. Por favor, ingrese una fecha en formato YYYY-MM-DD.");
                    return; // No enviar los datos al servidor
                } else if (fechaIngresada > hoy) {
                    alert("La fecha de la boleta no puede ser futura.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "venta_total":
                if (isNaN(value) || value < 0) {
                    alert("El valor para 'venta total' debe ser un número positivo.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "flete":
                if (isNaN(value) || value < 0) {
                    alert("El valor para 'flete' debe ser un número positivo.");
                    return; // No enviar los datos al servidor
                }
                break;
        }
        console.log("Sending to server:", pedido, value, type);  // Log para ver qué datos se están enviando
        $.ajax({
            url: 'update/',
            type: 'POST',
            data: {
                pedido: pedido,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }
        })
        .done(function(response) {
            alert('Se guardó correctamente el producto');
            console.log(response);
        })
        .fail(function() {
            console.log('Error');
        });
    }
        /* ELIMINAR */
        $('#eliminar-seleccion').on('click', function(e){
            if (!isEditingEnabled()) {
                e.preventDefault();
                alert('Debe habilitar la edición para eliminar productos.');
            } else {
                var confirmation = confirm('¿Está seguro de que desea eliminar los productos seleccionados?');
                if (confirmation) {
                    $('input[name="seleccionar"]:checked').each(function() {
                        var pedido = $(this).data('pedido');
                        console.log('Intentando eliminar el pedido: ' + pedido);  // Verificación de consola
                        $.ajax({
                            url: '/venta/delete/' + pedido,
                            type: 'POST',
                            headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                            success: function(response) {
                                console.log('Producto con pedido ' + pedido + ' eliminado');
                                location.reload();  // Recargar la página después de todas las eliminaciones
                            },
                            error: function(xhr) {
                                console.log('Error al eliminar el producto con pedido ' + pedido);
                            }
                        });
                    });
                }
            }
        });
});