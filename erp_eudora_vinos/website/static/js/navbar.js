function redirectToPage(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional
    const query = document.getElementById('search-input').value.toLowerCase();
    let url;

    if (query === "Home") {
        url = "/Home";
    } else if (query === "producto") {
        url = "/producto";
    } else if (query === "home") {
        url = "/";
    } else {
        alert("Página no encontrada");
        return;
    }
    window.location.href = url;
}