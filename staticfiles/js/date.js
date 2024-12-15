/* PERMITE EDITAR FECHAS */

function formatDateToISO(textDate) {  // Cambia el formato de la fecha a ISO
    var parts = textDate.trim().match(/^(\d{1,2}) de (\w+) de (\d{4})$/);
    if (!parts) return '';

    var months = {enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06', 
                  julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'};
    var day = parts[1].padStart(2, '0');
    var month = months[parts[2].toLowerCase()];
    var year = parts[3];

    return `${year}-${month}-${day}`;
}