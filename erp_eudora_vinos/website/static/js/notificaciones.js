$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR ALERTA DE STOCK */
    $('#submit').on('click', function(){
        var id_inventario = $('#id_inventario').val();
        var fecha_alerta = $('#fecha_alerta').val();
        var cantidad = $('#cantidad').val(); // Asumiendo que tienes un campo para 'cantidad'
    
        // Comprobar que no haya campos vacíos
        if (id_inventario == '' || fecha_alerta == '' || cantidad == '') {
            alert('Por favor no deje campos vacíos');
        } else {
            // Verificar si el ID de inventario ya existe en la tabla
            var inventarioExiste = false;
            $('#table tbody tr').each(function() {
                var inventario = $(this).find('td').eq(0).text();
                if(inventario == id_inventario) {
                    inventarioExiste = true;
                }
            });
            if(inventarioExiste) {
                alert('El id_inventario ya existe en la tabla');
            } else {
                // Si el ID de inventario no existe, proceder a insertar
                $.ajax({
                    type: 'POST',
                    url: 'insert_alerta_stock/',
                    data: {
                        id_inventario: id_inventario,
                        fecha_alerta: fecha_alerta,
                        cantidad: cantidad,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        alert('Se guardó correctamente la alerta de stock');
                        $('#id_inventario').val('');
                        $('#fecha_alerta').val('');
                        $('#cantidad').val('');
                        window.location.reload(); // Considera recargar solo la tabla en lugar de toda la página
                    }
                });
            }
        }
    });

    /* EDITAR ALERTAS */
    // Esta sección debería adaptarse si tienes campos editables en tus notificaciones
    $(document).on('dblclick', '.editable', function(){
        if ($('#flexSwitchCheckDefault').is(':checked')) { // Verificar si la edición está habilitada
            var value = $(this).text();
            var input = "<input type='text' class='input-data' value='" + value + "' class='form-control' />";
            $(this).html(input);
            $(this).removeClass('editable');
        }
    });

    $(document).on('blur', '.input-data', function(){
        var value = $(this).val();
        var td = $(this).parent('td');
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        // Esta función debería adaptarse para enviar los datos actualizados al servidor
    });

    /* ELIMINAR ALERTA */
    $(document).on('click', '.delete', function(e){
        if (!$('#flexSwitchCheckDefault').is(':checked')) { // Verificar si la edición está deshabilitada
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar notificaciones.');
        } else {
            var confirmation = confirm('¿Está seguro de que desea eliminar esta notificación?');
            if (!confirmation) {
                e.preventDefault();
            } else {
                // Realizar la operación de eliminación
            }
        }
    });

});
