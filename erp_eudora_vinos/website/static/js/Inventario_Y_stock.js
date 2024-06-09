$(document).ready(function(){
    console.log('hola');
    $('#table').DataTable();
    
    /* AÑADIR */
    console.log('hola');
    $('#submit').on('click', function(){
        var validador = 0;
        console.log('hola');
        $SKU = $('#SKU').val();
        $nombre_producto = $('#nombre-producto').val();
        $cantidad = $('#cantidad').val();
        $precio_unitario = $('#precio-unitario').val();
        $fecha_de_ingreso = $('#fecha-ingreso').val();
        $venta = $('#venta').val();
        
        console.log($SKU);
        console.log($nombre_producto);
        console.log($cantidad);
        console.log($precio_unitario);
        console.log($fecha_de_ingreso);
        console.log($venta);

        /*

        comprueba que no haya campos vacios, que no se excedan los limites de caracteres
        y que el año de cosecha sea valido (1800-2050).
        
        */ 
        
        if ($SKU == '' || $nombre_producto == '' || $cantidad == '' || $precio_unitario == '' || $fecha_de_ingreso == '' || $venta == '' ){
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
                        nombre_producto: $nombre_producto,
                        cantidad: $cantidad,
                        precio_unitario: $precio_unitario,
                        fecha_de_ingreso: $fecha_de_ingreso,
                        venta: $venta,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        alert('Se guardó correctamente el producto');
                        $('#SKU').val('');
                        $('#nombre-producto').val('');
                        $('#cantidad').val('');
                        $('#precio-unitario').val('');
                        $('#fecha-ingreso').val('');
                        $('#venta').val('');
                        window.location='/Inventario_Y_Stock';
                    }
                });
            }
        }
    });

    /* ELIMINAR */
    function isEditingEnabled() {
        return $('#flexSwitchCheckDefault').prop('checked');
    }


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
    /* EDITAR */

    /* comprobar si la casilla editar esta activada */

