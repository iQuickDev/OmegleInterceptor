import { createStore } from 'vuex'
import io from 'socket.io-client'

interface Message
{
    isBroadcast: boolean
    isReal: boolean
    isNotification?: boolean
    client: number
    message: string
}

export const store = createStore({
    state: {
      socket: io('iquick.hopto.org:7044'),
        messages: [] as Message[],
        sendMessage: (isReal: boolean, isNotification: boolean, client: number, message : string) =>
        store.state.socket.emit('sendMessage', {isReal, isNotification, client, message}),
        startConnection: (client: number) =>
        store.state.socket.emit('startConnection', {client: client}),
        endConnection: (client: number) =>
        store.state.socket.emit('endConnection', {client: client}),
        sendBroadcast: (message: string) =>
        store.state.socket.emit('sendBroadcast', {isBroadcast: true, isReal: false, isNotification: false, client: null, message: message}),
    }
})
  
