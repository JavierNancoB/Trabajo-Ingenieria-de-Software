$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR */

    $('#submit').on('click', function(){
        var validador = 0;
        $SKU = $('#SKU').val();
        $medio_de_pago = $('#medio_de_pago').val();
        $nombre_producto = $('#nombre_producto').val();
        $precio_unitario = $('#precio_unitario').val();
        $cantidad = $('#cantidad').val();
        $iva = $('#iva').val();
        $numero_boleta = $('#numero_boleta').val();
    
        /*

        comprueba que no haya campos vacios, que no se excedan los limites de caracteres
        y que el año de iva sea valido (1800-2050).
        
        */ 
        
        if ($SKU == '' || $medio_de_pago == '' || $nombre_producto == '' || $precio_unitario == '' || $cantidad == '' || $iva == '' || $numero_boleta == ''){
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
                        medio_de_pago: $medio_de_pago,
                        nombre_producto: $nombre_producto,
                        precio_unitario: $precio_unitario,
                        cantidad: $cantidad,
                        iva: $iva,
                        numero_boleta: $numero_boleta,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        alert('Se guardó correctamente la venta');
                        $('#SKU').val('');
                        $('#medio_de_pago').val('');
                        $('#nombre_producto').val('');
                        $('#precio_unitario').val('');
                        $('#cantidad').val('');
                        $('#iva').val('');
                        $('#numero_boleta').val('');
                        window.location='/venta';
                    }
                });
            }
        }
    });
});