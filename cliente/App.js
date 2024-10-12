// app.js

const socket = io(); // Inicializa Socket.IO

window.onload = function() {
    // Solicita todos los mensajes al cargar la página
    socket.emit('obtener_mensajes');

    // Envía un mensaje cuando el formulario es enviado
    document.getElementById('formulario').onsubmit = function(e) {
        e.preventDefault(); // Evita el envío normal del formulario
        const nombre = document.getElementById('nombre').value;
        const mensaje = document.getElementById('mensaje').value;
        // Envía el mensaje al servidor
        socket.emit('enviar_mensaje', { nombre: nombre, mensaje: mensaje });
        document.getElementById('mensaje').value = ''; // Limpia el campo de mensaje
    };

    // Escucha por mensajes recibidos del servidor
    socket.on('recibir_mensaje', function(data) {
        const mensajesDiv = document.getElementById('mensajes');
        // Muestra el mensaje en la interfaz
        mensajesDiv.innerHTML += '<p><strong>' + data.nombre + '</strong>: ' + data.mensaje + '</p>';
    });

    // Escucha por todos los mensajes que el cliente solicitó
    socket.on('todos_mensajes', function(mensajes) {
        mensajes.forEach(function(data) {
            const mensajesDiv = document.getElementById('mensajes');
            // Muestra todos los mensajes en la interfaz
            mensajesDiv.innerHTML += '<p><strong>' + data.nombre + '</strong>: ' + data.mensaje + '</p>';
        });
    });
};
