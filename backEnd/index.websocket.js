const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server({
    cors: {
      origin: "http://localhost:3000"
    }
  });
  
  io.listen(4000);

const { log } = require('console');
const logic = require('./logic.websocket')

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', async (message) => {
    console.log('Received message from client:', message);

    if (message.type === 'checking') {
        const response = {
            type: 'checking',
            payload: { check: 'correct' },
            "status" : "200"
        };
        // send a JSON response to the client
        socket.emit('message', response);
    }
    if (message.type == "create_room"){
        console.log("Logic To Create Room", message.payload)
        const data = await logic.createRoom(message.payload)
        socket.join(data.payload.shareid)
        io.to(data.payload.shareid).emit('message',data)
    }
    
    if (message.type == "close_room"){
      console.log("Logic To Close Room", message.payload)
      const data = await logic.closeRoom(message.payload)
      socket.join(data.payload.room_id)
      io.to(data.payload.room_id).emit('message',data)
    }

    if(message.type == 'is_creator'){
        // TODO: Make a Function to check SessionId timing. 

        console.log("Logic to Is Creator", message.payload)
        socket.join(message.payload.session_id)
        socket.join(message.payload.id)
        io.to(message.payload.session_id).emit('message', await logic.isCreator(message.payload))
    }

    if(message.type == 'join_room'){
        // TODO: Make a function to check SessionID timing and check here. 
        console.log("Logic to Join Room", message.payload)
        socket.join(message.payload.id)
        io.to(message.payload.id).emit('message', await logic.joinRoom(message.payload))
    }

    if(message.type == 'create_ticket'){
        console.log("Logic to Creating Ticket", message.payload)
        socket.join(message.payload.id)
        io.to(message.payload.id).emit('message', await logic.createTicket(message.payload))
    }

    if(message.type == 'vote'){
        console.log("Logic to Voting", message.payload)
        const data = await logic.createVote(message.payload)
        socket.join(message.payload.room_id)
        io.to(message.payload.room_id).emit('message', data)
    }

    if(message.type == 'get_name'){
        console.log("Logic to get_name", message.payload)
        socket.join(message.payload.room_id)
        io.to(message.payload.room_id).emit('message', await logic.getName(message.payload))
    }

    if(message.type == 'get_all_name'){
        console.log("Logic to get_name", message.payload)
        socket.join(message.payload.room_id)
        io.to(message.payload.room_id).emit('message', await logic.getAllName(message.payload))
    }

    if(message.type == 'get_all_ticket'){
      console.log("Logic to getAllTicket", message.payload)
      socket.join(message.payload.session_id)
      io.to(message.payload.session_id).emit('message', await logic.getAllTicket(message.payload))
  }

  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
