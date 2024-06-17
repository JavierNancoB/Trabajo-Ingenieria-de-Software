import { transformarFecha } from './tablas.js';

$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR */
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
    });
    
    
    $('#submit').on('click', function(){
        $OC = $('#OC').val();
        $fecha_oc = $('#fecha_oc').val();
        $SKU = $('#SKU').val();
        $nombre_prov = $('#nombre_prov').val();
        $cantidad = $('#cantidad').val();
        $numero_factura = $('#numero_factura').val();
        $fecha_factura = $('#fecha_factura').val();
        $status = $('#status').val();
        $fecha_vencimiento = $('#fecha_vencimiento').val();
        $fecha_pago = $('#fecha_pago').val();
        $costo_unitario = $('#costo_unitario').val();
    
        console.log($OC, $fecha_oc, $SKU, $nombre_prov, $cantidad, $numero_factura, $fecha_factura, $status, $fecha_vencimiento, $fecha_pago, $costo_unitario);
        
        if ($OC == '' || $fecha_oc == '' || $SKU == '' || $nombre_prov == '' || $cantidad == '' || $numero_factura == ''|| $fecha_factura == '' || $status == '' || $fecha_vencimiento == '' || $fecha_pago == '' || $costo_unitario == ''){
            alert('Por favor no deje campos vacios');
        }

        else{
            /* Recorremos la tabla para comparar cada SKU */
            var OCexiste = false;
            // debemos asegurarnos que el SKU no exista en la tabla
            $('#table tbody tr').each(function() {
                var oc = $(this).find('td').eq(0).text();
                if(oc == $OC) {
                    OCexiste = true;
                }
            });
            if(OCexiste) {
                alert('El OC ya existe en la tabla');
            }else{
                /* Si el SKU no existe en la tabla, procedemos a la inserción */
                $.ajax({
                    type: 'POST',
                    url: 'insert/',
                    data: {
                        OC: $OC,
                        fecha_oc: $fecha_oc,
                        SKU: $SKU,
                        nombre_prov: $nombre_prov,
                        cantidad: $cantidad,
                        numero_factura: $numero_factura,
                        fecha_factura: $fecha_factura,
                        status: $status,
                        fecha_vencimiento: $fecha_vencimiento,
                        fecha_pago: $fecha_pago,
                        costo_unitario: $costo_unitario,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

                    },
                    success: function(){
                        alert('Se guardó correctamente el producto');
                        $('#OC').val('');
                        $('#fecha_oc').val('');
                        $('#SKU').val('');
                        $('#nombre_prov').val('');
                        $('#cantidad').val('');
                        $('#numero_factura').val('');
                        $('#fecha_factura').val('');
                        $('#status').val('');
                        $('#fecha_vencimiento').val('');
                        $('#fecha_pago').val('');
                        $('#costo_unitario').val('');
                        
                        window.location='/compra_proveedor';
                    }
                });
            }
        }
    });

    // COMPROBAR SI LA EDICIÓN ESTÁ HABILITADA

    function isEditingEnabled() {
        return $('#flexSwitchCheckDefault').prop('checked');
    }

    // EDITAR
 
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
        var oc=td.data('oc');
        console.log(oc);
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        var type=td.data('type');
        if (type === 'fecha_oc' || type === 'fecha_factura' || type === 'fecha_vencimiento' || type === 'fecha_pago') {
            value = transformarFecha(value);
        }
        sendToServer(td.data("oc"), value, type);
    });

    $(document).on('keypress', '.input-data', function(e){
        var key = e.which;
        if(key == 13){
            var value = $(this).val();
            console.log(value);
            var td = $(this).parent("td");
            console.log(td);
            var type = td.data("type");
            if (type === 'fecha_oc' || type === 'fecha_factura' || type === 'fecha_vencimiento' || type === 'fecha_pago') {
                value = transformarFecha(value);
            }
            console.log(type, "AWA", value);

            // td.data("OC"); sirve para obtener el valor de la columna OC
            // si Oc es un numero entero, se debe cambiar por el valor de la columna OC
            var oc = td.data("oc");

            $(this).remove();
            td.html(value);
            td.addClass("editable");
            console.log(td.data("oc"));
            sendToServer(td.data("oc"), value, type);
        }
    });
    
    function sendToServer(oc, value, type){
        
        console.log("Sending to server:", oc, value, type);  // Log para ver qué datos se están enviando
        $.ajax({
            url: 'update/',
            type: 'POST',
            data: {
                OC: oc,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }
        })
        .done(function(response) {
            alert('Se guardó correctamente el proveedor');
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
                    var oc = $(this).data('oc');
    
                    $.ajax({
                        url: '/compra_proveedor/delete/' + oc, // Usando la ruta existente
                        type: 'POST',
                        headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                        success: function(response) {
                            console.log('Producto con OC ' + oc + ' eliminado');
                        },
                        error: function(xhr) {
                            console.log('Error al eliminar el producto con OC ' + oc);
                        },
                        complete: function() {
                            location.reload(); // Considera recargar después de todas las solicitudes, no en cada una
                        }
                    });
                });
            }
        }
    });
});
