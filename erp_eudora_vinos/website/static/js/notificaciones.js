$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR ALERTA STOCK */
    $('#submit').on('click', function(){
        var validador = 0;
        var id_inventario = $('#id_inventario').val();
        var fecha_alerta = $('#fecha_alerta').val();

        // Comprobar que no haya campos vacíos
        if (id_inventario == '' || fecha_alerta == ''){
            validador = 1;
            alert('Por favor no deje campos vacíos');
        }
        else{
            /* Recorremos la tabla para comparar cada id_inventario */
            var inventarioExiste = false;
            // Aseguramos que el id_inventario no exista en la tabla
            $('#table tbody tr').each(function() {
                var inventario = $(this).find('td').eq(0).text();
                if(inventario == id_inventario) {
                    inventarioExiste = true;
                }
            });
            if(inventarioExiste) {
                alert('El id_inventario ya existe en la tabla');
            }else{
                /* Si el id_inventario no existe en la tabla, procedemos a la inserción */
                $.ajax({
                    type: 'POST',
                    url: 'insert_alerta_stock/',
                    data: {
                        id_inventario: id_inventario,
                        fecha_alerta: fecha_alerta,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        alert('Se guardó correctamente la alerta de stock');
                        $('#id_inventario').val('');
                        $('#fecha_alerta').val('');
                        window.location='/notificaciones';
                    }
                });
            }
        }
    });

    /* ELIMINAR ALERTA STOCK */
    $(document).on('click', '.delete', function(e){
        if (!isEditingEnabled()) { // Si la edición no está habilitada, prevenir la acción de eliminación
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar notificaciones.');
        }
        else {
            var confirmation = confirm('¿Está seguro de que desea eliminar esta notificación?');
            if (confirmation == false)
                e.preventDefault();
        }
    });

    function isEditingEnabled() {
        return $('#flexSwitchCheckDefault').is(':checked');
    }});
    