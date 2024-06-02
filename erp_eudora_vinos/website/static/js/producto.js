$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR */

    $('#submit').on('click', function(){
        var validador = 0;
        $SKU = $('#SKU').val();
        $tipo_producto = $('#tipo-producto').val();
        $viña = $('#viña').val();
        $cepa = $('#cepa').val();
        $nombre_producto = $('#nombre-producto').val();
        $cosecha = $('#cosecha').val();
    
        /*usaremos el codigo base, nos permite saber si uno de los datos que se ingresan es vacio,
        pero ahora ademas de eso, se validara si el SKU ya existe en la base de datos.
        utilizaremos un if para verificar si el SKU ya existe y si los datos son validos, si es asi, se mostrara un mensaje de error
        luego un else que agregara el dato a la base de datos
        */ 
       if ($SKU == '' || $tipo_producto == '' || $viña == '' || $cepa == '' || $nombre_producto == '' || $cosecha == '' ){
            validador = 1;
            alert('Por favor ingrese valores correctos');
        }
        /* comprobamos ahora que no este en la base de datos el sku */
        else if ($cosecha < 1800 || $cosecha > 2050){
            validador = 1;
            alert('Por favor ingrese una año de cosecha valida');
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

    /* comprobar si se puede editar */

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
        if (type === "cosecha" && (value < 1800 || value > 2050)) {
            alert("El valor para 'cosecha' debe estar entre 1800 y 2050");
            return; // No enviar los datos al servidor
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
});


/*
        console.log(SKU);
        console.log(value);
        console.log(type);
        $.ajax({
            url: '/producto/update/',
            type: 'POST',
            data: {
                SKU: SKU,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
        })  
        .done(function(response){
            console.log(response);
        })
        .fail(function(){
            console.log('Error');
        });
*/
/*
        console.log("Sending to server:", sku, value, type);  // Log para ver qué datos se están enviando
        $.ajax({
            url: '/producto/update/',
            type: 'POST',
            data: {
                sku: sku,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }
        })
        .done(function(response) {
            console.log(response);
        })
        .fail(function() {
            console.log('Error');
        });
        }
        
*/
