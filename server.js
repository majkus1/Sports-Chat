const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://czatsportowy.pl', 'https://www.czatsportowy.pl']
  : ['http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Użytkownik połączony:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`Użytkownik ${socket.id} dołączył do pokoju: ${chatId}`);
  });

  socket.on('send_message', (message) => {
    message.timestamp = new Date();
    io.to(message.chatId).emit('receive_message', message);
    console.log(`Wiadomość w pokoju ${message.chatId}:`, message);
  });

  socket.on('send_private_message', (message) => {
    message.timestamp = new Date();
    io.to(message.chatId).emit('receive_private_message', message);
    console.log(`Wiadomość prywatna w pokoju ${message.chatId}:`, message);
  });

  socket.on('disconnect', () => {
    console.log('Użytkownik rozłączony:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

// const express = require('express')
// const http = require('http')
// const socketIo = require('socket.io')
// const cors = require('cors') // Dodajemy wymagany moduł CORS

// const app = express()

// // Konfigurujemy CORS dla Express
// app.use(cors())

// const server = http.createServer(app)

// // Konfigurujemy CORS dla socket.io
// const io = socketIo(server, {
// 	cors: {
// 		origin: ['http://localhost:3001', 'https://czatsportowy.pl', 'https://www.czatsportowy.pl'],
// 		methods: ['GET', 'POST'],
// 	},
// })

// io.on('connection', socket => {
// 	console.log('Użytkownik połączony')

// 	// Umożliw użytkownikowi dołączenie do pokoju czatu na podstawie chatId
// 	socket.on('join_chat', chatId => {
// 		socket.join(chatId)
// 	})

// 	socket.on('send_message', message => {
// 		message.timestamp = new Date()
// 		// Emituj wiadomość tylko do klientów, którzy są w tym samym czacie
// 		io.to(message.chatId).emit('receive_message', message)
// 	})

// 	// server.js
// 	socket.on('send_private_message', message => {
//         console.log("Private message sent:", message);
// 		message.timestamp = new Date()
// 		io.to(message.chatId).emit('receive_private_message', message)
// 	})

// 	socket.on('disconnect', () => {
// 		console.log('Użytkownik rozłączony')
// 	})
// })

// server.listen(3000, () => {
// 	console.log('Serwer działa na porcie 3000')
// })

