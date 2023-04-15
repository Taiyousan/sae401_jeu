<script setup>
import CardGame from '../components/CardGame.vue';
import CardGrille from '../components/CardGrille.vue';
import wordslist from '../assets/data/wordslist.json';
import couleurslist from '../assets/data/couleurs.json';
import couleurslistj2 from '../assets/data/couleursj2.json';
import { VueElement } from 'vue';

//popup
import { ref } from 'vue';
import { Modal } from 'usemodal-vue3';

let isVisible = ref(false);
const infos = {
  text: "Doe"
};



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


//Je créé une fonction qui sera appelée par le bouton pour exporter le plan de jeu au format json



</script>

<template>
    <div class="app">
        <h1 v-on:click="isVisible = true">PLATEAU DU JOUEUR 1</h1>
        <Modal v-model:visible="isVisible" title="PERDU" :cancelButton="{ text: 'Annuler', onclick: null }" :closable="false" modalClass="oui" >
            <div>Vous avez perdu !</div>
        </Modal>
            <p class="indication">Cette partie est générée aléatoirement. Les plateaux sont différents à chaque refresh, mais on peut en sauvegarder la configuration avec le bouton en bas, qui génère un .json. On peut réutiliser ce .json pour générer le même plateau plus tard.
            </p>
            <p class="indication">Pour générer un nouveau plateau, il faut cliquer sur un autre bouton du menu en haut puis revenir sur "jeu".</p>
        <div class="joueur-container">
            <div class="plateau">
                <template v-for="word in newRandom">
                   <CardGame :mot=word.mot :couleur=word.couleurJ1 :opponentCouleur=word.couleurJ2 :position=word.position :joueur=1 />
                   <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                </template>
            </div>
            <div class="grille" >
                <span v-for="word in newRandom">
                    <CardGrille :couleur=word.couleurJ1 />
                </span>
            </div>
        </div>
        <h1>PLATEAU DU JOUEUR 2</h1>
        <div class="joueur-container">
            <div class="plateau">
                <template v-for="word in newRandom">
                   <CardGame :mot=word.mot :couleur=word.couleurJ2 :opponentCouleur=word.couleurJ1 :position=word.position :joueur=2 />
                   <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                </template>
            </div>
            <div class="grille" >
                <span v-for="word in newRandom">
                    <CardGrille :couleur=word.couleurJ2 />
                </span>
            </div>
        </div>
        
    </div>

    <button v-on:click=exportToJsonFile(newRandom)>télacharger plan</button>
</template>

<style scoped>



.plateau {
    /* border: 8px solid black; */
    width: 60vw;
    display : grid;
    grid-template-columns: repeat(5, 15%);
    grid-template-rows: repeat(5, 80px);
    margin: 10px;
}

.plateauJ2 {
    border: 8px solid red;
}

.indication {
    font-weight: bold;
    color: red;
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
}
</style>
