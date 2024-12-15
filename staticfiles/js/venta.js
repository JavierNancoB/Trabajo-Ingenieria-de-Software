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

        var $pedido = $('#pedido').val(); // Recuperar el valor del pedido
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
    
        // Validación de venta_total
        if (isNaN($venta_total) || $venta_total < 0) {
            alert("El valor para 'venta total' debe ser un número positivo.");
            return;
        }
    
        // Validación de flete
        if (isNaN($flete) || $flete < 0) {
            alert("El valor para 'flete' debe ser un número positivo.");
            return;
        }
        else{
            $.ajax({
                type: 'POST',
                url: 'insert/', // Asegúrate de que esta URL es correcta
                data: {
                    pedido: $pedido,  // Incluido nuevamente
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
                    $('#pedido').val(''); // Resetear el campo pedido si es necesario
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
                    window.location='/venta'; // Revisa si esta es la dirección correcta a redirigir
                }
            });
        }
    });

    /* EDITAR */
    
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
    
    function addToRequestQueue(id, value, type) {
        requestQueue.push({ id, value, type });
        processNextRequest();
    }
    
    function processNextRequest() {
        if (isRequestInProgress || requestQueue.length === 0) {
            return;
        }
    
        isRequestInProgress = true;
        const { id, value, type } = requestQueue.shift();
    
        $.ajax({
            url: 'update/', // Asegúrate que la URL es correcta
            type: 'POST',
            data: {
                id: id,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                console.log('Success:', response);
    
                // Ahora si type es distinto de pago o venta_total, entonces se mandará este mensaje
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
            var id = td.data("id");  // Cambiado de pedido a id
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            
            console.log('ID:', id, 'Valor:', value, 'Tipo:', type);  // Cambiado de pedido a ID en log
            if (type == 'fecha_boleta') {
                value = transformarFecha(value);
            }
            addToRequestQueue(id, value, type);  // Uso de id

            if (type == 'venta_total' || type == 'flete' || type == 'pago' || type == 'precio_unitario' || type == 'cantidad' ) {
                var cantidad = parseFloat($(`td[data-id='${id}'][data-type='cantidad']`).text()) || 0;  // Cambiado de pedido a id
                var precio_unitario = parseFloat($(`td[data-id='${id}'][data-type='precio_unitario']`).text()) || 0;  // Cambiado de pedido a id
                var flete = parseFloat($(`td[data-id='${id}'][data-type='flete']`).text()) || 0;  // Cambiado de pedido a id
                var venta_total = cantidad * precio_unitario;
                var pago = venta_total + flete;
                addToRequestQueue(id, venta_total, 'venta_total');  // Uso de id
                addToRequestQueue(id, pago, 'pago');  // Uso de id
            }
        }
    });

// También actualizar el evento blur para usar addToRequestQueue
$(document).on('blur', '.input-data', function(){
        var value = $(this).val();
        var td = $(this).parent('td');
        var id = td.data('id');  // Cambiado de pedido a id
        var type = td.data("type");
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        if (type === 'fecha_boleta') {
            value = transformarFecha(value);
        }
        console.log('ID:', id, 'Valor:', value, 'Tipo:', type);  // Cambiado de pedido a ID en log
        addToRequestQueue(id, value, type);  // Uso de id
    });

    /* ELIMINAR */
    $('#eliminar-seleccion').on('click', function(e){
        if (!isEditingEnabled()) {
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar ventas.');
        } else {
            var confirmation = confirm('¿Está seguro de que desea eliminar las ventas seleccionadas?');
            if (confirmation) {
                $('input[name="seleccionar"]:checked').each(function() {
                    var ventaId = $(this).data('id');
                    console.log('Intentando eliminar la venta con ID: ' + ventaId);  // Verificación de consola
                    $.ajax({
                        url: '/venta/delete/' + ventaId,
                        type: 'POST',
                        headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                        success: function(response) {
                            console.log('Venta con ID ' + ventaId + ' eliminada');
                            location.reload();  // Recargar la página después de todas las eliminaciones
                        },
                        error: function(xhr) {
                            console.log('Error al eliminar la venta con ID ' + ventaId);
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

