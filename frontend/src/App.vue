<template>
  <Header></Header>
  <div class="chatboxes">
    <ChatControls :stranger="1"></ChatControls>
    <ChatViewer></ChatViewer>
    <ChatControls :stranger="2"></ChatControls>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import ChatViewer from './components/ChatViewer.vue'
import ChatControls from './components/ChatControls.vue';

</script>

<style lang="sass">
@import 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap'

*
  font-family: 'Lato', sans-serif


button
    cursor: pointer
body
  padding: 0
  margin: 0
  background: #303030
  overflow: hidden

.chatboxes
  display: flex
  flex-direction: row
  justify-content: space-between

</style>
