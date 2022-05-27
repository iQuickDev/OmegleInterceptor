import { createStore } from 'vuex'
import io from 'socket.io-client'

interface Message
{
    isReal: boolean
    isNotification?: boolean
    client: number
    message: string
}

export const store = createStore({
    state: {
      socket: io('localhost:7044'),
        messages: [] as Message[],
        sendMessage: (isReal: boolean, isNotification: boolean, client: number, message : string) =>
        store.state.socket.emit('sendMessage', {isReal, isNotification, client, message}),
        startConnection: (client: number) =>
        store.state.socket.emit('startConnection', {client: client}),
        endConnection: (client: number) =>
        store.state.socket.emit('endConnection', {client: client}),
    }
})
  
