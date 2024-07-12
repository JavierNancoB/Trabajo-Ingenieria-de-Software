$(document).ready(function(){

    /* OJO QUE DEBEMOS TENER BIEN LA BASE DE DATOS PARA PODER EDITAR LA TABLA SIN ERRORES */


    $('#table').DataTable();
    
    /* AÑADIR */

    $('#submit').on('click', function(){
        var validador = 0;
        $nombre_prov = $('#nombre_prov').val();
        $email_empresa = $('#email_empresa').val();
        $telefono_empresa = $('#telefono_empresa').val();
    
        /*

        comprueba que no haya campos vacios, que no se excedan los caracteres permitidos
        
        */ 
        
        if ($nombre_prov == '' || $email_empresa == '' || $telefono_empresa == '' ){
            validador = 1;
            alert('Por favor no deje campos vacios');
        }
        else if ($nombre_prov.length > 50 || $email_empresa.length > 150 || $telefono_empresa.length > 15) {
            validador = 1;
            alert("Uno o más campos exceden el límite de caracteres permitidos.");
        }
        else if (isNaN($telefono_empresa)) 
        {
            validador = 1;
            alert("El valor para el teléfono debe ser numérico.");
        }
        var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email_regex.test($email_empresa)) {
            validador = 1;
            alert("Por favor ingrese un correo electrónico válido.");
        }
        else{
            /* Recorremos la tabla para comparar cada rut */
            var nombre_prov_existe = false;
            // debemos asegurarnos que el rut no exista en la tabla
            $('#table tbody tr').each(function() {
                var nombre_prov = $(this).find('td').eq(0).text();
                if(nombre_prov == $nombre_prov) {
                    nombre_prov_existe = true;
                }
            });
            if(nombre_prov_existe) {
                alert('El Rut de la empresa ya existe en la tabla');
            }else{
                /* Si el rut empresa no existe en la tabla, procedemos a la inserción */
                console.log($nombre_prov);
                /* email_empresa no se puede */
                console.log($email_empresa);
                console.log($telefono_empresa);
                $.ajax({
                    
                    type: 'POST',
                    url: 'insert/',
                    data: {
                        nombre_prov: $nombre_prov,
                        email_empresa: $email_empresa,
                        telefono_empresa: $telefono_empresa,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        console.log("entro"),
                        alert('Se guardó correctamente al proveedor');
                        $('#nombre_prov').val('');
                        $('#email_empresa').val('');
                        $('#telefono_empresa').val('');
                        window.location='/proveedor';
                    }
                });
            }
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
    $(document).on('blur', '.input-data', function(){
        var value=$(this).val();
        var td=$(this).parent('td');
        var nombre_prov=td.data('nombre_prov');
        console.log(nombre_prov);
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        var type=td.data('type');
        sendToServer(td.data("nombre_prov"), value, type);
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
            var nombre_prov = td.data("nombre_prov");
            console.log(nombre_prov);
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            sendToServer(td.data("nombre_prov"), value, type);
        }
    });
    function sendToServer(nombre_prov, value, type){
        var td = $("[data-nombre_prov='" + nombre_prov + "']").parent('td');
        var tr = td.closest('tr');
        // Validaciones
        if (type=="telefono_empresa" && isNaN(value)) {
            alert("El valor debe ser numérico.");
            return; // No enviar los datos al servidor si el valor no es numérico
        }
        switch (type) {
            case "email_empresa":
                if (value.length > 150) {
                    tr.addClass('table-warning');
                    alert("El valor para el email no puede tener más de 150 caracteres.");
                    return; // No enviar los datos al servidor
                }
                var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email_regex.test(value)) {
                    tr.addClass('table-warning');
                    alert("Por favor ingrese un correo electrónico válido.");
                    
                    return; // No enviar los datos al servidor si el correo no es válido
                }
                break;
            case "telefono_empresa":
                if (value.length > 15) {
                    tr.addClass('table-warning');
                    alert("El valor para el telefono no puede tener más de 15 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            default:
                break;
        }
        console.log("Sending to server:", nombre_prov, value, type);  // Log para ver qué datos se están enviando
        $.ajax({
            url: 'update/',
            type: 'POST',
            data: {
                nombre_prov: nombre_prov,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }
        })
        .done(function(response) {
            alert('Se guardó correctamente el proveedor');
            tr.addClass('table-light');
            console.log(response);
        })
        .fail(function() {
            tr.addClass('table-warning');
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
                    var nombre_prov = $(this).data('nombre_prov');
                    console.log('Eliminando proveedor ' + nombre_prov);
                    $.ajax({
                        url: '/proveedor/delete/' + nombre_prov, // Usando la ruta existente
                        type: 'POST',
                        headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                        success: function(response) {
                            console.log('Proveedor ' + nombre_prov + ' eliminado');
                        },
                        error: function(xhr) {
                            console.log('Error al eliminar el proveedor ' + nombre_prov);
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
