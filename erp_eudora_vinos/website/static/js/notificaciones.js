$(document).ready(function(){
    $('#table').DataTable();
    
    /* ELIMINAR ALERTA */
    $('#eliminar-seleccion').on('click', function(e){

        var confirmation = confirm('¿Está seguro de que desea eliminar los seleccionados?');
        if (confirmation) {
            $('input[name="seleccionar"]:checked').each(function() {
                var id_inventario = $(this).data('id_inventario');
                console.log('Eliminando notificación con id ' + id_inventario);

                $.ajax({
                    url: 'notificaciones/delete/' + id_inventario, // Usando la ruta existente
                    type: 'POST',
                    headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                    success: function(response) {
                        console.log('Notificacion con id ' + id_inventario + ' eliminado');
                    },
                    error: function(xhr) {
                        console.log('Error al eliminar la notificacion ' + id_inventario);
                    },
                    /*
                    complete: function() {
                        location.reload(); // Considera recargar después de todas las solicitudes, no en cada una
                    }
                    */
                });
            });
            }
        }
    );

});
