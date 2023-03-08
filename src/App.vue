<script setup>
import Jeu from './views/Jeu.vue';
import Router from './router/index.js';



</script>

<template>
    <div class="app">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/jeu">Jeu</router-link> |
        <router-link to="/partiesaved">Partie Saved</router-link>
      </nav>
    </div>
    <router-view></router-view>
</template>

<style scoped>
</style>
