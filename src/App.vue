<script setup>



</script>
<template>
      <div class="app">
        <!-- <nav>
          <router-link to="/">Home</router-link> |
          <router-link to="/jeu">Jeu</router-link> |
          <router-link to="/partiesaved">Partie Saved</router-link> |
          <router-link to="/prototype">Protoype de jeu</router-link> |
          <router-link to="/pdvjoueur">Point de vue Joueur</router-link> |
          <router-link to="/testpartie">Test Partie depuis Symfony</router-link> |
          <router-link to="/testrebuild">Test Redbuild de zéro</router-link> |
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
 
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0;
  padding: 0;
}
</style>
