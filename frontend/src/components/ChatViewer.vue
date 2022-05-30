<template>
    <div class="chatbox-container">
        <div class="chatbox">
            <div class="messages">
                <TransitionGroup name="messagelist" tag="div">
                    <div class="message" v-for="msg in store.state.messages" :key="msg.message">
                        <h3 v-show="msg.client">Stranger {{ msg.client }}</h3>
                        <h4 v-if="!msg.isReal && msg.client">(Sent by you)</h4>
                        <h3 v-if="msg.isBroadcast">(Broadcast)</h3>
                        <h4 v-if="msg.isNotification">(Notification)</h4>
                        <p>{{ msg.message }}</p>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <form @submit="(e) => e.preventDefault()">
            <textarea class="sendmessage" v-model="broadcastMessage"></textarea>
            <button id="broadcast" @click="sendBroadcast">Broadcast</button>
            <button id="connectall" @click="connectionAll">Connect All</button>
            <button id="disconnectall" @click="disconnectAll">Disconnect All</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { store } from '../store/store'
import { ref } from 'vue'
let broadcastMessage = ref('')

store.state.socket.on('message', async (msg) => {
    await store.state.messages.push(msg)
    document.querySelectorAll('.message')[document.querySelectorAll('.message').length - 1].scrollIntoView(true)
})

store.state.socket.on('status', async (msg) => {
    if (msg.status == "waiting" || msg.status == "idle")
        return

    await store.state.messages.push({
        isBroadcast: false,
        isReal: true,
        isNotification: true,
        client: msg.client,
        message: msg.status
    })

    document.querySelectorAll('.message')[document.querySelectorAll('.message').length - 1].scrollIntoView(true)
})

function sendBroadcast() {
    if (broadcastMessage.value)
    {
        store.state.sendBroadcast(broadcastMessage.value)
        broadcastMessage.value = ''
    }
}
function connectionAll() {
    store.state.startConnection(1);
    store.state.startConnection(2);
}

function disconnectAll() {
    store.state.endConnection(1);
    store.state.endConnection(2);
}
</script>

<style scoped lang="sass">

.messagelist-enter-active, .messagelist-leave-active
  transition: all 0.25s ease
  transform: scale(1)

.messagelist-enter-from, .messagelist-leave-to 
  transform: scale(0)
  transition: all 0.25s ease

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
    padding: 5px
.sendmessage
    width: 80%
    height: 8vh
    outline: none
    border: none
    resize: none
    border-bottom-left-radius: 10px
form
    display: flex
    flex-direction: row
form button
    border: none
    outline: none
    font-size: 1rem
    width: 20%
    font-weight: bold
#broadcast
    background: #eaff00
    color: #000
#connectall
    background: #00ff6b
#disconnectall
    background: #ff0000
    border-bottom-right-radius: 10px
.message
    color: #FFF
    text-align: center
    width: 100%
    border-radius: 10px
    border: 1px solid #404040
    margin-top: 5px
    margin-bottom: 5px
    background: #202020
    h3, h4
        padding: 0
        margin: 0
</style>