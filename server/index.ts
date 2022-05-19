const express = require('express')
const omegle = require('omegle-node-fix')
const bodyParser = require('body-parser')
const {Server} = require('socket.io')
const path = require('path')

const o1 = new omegle()
const o2 = new omegle()
const io = new Server(7777, {cors: {origin: '*'}})
const app = express()
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/public`))
app.use({cors: {origin: '*'}}, (req, res, next) => {
    next()
})

io.on('connection', (socket) =>
{
    if (io.engine.clientsCount === 2)
    {
        socket.disconnect('too many clients connected')
        return
    }

    console.log('[SOCKET.IO] Client connected')

    socket.on('disconnect', () =>
    {
        console.log('[SOCKET.IO] Client disconnected')
        o1.removeAllListeners()
        o2.removeAllListeners()
    })

    socket.on('startConnection', (msg) =>
    {
        if (msg.client == 1)
        o1.connect()
        else
        o2.connect()
    })

    socket.on('endConnection', (msg) =>
    {
        if (msg.client == 1)
        o1.disconnect()
        else
        o2.disconnect()
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
        console.log(`[${getTime()}] Stranger-1 connected`)
        socket.emit('status', {client: 1, status: 'connected'})
    })

    o2.on('connected', () =>
    {
        console.log(`[${getTime()}] Stranger-2 connected`)
        socket.emit('status', {client: 2, status: 'connected'})
    })

    o1.on('disconnected', () =>
    {
        console.log(`[${getTime()}] Stranger-1 disconnected`)
        socket.emit('status', {client: 1, status: 'disconnected'})
    })

    o2.on('disconnected', () =>
    {
        console.log(`[${getTime()}] Stranger-2 disconnected`)
        socket.emit('status', {client: 2, status: 'disconnected'})
    })

    o1.on('gotMessage', (msg) =>
    {
        console.log(`O1: ${msg}`)
        socket.emit('message', {client: 1, message: msg})
        o2.send(msg)
    })

    o2.on('gotMessage', (msg) =>
    {
        console.log(`O2: ${msg}`)
        socket.emit('message', {client: 2, message: msg})
        o1.send(msg)
    })
})

app.listen(8888, () => {
    console.log('Server is running')
})

function getTime()
{
    return `${new Date().toLocaleDateString('it')} ${new Date().toLocaleTimeString('it')}`
}

console.log(getTime())