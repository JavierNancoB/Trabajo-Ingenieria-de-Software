//import { transformarFecha } from './tablas.js';

$(document).ready(function(){ 
    $('#table').DataTable();
    
    /* AÑADIR */
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
    
    // Función para cargar los datos de los proveedores y los SKU
    $(document).ready(function() {
        $('.dt-layout-row.dt-layout-table').addClass('table-responsive');

        $.ajax({
            url: '/api/skus/',  // Asegúrate de que esta URL es correcta según tu configuración de Django
            type: 'GET',
            success: function(data) { // data es el objeto que devuelve la API
                var select = $('#SKU');
                data.skus.forEach(function(sku) {
                    select.append($('<option>', { value: sku, text: sku }));
                });
            },
            error: function() { // Si hay un error en la petición
                console.error('Error cargando los SKU');
            }
        });
        $.ajax({ // Petición para obtener los nombres de los proveedores
            url: '/api/proveedores/',
            type: 'GET',
            success: function(data) { // data es el objeto que devuelve la API
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
    
    /* AÑADIR */

    $('#submit').on('click', function(){ //valida
        console.log('click');
        $OC = $('#OC').val();
        console.log($OC);
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
        console.log($fecha_pago);
        if ($OC == '' || $fecha_oc == '' || $SKU == '' || $nombre_prov == '' || $cantidad == '' || $numero_factura == ''|| $fecha_factura == '' || $status == '' || $fecha_vencimiento == '' || $costo_unitario == ''){
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
                $.ajax({ // Petición para insertar un nuevo proveedor
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
                    success: function(){ // Si la inserción es exitosa
                        
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
                        alert('Se guardó correctamente el producto');
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
 
    $(document).on('dblclick', '.editable', function(){ // Doble clic para editar
        if (isEditingEnabled()) { // Comprueba si la edición está habilitada
            var value=$(this).text();
            var input="<input type='text' class='input-data' value='"+value+"' class='form-control' /> ";
            // Status solo se podra modificar de pagado o pendiente
            if ($(this).data('type') === 'status') {
                input = "<select class='input-data form-select' class='form-control'><option value='pendiente'>Pendiente</option><option value='pagado'>Pagado</option></select>";
            }
            $(this).html(input);
            $(this).removeClass('editable');
        }
    });

    $(document).on('blur', '.input-data', function(){ // Al hacer clic fuera del input se guarda el valor
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

    $(document).on('keypress', '.input-data', function(e){ // Al presionar enter se guarda el valor
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
    
    function sendToServer(oc, value, type){     // Función para enviar los datos al servidor
        var td = $("[data-oc='" + oc + "']").parent('td');
        var tr = td.closest('tr');  // Obtener el <tr> más cercano
        if (type == "cantidad" && isNaN(value) || value <= 0) { // no se el limite de cantidad
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor o igual a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "costo_unitario" && isNaN(value) || value <= 0) {
            tr.addClass('table-warning');
            alert("El valor debe ser numérico y mayor o igual a cero.");
            return; // No enviar los datos al servidor
        }
        if (type == "status" && value != "pendiente" && value != "pagado") {
            tr.addClass('table-warning');
            alert("El valor debe ser 'pendiente' o 'pagado'.");
            return; // No enviar los datos al servidor
        }
        switch (type) { // Validar la longitud de los campos
            case "OC":
                if (value.length > 10) {
                    tr.addClass('table-warning');
                    alert("El valor para 'OC' no puede tener más de 10 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "fecha_oc":
                if (value.length > 10) {
                    tr.addClass('table-warning');
                    alert("El valor para 'fecha_oc' no puede tener más de 10 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "SKU":
                if (value.length > 50) {
                    tr.addClass('table-warning');
                    alert("El valor para 'SKU' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "nombre_prov":
                if (value.length > 150) {
                    tr.addClass('table-warning');
                    alert("El valor para 'nombre_prov' no puede tener más de 150 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "cantidad":
                if (value.length > 50) {
                    tr.addClass('table-warning');
                    alert("El valor para 'cantidad' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "numero_factura":
                if (value.length > 50) {
                    tr.addClass('table-warning');
                    alert("El valor para 'numero_factura' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "fecha_factura":
                if (value.length > 10) {
                    tr.addClass('table-warning');
                    alert("El valor para 'fecha_factura' no puede tener más de 10 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "status":
                if (value.length > 50) {
                    tr.addClass('table-warning');
                    alert("El valor para 'status' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "fecha_vencimiento":
                if (value.length > 10) {
                    tr.addClass('table-warning');
                    alert("El valor para 'fecha_vencimiento' no puede tener más de 10 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "fecha_pago":
                if (value.length > 10) {
                    tr.addClass('table-warning');
                    alert("El valor para 'fecha_pago' no puede tener más de 10 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "costo_unitario":
                if (value.length > 50) {
                    tr.addClass('table-warning');
                    alert("El valor para 'costo_unitario' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            default:
                break;
        }
        
        console.log("Sending to server:", oc, value, type);  // Log para ver qué datos se están enviando
        $.ajax({ // Enviamos los datos al servidor
            url: 'update/',
            type: 'POST',
            data: {
                OC: oc,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }
        })
        .done(function(response) {  // Si la petición es exitosa
            alert('Se guardó correctamente el proveedor');
            console.log(response);
        })
        .fail(function() { // Si la petición falla
            console.log('Error');
        });
    }

    /* ELIMINAR */

    $('#eliminar-seleccion').on('click', function(e){ // Al hacer clic en el botón de eliminar
        if(!isEditingEnabled()) { // Comprueba si la edición está habilitada
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar la compra.');
        }
        else  
        {
            var confirmation = confirm('¿Está seguro de que desea eliminar las compras seleccionadas?');
            if (confirmation) {
                $('input[name="seleccionar"]:checked').each(function() {
                    var oc = $(this).data('oc');

                    $.ajax({ // Petición para eliminar un proveedor
                        url: '/compra_proveedor/delete/' + oc, // Usando la ruta existente
                        type: 'POST',
                        headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                        success: function(response) {
                            console.log('Compra con OC ' + oc + ' eliminado');
                        },
                        error: function(xhr) {
                            console.log('Error al eliminar la compra con OC ' + oc);
                        },
                        complete: function() {
                            location.reload(); // Considera recargar después de todas las solicitudes, no en cada una
                        }
                    });
                });
            }
        }
        }
        
    );

    //$('#table').DataTable();
 //---------------------------------Funcion de totales---------------------------------
    function actualizarTotales() { // Función para actualizar los totales
        let totalCantidad = 0;
        let totalPagado = 0;
        $('#table tbody tr').each(function() {
            const cantidad = parseInt($(this).find('td').eq(4).text()); // Cambiar el indice en eq(4) por el de la columna cantidad
            const costoUnitario = parseFloat($(this).find('td').eq(10).text()); // Cambiar el indice en eq(10) por el de la columna costo unitario
            if (!isNaN(cantidad)) {
                totalCantidad += cantidad;
            }
            if (!isNaN(costoUnitario)) {
                totalPagado += cantidad * costoUnitario; // Multiplica la cantidad por el costo unitario para obtener el total pagado por la fila
            }
        });
        $('#total-cantidad').text(totalCantidad);
        $('#total-pagado').text(totalPagado); 
    }
    /*
    // Esta función ahora actualiza tanto el total de cantidades como el total pagado
    function sendToServer(oc, value, type) {
        $.ajax({
            url: 'update/',
            type: 'POST',
            data: {
                OC: oc,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function() {
                actualizarTotales();  // Actualizar después de cualquier cambio
            },
            error: function() {
                console.log('Error');
            }
        });
    }

    $('.editable').on('blur', '.input-data', function() {
        var value = $(this).val();
        var td = $(this).parent('td');
        var oc = td.data('oc');
        var type = td.data('type');
        if (type === 'fecha_oc' || type === 'fecha_factura' || type === 'fecha_vencimiento' || type === 'fecha_pago') {
            value = transformarFecha(value);
        }
        sendToServer(oc, value, type);
    });

    $('#submit').on('click', function() {
        actualizarTotales();  // Llamar después de añadir un nuevo proveedor
    });
    */
    /*
    $('#eliminar-seleccion').on('click', function() {
        if (confirm('¿Está seguro de que desea eliminar los productos seleccionados?')) {
            $('input[name="seleccionar"]:checked').each(function() {
                var oc = $(this).data('oc');
                $.ajax({
                    url: '/compra_proveedor/delete/' + oc,
                    type: 'POST',
                    headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                    success: function() {
                        console.log('Producto con OC ' + oc + ' eliminado');
                        actualizarTotales();  // Llamar después de eliminar un proveedor
                    },
                    error: function(xhr) {
                        console.log('Error al eliminar el producto con OC ' + oc);
                    }
                });
            });
        }
    });
    */

    actualizarTotales();  // Inicializar al cargar la página
    
 //---------------------------------Funcion de totales---------------------------------

});