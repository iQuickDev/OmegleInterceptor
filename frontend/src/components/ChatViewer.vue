<template>
    <div class="chatbox-container">
        <div class="chatbox">
            <div class="messages">
                <div class="message" v-for="msg in store.state.messages">
                    <h3>Stranger {{msg.client}}</h3>
                    <p>{{msg.message}}</p>
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
import { ref } from 'vue'
import { store } from '../store/store'

interface Message
{
    client: number
    message: string
}

store.state.socket.on('message', (msg) =>
{
    store.state.messages.push(msg)
})

setInterval(() =>
{
    console.log(store.state.messages.length)
}, 1000)

</script>

<style scoped lang="sass">
.chatbox-container
    width: 30%
    margin: auto
.chatbox
    overflow-y: scroll
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
    h3
        padding: 0
        margin: 0

</style>