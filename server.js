// server.js

const express = require('express'); // Importa el módulo Express
const http = require('http'); // Importa el módulo HTTP
const socketIo = require('socket.io'); // Importa el módulo Socket.IO
const { MongoClient } = require('mongodb'); // Importa el cliente MongoDB

const app = express(); // Crea una instancia de Express
const server = http.createServer(app); // Crea un servidor HTTP
const io = socketIo(server); // Asocia Socket.IO al servidor

// Configura la conexión a MongoDB
const uri = 'mongodb://localhost:27017'; // URL de conexión a MongoDB
const client = new MongoClient(uri); // Crea una nueva instancia del cliente MongoDB

async function run() {
    try {
        await client.connect(); // Conéctate a la base de datos
        console.log('Conectado a MongoDB');
        const database = client.db('almacen_icc_bevans'); // Selecciona la base de datos
        const mensajesCollection = database.collection('mensajes'); // Selecciona la colección

        // Sirve archivos estáticos desde la carpeta client
        app.use(express.static('client'));

        // Maneja las conexiones de Socket.IO
        io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado');

            // Almacena el mensaje en la base de datos y lo emite a todos los clientes
            socket.on('enviar_mensaje', async (data) => {
                await mensajesCollection.insertOne(data); // Guarda el mensaje en la base de datos
                io.emit('recibir_mensaje', data); // Envía el mensaje a todos los clientes
            });

            // Recupera todos los mensajes de la base de datos
            socket.on('obtener_mensajes', async () => {
                const mensajes = await mensajesCollection.find({}).toArray(); // Obtiene todos los mensajes
                socket.emit('todos_mensajes', mensajes); // Envía los mensajes al cliente
            });
        });

        // Inicia el servidor
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    } finally {
        // client.close(); // Descomentar para cerrar el cliente al final
    }
}

run().catch(console.error);
