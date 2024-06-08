$(document).ready(function(){

    /* OJO QUE DEBEMOS TENER BIEN LA BASE DE DATOS PARA PODER EDITAR LA TABLA SIN ERRORES */


    $('#table').DataTable();
    
    /* AÑADIR */

    $('#submit').on('click', function(){
        var validador = 0;
        $rut_empresa = $('#rut_empresa').val();
        $nombre_prov = $('#nombre_prov').val();
        $email_empresa = $('#email_empresa').val();
        $telefono_empresa = $('#telefono_empresa').val();
    
        /*

        comprueba que no haya campos vacios, que no se excedan los caracteres permitidos
        
        */ 
        
        if ($rut_empresa == '' || $nombre_prov == '' || $email_empresa == '' || $telefono_empresa == '' ){
            validador = 1;
            alert('Por favor no deje campos vacios');
        }
        else if ($rut_empresa.length > 12 || $nombre_prov.length > 50 || $email_empresa.length > 150 ||$telefono_empresa.length > 15) {
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
            var rut_empresa_existe = false;
            // debemos asegurarnos que el rut no exista en la tabla
            $('#table tbody tr').each(function() {
                var rut_empresa = $(this).find('td').eq(0).text();
                if(rut_empresa == $rut_empresa) {
                    rut_empresa_existe = true;
                }
            });
            if(rut_empresa_existe) {
                alert('El Rut de la empresa ya existe en la tabla');
            }else{
                /* Si el rut empresa no existe en la tabla, procedemos a la inserción */
                console.log($rut_empresa);
                console.log($nombre_prov);
                /* email_empresa no se puede */
                console.log($email_empresa);
                console.log($telefono_empresa);
                $.ajax({
                    
                    type: 'POST',
                    url: 'insert/',
                    data: {
                        rut_empresa: $rut_empresa,
                        nombre_prov: $nombre_prov,
                        email_empresa: $email_empresa,
                        telefono_empresa: $telefono_empresa,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function(){
                        console.log("entro"),
                        alert('Se guardó correctamente al proveedor');
                        $('#rut_empresa').val('');
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
        var rut_empresa=td.data('rut_empresa');
        console.log(rut_empresa);
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        var type=td.data('type');
        sendToServer(td.data("rut_empresa"), value, type);
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
            var rut_empresa = td.data("rut_empresa");
            console.log(rut_empresa);
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            sendToServer(td.data("rut_empresa"), value, type);
        }
    });
    function sendToServer(rut_empresa, value, type){
        if (type=="telefono_empresa" && isNaN(value)) {
            alert("El valor debe ser numérico.");
            return; // No enviar los datos al servidor si el valor no es numérico
        }
        switch (type) {
            case "nombre_prov":
                if (value.length > 50) {
                    alert("El valor para el nombre de los proveedores no puede tener más de 50 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            case "email_empresa":
                if (value.length > 150) {
                    alert("El valor para el email no puede tener más de 150 caracteres.");
                    return; // No enviar los datos al servidor
                }
                var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email_regex.test(value)) {
                    alert("Por favor ingrese un correo electrónico válido.");
                    return; // No enviar los datos al servidor si el correo no es válido
                }
                break;
            case "telefono_empresa":
                if (value.length > 15) {
                    alert("El valor para el telefono no puede tener más de 15 caracteres.");
                    return; // No enviar los datos al servidor
                }
                break;
            default:
                break;
        }
        console.log("Sending to server:", rut_empresa, value, type);  // Log para ver qué datos se están enviando
        $.ajax({
            url: 'update/',
            type: 'POST',
            data: {
                rut_empresa: rut_empresa,
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
