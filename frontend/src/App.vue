<template>
  <Header></Header>
  <div class="chatboxes">
    <ChatControls stranger="1"></ChatControls>
    <ChatViewer>
    </ChatViewer>
    <ChatControls stranger="2"></ChatControls>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import ChatViewer from './components/ChatViewer.vue'
import ChatControls from './components/ChatControls.vue';
</script>

<style lang="sass">
@import 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap'
body
  font-family: 'Open Sans', sans-serif
  padding: 0
  margin: 0
  background: #303030
  overflow-x: hidden

.chatboxes
  display: flex
  flex-direction: row
  justify-content: space-between

  
</style>
