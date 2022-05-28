<template>
    <div class="chatbox-container">
        <div class="chatbox">
            <div class="messages">
                <TransitionGroup name="messagelist" tag="div">
                    <div class="message" v-for="msg in store.state.messages" :key="msg.message">
                        <h3>Stranger {{ msg.client }}</h3>
                        <h4 v-if="!msg.isReal">(Sent by you)</h4>
                        <h4 v-if="msg.isNotification">(Notification)</h4>
                        <p>{{ msg.message }}</p>
                    </div>
                </TransitionGroup>
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
    setTimeout(() => {
        //@ts-ignore
        document.querySelectorAll('.message')[document.querySelectorAll('.message').length - 1].scrollIntoView(true)
    }, 1)
})

store.state.socket.on('status', (msg) => {
    if (msg.status == "waiting" || msg.status == "idle")
        return

    store.state.messages.push({
        isReal: true,
        isNotification: true,
        client: msg.client,
        message: msg.status
    })
    setTimeout(() => {
        //@ts-ignore
        document.querySelectorAll('.message')[document.querySelectorAll('.message').length - 1].scrollIntoView(true)
    }, 1)
})

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
form
    display: flex
    flex-direction: row
#broadcast
    width: 20%
.message
    color: #FFF
    text-align: center
    width: 100%
    border-radius: 10px
    border: 1px solid #404040
    margin-top: 5px
    marbin-bottom: 5px
    background: #202020
    h3, h4
        padding: 0
        margin: 0
</style>