<script setup>
import CardGame from './components/CardGame.vue';
import wordslist from './assets/data/wordslist.json';
import couleurslist from './assets/data/couleurs.json';
import couleurslistj2 from './assets/data/couleursj2.json';

let random = wordslist.sort(() => .5 - Math.random()).slice(0,25)
// Je récupère la liste de mots et j'en tire 25 que je mets dans un array 'random'

const CardCouleursJ1 = couleurslist.sort((a, b) => 0.5 - Math.random());
// Je récupère la liste de couleurs et je les mets dans un array 'CardCouleursJ1' et je les mélange

const CardCouleursJ2 = couleurslistj2.sort((a,b) => 0.5 - Math.random());
// Je récupère la liste de couleurs et je les mets dans un array 'CardCouleursJ2' et je les mélange

const newRandom = random.map((word, index) => {
    return  {
        couleurJ1: CardCouleursJ1[index],
        couleurJ2: CardCouleursJ2[index],
        mot: word
    }
})
// Je crée un nouvel array 'newRandom' qui contient les mots de 'random' et une couleur pour le joueur 1 et une couleur pour le joueur 2

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
//Je créé une fonction qui sera appelée par le bouton pour exporter le plan de jeu au format json

</script>

<template>
    <div class="app">
        <h1>PLATEAU J1</h1>
        <div class="plateau">
            <template v-for="word in newRandom">
               <CardGame  :mot=word.mot :couleur=word.couleurJ1 />
               <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
            </template>
        </div>
        <h1>PLATEAU J2</h1>
        <div class="plateau plateauJ2">
            <template v-for="word in newRandom">
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
</style>
