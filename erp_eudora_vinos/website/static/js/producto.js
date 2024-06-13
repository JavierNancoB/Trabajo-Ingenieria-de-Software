$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR */
    document.addEventListener('DOMContentLoaded', function () {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('openModal') === 'true') {
            new bootstrap.Modal(document.getElementById('addnewproducto')).show();
        }
    });

    $('#submit').on('click', function(){
        var validador = 0;
        $SKU = $('#SKU').val();
        $tipo_producto = $('#tipo-producto').val();
        $viña = $('#viña').val();
        $cepa = $('#cepa').val();
        $nombre_producto = $('#nombre-producto').val();
        $cosecha = $('#cosecha').val();
    
        /*

        comprueba que no haya campos vacios, que no se excedan los limites de caracteres
        y que el año de cosecha sea valido (1800-2050).
        
        */ 
        
        if ($SKU == '' || $tipo_producto == '' || $viña == '' || $cepa == '' || $nombre_producto == '' || $cosecha == '' ){
            validador = 1;
            alert('Por favor no deje campos vacios');
        }

        else{
            /* Recorremos la tabla para comparar cada SKU */
            var skuExiste = false;
            // debemos asegurarnos que el SKU no exista en la tabla
            $('#table tbody tr').each(function() {
                var sku = $(this).find('td').eq(0).text();
                if(sku == $SKU) {
                    skuExiste = true;
                }
            });
            if(skuExiste) {
                alert('El SKU ya existe en la tabla');
            }else{
                /* Si el SKU no existe en la tabla, procedemos a la inserción */
                $.ajax({
                    type: 'POST',
                    url: 'insert/',
                    data: {
                        SKU: $SKU,
                        tipo_producto: $tipo_producto,
                        viña: $viña,
                        cepa: $cepa,
                        nombre_producto: $nombre_producto,
                        cosecha: $cosecha,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        alert('Se guardó correctamente el producto');
                        $('#SKU').val('');
                        $('#tipo-producto').val('');
                        $('#viña').val('');
                        $('#cepa').val('');
                        $('#nombre-producto').val('');
                        $('#cosecha').val('');
                        window.location='/producto';
                    }
                });
            }
        }
    });

    /* EDITAR */

    /* comprobar si la casilla editar esta activada */

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
        var SKU=td.data('sku');
        console.log(SKU);
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        var type=td.data('type');
        sendToServer(td.data("sku"), value, type);
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
            var SKU = td.data("sku");
            console.log(SKU);
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            sendToServer(td.data("sku"), value, type);
        }
    });
    function sendToServer(SKU, value, type){
        if (type=="cosecha" && isNaN(value)) {
            alert("El valor debe ser numérico.");
            return; // No enviar los datos al servidor si el valor no es numérico
        }
        if (type === "cosecha" && (value < 1800 || value > 2050)) {
            alert("El valor para 'cosecha' debe estar entre 1800 y 2050");
            return; // No enviar los datos al servidor
        }
        switch (type) {
            case "tipo_producto":
                if (value.length > 50) {
                    alert("El valor para 'tipo de producto' no puede tener más de 50 caracteres.");
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
            case "nombre_producto":
                if (value.length > 50) {
                    alert("El valor para 'nombre de producto' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "cosecha":
                if (value.length > 50) {
                    alert("El valor para 'cosecha' no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            default:
                break;
        }
        console.log("Sending to server:", SKU, value, type);  // Log para ver qué datos se están enviando
        $.ajax({
            url: 'update/',
            type: 'POST',
            data: {
                SKU: SKU,
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
    /* ELIMINAR SELECTIVAMENTE */
    /* Las casillas seleccionadas se podran eliminar despues de presionar el boton eliminar */

    $('#eliminar-seleccion').on('click', function(e){
        if (!isEditingEnabled()) {
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar productos.');
        } else {
            var confirmation = confirm('¿Está seguro de que desea eliminar los productos seleccionados?');
            if (confirmation) {
                $('input[name="seleccionar"]:checked').each(function() {
                    var sku = $(this).data('sku');
    
                    $.ajax({
                        url: '/producto/delete/' + sku, // Usando la ruta existente
                        type: 'POST',
                        headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                        success: function(response) {
                            console.log('Producto con SKU ' + sku + ' eliminado');
                        },
                        error: function(xhr) {
                            console.log('Error al eliminar el producto con SKU ' + sku);
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
