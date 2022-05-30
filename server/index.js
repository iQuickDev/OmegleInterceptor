const express = require('express')
const omegle = require('omegle-node-fix')
const bodyParser = require('body-parser')
const {Server} = require('socket.io')

const o1 = new omegle()
const o2 = new omegle()

const io = new Server(7044, {cors: {origin: '*'}})
const app = express()
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/dist`))
app.use({cors: {origin: '*'}}, (req, res, next) => next())

io.on('connection', (socket) =>
{
    if (io.engine.clientsCount > 1)
    {
        socket.disconnect('too many clients connected')
        return
    }

    console.log('[SOCKET.IO] Client connected')

    socket.on('language', (language) =>
    {
        //todo
    })

    socket.on('disconnect', () =>
    {
        console.log('[SOCKET.IO] Client disconnected')
        o1.removeAllListeners()
        o2.removeAllListeners()
    })

    socket.on('startConnection', (msg) =>
    {
        if (msg.client === 1)
        o1.connect()
        else
        o2.connect()
    })

    socket.on('endConnection', (msg) =>
    {
        if (msg.client === 1)
        o1.disconnect()
        else
        o2.disconnect()
    })

    socket.on('sendMessage', (msg) =>
    {
        if (msg.client === 1)
        {
            if (o1.connected)
            {
                o1.send(msg.message)
                socket.emit('message', {isReal: false, isNotification: false, client: 2, message: msg.message})
            }
        }
        else
        {
            if (o2.connected)
            {
                o2.send(msg.message)
                socket.emit('message', {isReal: false, isNotification: false, client: 1, message: msg.message})     
            }
        }
    })

    socket.on('sendBroadcast', (msg) =>
    {
        o1.send(msg.message)
        o2.send(msg.message)
        socket.emit('message', {isBroadcast: true, isReal: false, isNotification: false, client: null, message: msg.message})
        console.log(`[${getTime()}] [BROADCAST]: ${msg.message}`)
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
        console.log(`[${getDateTime()}] Stranger-1 connected`)
        socket.emit('status', {client: 1, status: 'connected'})
    })

    o2.on('connected', () =>
    {
        console.log(`[${getDateTime()}] Stranger-2 connected`)
        socket.emit('status', {client: 2, status: 'connected'})
    })

    o1.on('disconnected', () =>
    {
        console.log(`[${getDateTime()}] Stranger-1 disconnected`)
        socket.emit('status', {client: 1, status: 'disconnected'})
    })

    o2.on('disconnected', () =>
    {
        console.log(`[${getDateTime()}] Stranger-2 disconnected`)
        socket.emit('status', {client: 2, status: 'disconnected'})
    })

    o1.on('gotMessage', (msg) =>
    {
        // if (msg.toLowerCase() == 'm')
        // {   
        //     msg = 'F'
        //     console.log('[S1] SWITCHED GENDER')
        // }

        // let fullDigits = ''
        // let msgCopy = msg

        // if (!isNaN(msg))
        //     msg -= 5
        // else
        // {    
        //     for (const letter of msg)
        //     {
        //         let digit = parseInt(letter)
        //         if (isNaN(digit) && fullDigits)
        //         {
        //             msgCopy = msgCopy.replace(fullDigits, fullDigits - 5)
        //             fullDigits = ''
        //         }
        //         if (!isNaN(digit))
        //         {
        //             fullDigits += digit
        //         }
        //     }
        // }

        // msg = msgCopy
        
        console.log(`[${getTime()}] [S1]: ${msg}`)
        socket.emit('message', {isReal: true, isNotification: false, client: 1, message: msg})
        o2.send(msg)
    })

    o2.on('gotMessage', (msg) =>
    {
        // if (msg.toLowerCase() == 'm')
        // {   
        //     msg = 'F'
        //     console.log('[S2] SWITCHED GENDER')
        // }

        // let fullDigits = ''
        // let msgCopy = msg

        // if (!isNaN(msg))
        //     msg -= 5
        // else
        // {
        //     for (const letter of msg)
        //     {
        //         let digit = parseInt(letter)
        //         if (isNaN(digit) && fullDigits)
        //         {
        //             msgCopy = msgCopy.replace(fullDigits, fullDigits - 5)
        //             fullDigits = ''
        //         }
        //         if (!isNaN(digit))
        //         {
        //             fullDigits += digit
        //         }
        //     }
        // }

        // msg = msgCopy

        console.log(`[${getTime()}] [S2]: ${msg}`)
        socket.emit('message', {isReal: true, isNotification: false, client: 2, message: msg})
        o1.send(msg)
    })
})

app.listen(8888, () => {
    console.log('Server is running (port 8888)')
})

function getDateTime()
{
    return `${new Date().toLocaleDateString('it')} ${new Date().toLocaleTimeString('it')}`
}

function getTime()
{
    return `${new Date().toLocaleTimeString('it')}`
}