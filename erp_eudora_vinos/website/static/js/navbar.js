document.addEventListener('DOMContentLoaded', function() {




   // Manejo del botón de notificaciones
   const notificationsButton = document.getElementById('notifications-button'); 
   const notificationsDropdown = document.getElementById('notifications-dropdown');

   notificationsButton.addEventListener('click', function(event) {
       event.preventDefault();
       // Alterna la visibilidad del dropdown
       notificationsDropdown.style.display = notificationsDropdown.style.display === 'block' ? 'none' : 'block';
   });

   // Cierra el dropdown si se hace clic fuera de él
   window.addEventListener('click', function(event) {
       if (!event.target.closest('#notifications-button') && !event.target.closest('#notifications-dropdown')) {
           notificationsDropdown.style.display = 'none';
       }
   });
});
