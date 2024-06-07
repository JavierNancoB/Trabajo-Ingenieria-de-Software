document.addEventListener('DOMContentLoaded', function() {
    // Redireccionamiento de búsqueda
    function redirectToPage(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional
        const query = document.getElementById('search-input').value.toLowerCase();
        let url;

        if (query === "home") {
            url = "/home";
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

    document.getElementById('search-form').addEventListener('submit', redirectToPage);

    // Manejo del botón de notificaciones
    const notificationsButton = document.getElementById('notifications-button');
    const notificationsDropdown = document.getElementById('notifications-dropdown');

    notificationsButton.addEventListener('click', function(event) {
        event.preventDefault();
        notificationsDropdown.style.display = notificationsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', function(event) {
        if (!event.target.closest('#notifications-button') && !event.target.closest('#notifications-dropdown')) {
            notificationsDropdown.style.display = 'none';
        }
    });
});