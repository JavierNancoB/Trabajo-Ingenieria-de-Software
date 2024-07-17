$(document).ready(function(){
    $('#table').DataTable();
        // Manejar la acción de hacer clic en el botón de sincronización
        $('#boton-adicional').click(function() {
            $.ajax({
                url: "/sync-woocommerce/",
                type: 'POST',
                headers: {
                    'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(response) {
                    if (response.status === 'success') {
                        alert('Sincronización exitosa');
                        location.reload();  // Recargar la página para mostrar los datos actualizados
                    } else {
                        alert('Error al sincronizar: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Error al sincronizar: ' + error);
                }
            });
        });
    /* AÑADIR */

    function calcularValores() {
        var cantidad = parseFloat(document.getElementById('cantidad').value) || 0;
        var precioUnitario = parseFloat(document.getElementById('precio_unitario').value) || 0;
        var flete = parseFloat(document.getElementById('flete').value) || 0;

        // Calcula la venta total
        var ventaTotal = cantidad * precioUnitario;
        document.getElementById('venta_total').value = Math.round(ventaTotal); // Redondeo a número entero

        // Calcula el pago total
        var pagoTotal = ventaTotal + flete;
        document.getElementById('pago').value = Math.round(pagoTotal); // Redondeo a número entero
    }

    // Eventos que disparan el cálculo
    document.getElementById('cantidad').addEventListener('change', calcularValores);
    document.getElementById('precio_unitario').addEventListener('change', calcularValores);
    document.getElementById('flete').addEventListener('change', calcularValores);
    
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
            url: '/api/cliente/',
            type: 'GET',
            success: function(data) {
                var selectProveedor = $('#rut');
                selectProveedor.empty();
                data.ruts.forEach(function(rut) {
                    selectProveedor.append($('<option>', { value: rut, text: rut }));
                });
            },
            error: function() {
                console.error('Error cargando los ruts de clientes');
            }
        });
        calcularTotales();
    });

    $('#submit').on('click', function(){

        var $pedido = $('#pedido').val();
        var $rut = $('#rut').val();
        var $SKU = $('#SKU').val();
        var $precio_unitario = $('#precio_unitario').val();
        var $cantidad = $('#cantidad').val();
        var $venta_total = parseInt($('#venta_total').val()) || 0;  // Asegurar que es un número
        var $flete = parseInt($('#flete').val()) || 0;  // Asegurar que es un número
        var $factura_o_boleta = $('#factura_o_boleta').val();
        var $fecha_boleta = $('#fecha_boleta').val();
        var $pago = $('#pago').val();
        
    
        // Comprobación de que no haya campos vacíos
        if ($pedido === '' || $rut === '' || $SKU === '' || $precio_unitario === '' || $cantidad === '' || $venta_total === '' || $flete === '' || $factura_o_boleta === '' || $fecha_boleta === '' || $pago === '') {
            alert('Por favor, llene todos los campos.');
            return;
        }

        // Validación de comprador

        // Validación de fecha

        // Validación de venta_total
        if (isNaN($venta_total) || $venta_total < 0) {
            alert("El valor para 'venta total' debe ser un número positivo.");
            e.preventDefault();
            return;
        }

        // Validación de flete
        if (isNaN($flete) || $flete < 0) {
            alert("El valor para 'flete' debe ser un número positivo.");
            e.preventDefault();
            return;
        }
        else{
            $.ajax({
                type: 'POST',
                url: 'insert/',
                data: {
                    pedido: $pedido,
                    rut: $rut,
                    SKU: $SKU,
                    precio_unitario: $precio_unitario,
                    cantidad: $cantidad,
                    venta_total: $venta_total,
                    flete: $flete,
                    factura_o_boleta: $factura_o_boleta,
                    fecha_boleta: $fecha_boleta,
                    pago: $pago,
                    
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(){
                    $('#pedido').val('');
                    $('#rut').val('');
                    $('#SKU').val('');
                    $('#precio_unitario').val('');
                    $('#cantidad').val('');
                    $('#venta_total').val('');
                    $('#flete').val('');
                    $('#factura_o_boleta').val('');
                    $('#fecha_boleta').val('');
                    $('#pago').val('');
                    alert('Se guardó correctamente la venta');
                    window.location='/venta';
                }
            });
        }
    });
    /* EDITAR */

    /* comprobar si la casilla editar esta actfecha_boletada */
/*
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
    */
    /*
        function actualizarPago(pedido) { // Función para actualizar el stock de un producto
            // Buscar en la fila del id_inventario específico
            const row = $(`td[data-id_inventario='${pedido}'][data-type='venta_total']`).closest('tr');
        
            // Extraer los valores de los inputs de cantidad, salidas y movimiento de bodegas
            const ventaTotal = parseFloat(row.find(`td[data-id_inventario='${pedido}'][data-type='venta_total']`).text()) || 0;
            const envio = parseFloat(row.find(`td[data-id_inventario='${pedido}'][data-type='envio']`).text()) || 0;
            //const movBodegas = parseFloat(row.find(`td[data-id_inventario='${idInventario}'][data-type='mov_bodega']`).text()) || 0;
        
            // Calcular el nuevo stock
            const pago = Math.round(ventaTotal + envio);
        
            // Actualizar el valor del stock en la fila
            row.find(`td[data-id_inventario='${pedido}'][data-type='stock']`).text(pago);
        
            // Llamar a la función sendToServer para enviar los cambios al servidor
            addToRequestQueue(pedido, pago, 'pago');
        }
    */
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

        let requestQueue = [];
        let isRequestInProgress = false;
        
        function addToRequestQueue(pedido, value, type) {
            requestQueue.push({ pedido, value, type });
            processNextRequest();
        }
        
        function processNextRequest() {
            if (isRequestInProgress || requestQueue.length === 0) {
                return;
            }
        
            isRequestInProgress = true;
            const { pedido, value, type } = requestQueue.shift();
        
            $.ajax({
                url: 'update/', // Asegúrate que la URL es correcta
                type: 'POST',
                data: {
                    pedido: pedido,
                    value: value,
                    type: type,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                },
                success: function(response) {
                    console.log('Success:', response);
                    
                    // ahora si type es distinto de pago o venta_total, entonces se mandara este mensaje
                    if (type !== 'pago' && type !== 'venta_total') {
                        alert('Se guardó correctamente la venta editada, por favor recargue la página para ver los cambios.');
                    }
                    isRequestInProgress = false;
                    processNextRequest();
                },
                error: function(xhr, status, error) {
                    console.error('Error:', xhr.responseText);
                    isRequestInProgress = false;
                    processNextRequest();  // Decide si quieres reintentar automáticamente o no
                }
            });
        }
        
        // Modifica el evento keypress para usar addToRequestQueue
        $(document).on('keypress', '.input-data', function(e){
            var key = e.which;
            if (key == 13) { // Tecla Enter
                var value = $(this).val();
                var td = $(this).parent("td");
                var type = td.data("type");
                var pedido = td.data("pedido");
                $(this).remove();
                td.html(value);
                td.addClass("editable");
                
                console.log('Pedido:', pedido, 'Valor:', value, 'Tipo:', type);
                if (type == 'fecha_boleta') {
                    value = transformarFecha(value);
                }
                addToRequestQueue(pedido, value, type);

               if (type == 'venta_total' || type == 'flete' || type == 'pago' || type == 'precio_unitario' || type == 'cantidad' ) {
                    var cantidad = parseFloat($(`td[data-pedido='${pedido}'][data-type='cantidad']`).text()) || 0;
                    var precio_unitario = parseFloat($(`td[data-pedido='${pedido}'][data-type='precio_unitario']`).text()) || 0;
                    var flete = parseFloat($(`td[data-pedido='${pedido}'][data-type='flete']`).text()) || 0;
                    var venta_total = cantidad * precio_unitario;
                    var pago = venta_total + flete;
                    addToRequestQueue(pedido, venta_total, 'venta_total');
                    addToRequestQueue(pedido, pago, 'pago');
               }
            }
        });
        
        // También actualizar el evento blur para usar addToRequestQueue
        $(document).on('blur', '.input-data', function(){
            var value=$(this).val();
            var td=$(this).parent('td');
            var pedido=td.data('pedido');
            var type = td.data("type");
            $(this).remove();
            td.html(value);
            td.addClass('editable');
            if (type === 'fecha_boleta') {
                value = transformarFecha(value);
            }
            console.log('Pedido:', pedido, 'Valor:', value, 'Tipo:', td.data('type'));
            if (type == 'venta_total' || type == 'flete' || type == 'pago' || type == 'precio_unitario' || type == 'cantidad' ) {
                var cantidad = parseFloat($(`td[data-pedido='${pedido}'][data-type='cantidad']`).text()) || 0;
                var precio_unitario = parseFloat($(`td[data-pedido='${pedido}'][data-type='precio_unitario']`).text()) || 0;
                var flete = parseFloat($(`td[data-pedido='${pedido}'][data-type='flete']`).text()) || 0;
                var venta_total = cantidad * precio_unitario;
                var pago = venta_total + flete;
                addToRequestQueue(pedido, pago, 'pago');
                console.log('Pedido:', pedido, 'Valor:', venta_total, 'Tipo:', 'venta_total');
                addToRequestQueue(pedido, venta_total, 'venta_total');
                console.log('Pedido:', pedido, 'Valor:', pago, 'Tipo:', 'pago');
                
            }
            addToRequestQueue(pedido, value, td.data('type'));

            
        });

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
            calcularTotales();
        });
        
        /* CALCULAR TOTALES */

        function calcularTotales() {
            let cantidadTotal = 0, ventasTotales = 0, fletesTotales = 0, pagoTotal = 0;
        
            // Selecciona cada fila en el cuerpo de la tabla con id 'table'
            document.querySelectorAll("#table tbody tr").forEach(fila => {
                // Extrae los valores de las celdas de la fila y conviértelos a números apropiados
                const cantidad = parseInt(fila.cells[4].textContent) || 0;
                const ventas = parseInt(fila.cells[5].textContent) || 0;
                const fletes = parseInt(fila.cells[6].textContent) || 0;
                const pago = parseInt(fila.cells[9].textContent) || 0;
        
                // Acumula los totales de ingresos, salidas y movimientos de bodega
                cantidadTotal += cantidad;
                ventasTotales += ventas;
                fletesTotales += fletes;
                pagoTotal += pago;

            });
        
            // Muestra los totales calculados en los elementos del DOM correspondientes
            document.querySelector(".cantidad-total").textContent = cantidadTotal || 0;
            document.querySelector(".ventas-totales").textContent = ventasTotales || 0;
            document.querySelector(".fletes-totales").textContent = fletesTotales || 0;
            document.querySelector(".pago-total").textContent = pagoTotal || 0;
        }
        calcularTotales();
});

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

