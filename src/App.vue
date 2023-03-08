<script setup>
import CardGame from './components/CardGame.vue';
import wordslist from './assets/data/wordslist.json';
import couleurslist from './assets/data/couleurs.json';

let random = wordslist.sort(() => .5 - Math.random()).slice(0,25)
// Je récupère la liste de mots et j'en tire 25 que je mets dans un array 'random'
const CardCouleurs = couleurslist.sort((a, b) => 0.5 - Math.random());
console.log(CardCouleurs)

const newRandom = random.map((word, index) => {
    return  {
        couleur: CardCouleurs[index],
        mot: word
    }
})
// Je crée un nouvel array 'newRandom' qui contient les mots de 'random' et une couleur

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

</script>

<template>
    <div class="app">
        <div class="plateau">
            <!-- <CardGame couleur="blue" mot="chinchilla"/> -->
            <template v-for="word in newRandom">
               <CardGame  :mot=word.mot :couleur=word.couleur />
            </template>

        </div>
    </div>

    <button v-on:click=exportToJsonFile(newRandom)>télacharger plan</button>
</template>

<style scoped>
.plateau {
    border: 1px solid black;
    width: 60vw;
    display : grid;
    grid-template-columns: repeat(5, 15%);
    grid-template-rows: repeat(5, 80px);
}
</style>
