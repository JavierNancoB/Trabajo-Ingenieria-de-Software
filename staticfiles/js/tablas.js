export function transformarFecha(fecha) {
    // Dividimos el string de fecha en partes
    const partes = fecha.split(" de ");

    // Asignamos cada parte a una variable
    const dia = partes[0];
    const mes = partes[1];
    const año = partes[2];

    // Convertimos el mes de texto a número
    const meses = {
        enero: '01', febrero: '02', marzo: '03', abril: '04',
        mayo: '05', junio: '06', julio: '07', agosto: '08',
        septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };
    const mesNumero = meses[mes.toLowerCase()]; // aseguramos que sea minúscula para coincidir con las claves

    // Aseguramos que el día tenga dos dígitos
    const diaFormateado = dia.padStart(2, '0');

    // Creamos la nueva fecha en formato aaaa-mm-dd
    const fechaFormateada = `${año}-${mesNumero}-${diaFormateado}`;

    return fechaFormateada;
}
