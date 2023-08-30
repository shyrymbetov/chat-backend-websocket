import {Socket} from "socket.io";
import {Request, Response} from "express";

const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))

const io = require('socket.io')(server)

app.route('/')
    .get((req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });


let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket: Socket) {
    console.log('Socket connected', socket.id);
    socketsConected.add(socket.id);
    io.emit('clients-total', socketsConected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketsConected.delete(socket.id);
        io.emit('clients-total', socketsConected.size);
    });

    socket.on('message', (data: any) => {
        // console.log(data)
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data: any) => {
        socket.broadcast.emit('feedback', data);
    });
}
