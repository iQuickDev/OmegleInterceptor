const express = require('express')
const omegle = require('omegle-node-fix')
const bodyParser = require('body-parser')
const {Server} = require('socket.io')
const path = require('path')

const o1 = new omegle()
const o2 = new omegle()
const io = new Server(7777)
const app = express()
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/public`))

io.on('connection', (socket) =>
{
    console.log('[SOCKET.IO] Client connected')

    socket.on('disconnect', () =>
    {
        console.log('[SOCKET.IO] Client disconnected')
        o1.removeAllListeners()
        o2.removeAllListeners()
    })

    socket.on('startConnection', (msg) =>
    {
        console.log(msg)
        if (msg.client == 1)
        o1.connect()
        else
        o2.connect()
    })

    socket.on('sendMessage', (msg) =>
    {
        console.log(msg)
        if (msg.client == 1)
        o1.send(msg.message)
        else
        o2.send(msg.message)
    })
    
    o1.on('gotID', () =>
    {
        socket.emit('status', {client: 1, status: 'idle'})
    })

    o2.on('gotID', () =>
    {
        socket.emit('status', {client: 2, status: 'idle'})
    })

    o1.on('waiting', () =>
    {
        socket.emit('status', {client: 1, status: 'waiting'})
    })

    o2.on('waiting', () =>
    {
        socket.emit('status', {client: 2, status: 'waiting'})
    })

    o1.on('connected', () =>
    {
        socket.emit('status', {client: 1, status: 'connected'})
    })

    o2.on('connected', () =>
    {
        socket.emit('status', {client: 2, status: 'connected'})
    })

    o1.on('disconnected', () =>
    {
        socket.emit('status', {client: 1, status: 'disconnected'})
    })

    o2.on('disconnected', () =>
    {
        socket.emit('status', {client: 2, status: 'disconnected'})
    })

    o1.on('gotMessage', (message) =>
    {
        console.log("O2:" + message)
        socket.emit('message', {client: 1, message: message})
        o2.send(message)
    })

    o2.on('gotMessage', (message) =>
    {
        console.log("O1:" + message)
        socket.emit('message', {client: 2, message: message})
        o1.send(message)
    })
})

app.listen(8888, () => {
    console.log('Server is running')
})