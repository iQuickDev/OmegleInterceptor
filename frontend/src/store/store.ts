import { createStore } from 'vuex'
import io from 'socket.io-client'

interface Message
{
    client: number
    message: string
}

export const store = createStore({
    state: {
      socket: io('http://localhost:7777'),
        messages: [] as Message[],
        sendMessage: (client : number, message : string) => store.state.socket.emit('sendMessage', {client, message}),
        startConnection: (client: number) => store.state.socket.emit('startConnection', {client: client}),
    }
})
  