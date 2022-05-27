<template>
    <div class="chatbox-container">
        <div class="chatbox">
            <div class="messages">
                <div class="message" v-for="msg in store.state.messages">
                    <h3>Stranger {{ msg.client }}</h3>
                    <h4 v-if="!msg.isReal">(Sent by you)</h4>
                    <p>{{ msg.message }}</p>
                </div>
            </div>
        </div>
        <form @submit="(e) => e.preventDefault()">
            <textarea class="sendmessage"></textarea>
            <button id="broadcast">Broadcast</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { store } from '../store/store'

interface Message {
    isReal: boolean
    isNotification: boolean
    client: number
    message: string
}

store.state.socket.on('message', (msg) => {
    store.state.messages.push(msg)

    setTimeout(() =>
    {
        //@ts-ignore
        document.querySelectorAll('.message')[document.querySelectorAll('.message').length - 1].scrollIntoView(true)
    }, 10)

})

</script>

<style scoped lang="sass">

.chatbox::-webkit-scrollbar 
    display: none
    
.chatbox-container
    width: 30%
    margin: auto
.chatbox
    overflow-y: auto
    max-height: 85vh
    min-height: 85vh
    background: #151515
.sendmessage
    width: 80%
    height: 8vh
    outline: none
    border: none
    resize: none
form
    display: flex
    flex-direction: row
#broadcast
    width: 20%
.message
    color: #FFF
    text-align: center
    width: 100%
    border-bottom: 1px solid #404040
    h3, h4
        padding: 0
        margin: 0
</style>