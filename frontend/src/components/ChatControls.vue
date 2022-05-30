<template>
    <div class="controls-container">
    <h1 class="strangercount">Stranger {{stranger}}</h1>
    <h2 class="status">Status: {{status}}</h2>
        <form @submit.prevent="sendMessage(false, false, stranger)">
            <textarea class="sendmessage" :placeholder="textareaprompt" v-model="message"></textarea>
            <button id="send" type="submit" @click.prevent="sendMessage(false, false, stranger)">Send</button>
        </form>
        <div class="buttons">
            <button id="connect" @click="() => store.state.startConnection(stranger)">Connect</button>
            <button id="disconnect" @click="() => store.state.endConnection(stranger)">Disconnect</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { store } from '../store/store'

const props = defineProps({
    stranger: {
        type: Number,
        required: true
    },
})

const textareaprompt = `Type here to send a message to Stranger ${props.stranger}
(From their perspective it'll look like the other stranger typed it)`

const stranger = ref<number>(props.stranger)
const status = ref<string>('disconnected')
const message = ref<string>("")

store.state.socket.on('status', (msg) =>
{
    if (msg.client == stranger.value)
    {
        status.value = msg.status
    }
})

function sendMessage(isReal: boolean, isNotification: boolean, client: number)
{
    store.state.sendMessage(isReal, isNotification, client, message.value)

    message.value = ""
}

</script>

<style scoped lang="sass">
button
    font-size: 1rem
    font-weight: bold
.controls-container
    position: relative
    width: 30%
    box-sizing: border-box
    border: 1px solid #000
    height: 30%
    margin: auto
    border-radius: 10px
.status
    color: #FFF
    text-align: center
    width: 100%
    background: #202020
    margin: 0
    h2
        padding: 0
        margin: 0
.sendmessage
    width: 80%
    height: 8vh
    outline: none
    border: none
    resize: none
    color: #000
form
    display: flex
    flex-direction: row
#send
    width: 20%
    outline: none
    background: #a000ff
    border: none
    color: #FFF
.buttons
    display: flex
    flex-direction: row
.buttons button
    width: 100%
    height: 40px
    outline: none
    border: none
    font-weight: bold
#connect
    background: #00ff6b
    border-bottom-left-radius: 10px
#disconnect
    background: #ff0045
    border-bottom-right-radius: 10px
.message
    color: #FFF
    text-align: center
    border-bottom: 1px solid #404040
    width: 100%
.strangercount
    color: #FFF
    text-align: center
</style>