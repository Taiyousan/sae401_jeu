<script setup>
import Jeu from './views/Jeu.vue';
// import Router from './router/index.js';



</script>
oui
<template>
    <div class="app">
      <!-- <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/jeu">Jeu</router-link> |
        <router-link to="/partiesaved">Partie Saved</router-link> |
        <router-link to="/prototype">Protoype de jeu</router-link> |
        <router-link to="/pdvjoueur">Point de vue Joueur</router-link>
      </nav> -->
    </div>
    <router-view></router-view>
</template>

<style scoped>

.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background-image:url('assets/img/wp4.jpg'); */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0;
  padding: 0;
}
</style>
