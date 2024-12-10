$(document).ready(function(){
    $('#table').DataTable();
    
    /* AÑADIR */
  //valida
    $('#submit').on('click', function(){ 
        let validador = 0;
        const $rut = $('#rut').val();
        const $nombre = $('#nombre').val();
      
        const $email = $('#email').val();
        const $comuna = $('#comuna').val();
        const $calle = $('#calle').val();
        const $numero_de_casa = $('#numero_de_casa').val();
        const $telefono = $('#telefono').val(); 
        

        // Validaciones de longitud y contenido
        const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const numberPattern = /^[0-9]+$/;
        const houseNumberPattern = /^[0-9]{1,6}[A-Za-z]?$/; // Números de 1 a 6 dígitos opcionalmente seguidos de una letra
        const rutPattern = /^[0-9]{3,8}[0-9Kk]$/;
        const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    

        // Validaciones
        if ($rut === '' || $nombre === '') {
            validador = 1;
            alert('Por favor no deje campos "rut" ni "nombre" vacio');
        } else if (!rutPattern.test($rut)) {
            validador = 1;
            alert('Por favor ingrese un RUT válido (sin puntos ni guión)');
        } else if (!namePattern.test($nombre)) {
            validador = 1;
            alert('El nombre y comuna solo deben contener letras y espacios');
        } else if ($email !== '') {
            if (!emailPattern.test($email)) {
                validador = 1;
                alert('Por favor ingrese un email válido');
            }
        } else if ($telefono !== '') {
            if (!numberPattern.test($telefono) || $telefono.length !== 9) {
                validador = 1;
                alert('Por favor ingrese un teléfono válido');
            }
        } else if ($nombre.length > 50 || $email.length > 30 || $calle.length > 100) {
            validador = 1;
            alert('El número de caracteres de un campo no cumple con la cantidad de caracteres permitidos');
        } else if ($comuna !== '' ) {
            console.log($comuna);
            if (!namePattern.test($comuna)) {
                validador = 1;
                alert('Por favor ingrese una comuna válida');
            }
            if ($comuna.length > 20) {
                validador = 1;
                alert('La comuna no debe tener más de 20 caracteres');
            }
        }
        else{
            /* Recorremos la tabla para comparar cada RUT */
            var rutExiste = false;
            // debemos asegurarnos que el RUT no exista en la tabla
            $('#table tbody tr').each(function() {
                var rut = $(this).find('td').eq(0).text();
                if(rut == $rut) {
                    rutExiste = true;
                }
            });
            if(rutExiste) {
                alert('El RUT ya existe en la tabla');
            }else{
                /* Si el RUT no existe en la tabla, procedemos a la inserción */
                $.ajax({
                    type: 'POST',
                    url: 'insert/',
                    data: {
                        rut: $rut,
                        nombre: $nombre,

                        email: $email,
                        comuna: $comuna,
                        calle: $calle,
                        numero_de_casa: $numero_de_casa,
                        telefono: $telefono,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success: function() { // Si la inserción es exitosa 
                        alert('Se guardó correctamente el cliente');
                        $('#rut').val('');
                        $('#nombre').val('');

                        $('#email').val('');
                        $('#comuna').val('');
                        $('#calle').val('');
                        $('#numero_de_casa').val('');
                        $('#telefono').val(''); 
                        window.location = '/cliente';
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
    $(document).on('blur', '.input-data', function(){ // Al hacer clic fuera del input se guarda el valor
        var value=$(this).val();
        var td=$(this).parent('td');
        var RUT=td.data('rut');
        console.log(RUT);
        $(this).remove();
        td.html(value);
        td.addClass('editable');
        var type=td.data('type');
        sendToServer(td.data("rut"), value, type);
    }); 
    $(document).on('keypress', '.input-data', function(e){ // Al presionar enter se guarda el valor
        var key = e.which;
        if(key == 13){
            var value = $(this).val();
            console.log(value);
            var td = $(this).parent("td");
            console.log(td);
            var type = td.data("type");
            console.log(type);
            var rut = td.data("rut");
            console.log(rut);
            $(this).remove();
            td.html(value);
            td.addClass("editable");
            sendToServer(td.data("rut"), value, type);
        }
    });
    function sendToServer(rut, value, type){ // Función para enviar los datos al servidor
        /*
        const maxLengths = {
            nombre: 50,
            apellido: 100,
            email: 30,
            comuna: 20,
            calle: 100,
            numero_de_casa: 6,
            telefono: 9
        }; 
        const validationErrors = {
            nombre: 'El nombre solo debe contener letras y espacios y no más de 50 caracteres.',
            apellido: 'El apellido solo debe contener letras y espacios y no más de 100 caracteres.',
            email: 'El email debe ser válido y no más de 30 caracteres.',
            comuna: 'La comuna solo debe contener letras y espacios y no más de 20 caracteres.',
            calle: 'La calle no debe tener más de 100 caracteres.',
            numero_de_casa: 'El número de casa solo debe contener números y no más de 6 caracteres.',
            telefono: 'El teléfono solo debe contener 9 números.'
        };
        
        if ((type === 'nombre' || type === 'apellido') && (!namePattern.test(value) || value.length > maxLengths[type])) {
            alert(validationErrors[type]);
            return;
        }
        
        if (type === 'numero_de_casa' && !houseNumberPattern.test(value)) {
            alert("El valor para 'numero_de_casa' debe tener entre 1 y 6 dígitos");
            return;
        }

        if (type === 'email' && (! /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value.length > maxLengths[type])) {
            alert(validationErrors[type]);
            return;
        }

        if (type === 'telefono' && (value.length !== 9 || !numberPattern.test(value))) {
            alert("El valor para 'telefono' debe tener exactamente 9 dígitos numéricos.");
            return;
        }

        if (value.length > maxLengths[type]) {
            alert(validationErrors[type]);
            return;
        }
        */
        console.log("Sending to server:", rut, value, type);  // Log para ver qué datos se están enviando
        $.ajax({ // Enviamos los datos al servidor
            url: 'update/',
            type: 'POST',
            data: {
                rut: rut,
                value: value,
                type: type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }
        })
        .done(function(response) { // Si la actualización es exitosa
            alert('Se guardó correctamente el cliente');
            console.log(response);
        })
        .fail(function() { // Si la actualización falla
            alert('Error al guardar el cliente');
            console.log('Error');
        });
    }

    /* ELIMINAR */

    $('#eliminar-seleccion').on('click', function(e){ // Al hacer clic en el botón de eliminar
        if (!isEditingEnabled()) {
            e.preventDefault();
            alert('Debe habilitar la edición para eliminar el/los clientes.');
        } else {
            var confirmation = confirm('¿Está seguro de que desea eliminar los clientes seleccionados?');
            if (confirmation) {
                $('input[name="seleccionar"]:checked').each(function() {
                    var rut = $(this).data('rut');
    
                    $.ajax({
                        url: '/cliente/delete/' + rut, // Usando la ruta existente
                        type: 'POST',
                        headers: {'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()},
                        success: function(response) { // Si la eliminación es exitosa
                            console.log('Cliente con rut ' + rut + ' eliminado'); // Log para ver qué clientes se eliminó
                        },
                        error: function(xhr) { // Si la eliminación falla
                            console.log('Error al eliminar el cliente con SKU ' + rut);
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
