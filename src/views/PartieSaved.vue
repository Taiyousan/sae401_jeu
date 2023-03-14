<script setup>
import { ref } from 'vue';
import CardGame from '../components/CardGame.vue';
import partiesaved from '../assets/data/partiesaved.json';


</script>

<template>
    <div class="app">
        <h1>PLATEAU J1</h1>
        <p class="indication1">Cette partie est "sauvegardée", c'est donc toujours la même, même si on refresh. Les données sont tirées d'un fichier .json.
            
        </p>
        <div class="plateau">
            <template v-for="word in partiesaved">
               <CardGame  :mot=word.mot :couleur=word.couleurJ1 />
               <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
            </template>
        </div>
        <h1>PLATEAU J2</h1>
        <div class="plateau plateauJ2">
            <template v-for="word in partiesaved">
               <CardGame  :mot=word.mot :couleur=word.couleurJ2 />
                <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 2 -->
            </template>
        </div>
    </div>

    <button v-on:click=exportToJsonFile(newRandom)>télacharger plan</button>
</template>

<style scoped>
.plateau {
    border: 8px solid black;
    width: 60vw;
    display : grid;
    grid-template-columns: repeat(5, 15%);
    grid-template-rows: repeat(5, 80px);
    margin: 10px;
}

.plateauJ2 {
    border: 8px solid red;
}

.indication1 {
    font-weight: bold;
    color: red;
}
</style>
