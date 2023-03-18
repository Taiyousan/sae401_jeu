<script setup>
import CardGame from '../components/CardGame.vue';
import CardGrille from '../components/CardGrille.vue';
import BoutonMenu from '../components/BoutonMenu.vue';
import wordslist from '../assets/data/wordslist.json';
import couleurslist from '../assets/data/couleurs.json';
import couleurslistj2 from '../assets/data/couleursj2.json';
import { VueElement } from 'vue';

let random = wordslist.sort(() => .5 - Math.random()).slice(0,25)
// Je récupère la liste de mots et j'en tire 25 que je mets dans un array 'random'

const CardCouleursJ1 = couleurslist.sort((a, b) => 0.5 - Math.random());
// Je récupère la liste de couleurs et je les mets dans un array 'CardCouleursJ1' et je les mélange

const CardCouleursJ2 = couleurslistj2.sort((a, b) => 0.5 - Math.random());
// Je récupère la liste de couleurs et je les mets dans un array 'CardCouleursJ2' et je les mélange

const newRandom = random.map((word, index) => {
    return  {
        couleurJ1: CardCouleursJ1[index],
        couleurJ2: CardCouleursJ2[index],
        mot: word,
        position : index
    }
})


// 
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
const bouton1 = [
    'Joueurs : ',
    '2',
    'lien'
]
const boutonRegles = [
    'Règles',
    'lien'
]
const boutonReset = [
    'Réinitialiser',
    'lien'
]

const joueurConnecte = 'Michel';



//Je créé une fonction qui sera appelée par le bouton pour exporter le plan de jeu au format json




</script>

<template>
    <div class="app">
        <div class="app-nav">
            <div class="app-nav-content app-nav-content1">
                <BoutonMenu :content=bouton1[0] :variant=bouton1[1] :link=bouton1[2] />
                <BoutonMenu :variant=joueurConnecte :link=bouton1[2] />
            </div>
            <div class="app-nav-content app-nav-content2">
                <BoutonMenu :content=boutonRegles[0] :link=boutonRegles[2] />
                <BoutonMenu :content=boutonReset[0] :link=boutonReset[2] />
            </div>
        </div>
           
        <div class="joueur-container">
            <div class="joueur-content-left">

            </div>
            <div class="joueur-content-center">
                <div class="plateau">
                    <template v-for="word in newRandom">
                       <CardGame :mot="word.mot" :couleur=word.couleurJ1 :opponentCouleur=word.couleurJ2 :position=word.position :joueur=1 />
                       <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                    </template>
                </div>
            </div>
            <div class="joueur-content-right">
                <div class="grille" >
                    <span v-for="word in newRandom">
                        <CardGrille :couleur=word.couleurJ1 :position=word.position />
                    </span>
                </div>
            </div>
        </div>
        
        
    </div>

</template>

<style scoped>

.app {
    /* bordure */
    /* border: 1px solid red; */
    height: 100%;
}
.plateau {
    /* border: 8px solid black; */
    height: 80%;
    width: 100%;
    display : inline-grid;
    justify-items: center;
    align-items: center;
    grid-template-columns: repeat(5, 20%);
    /* grid-template-rows: repeat(5, 80px); */
    /* gap: 10px; */
    margin: 10px;
    /* background-color: aquamarine; */
}



.grille {
    width: fit-content;
    height: 300px;
    display : grid;
    grid-template-columns: repeat(5, 25%);
    grid-template-rows: repeat(5, 20%);
   
}

.joueur-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* background-color: rgb(211, 237, 237); */
    /* border: 1px solid black; */
    height: 90vh;
}

.joueur-content-left {
    width: 25%;
    height: 100%;
}

.joueur-content-center {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid black; */

}

.joueur-content-right {
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.app-nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    padding-left: 5%;
    padding-right: 5%;
}

.app-nav-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 20%;
}
</style>
