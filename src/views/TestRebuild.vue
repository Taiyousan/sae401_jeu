<script setup>
import CardGame from '../components/CardGame.vue';
import CardGrille from '../components/CardGrille.vue';
import BoutonMenu from '../components/BoutonMenu.vue';
import { onMounted, VueElement } from 'vue';
import { ref } from 'vue';
import axios from 'axios';


//trucs axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080'; // Remplacez l'URL par l'URL de votre application Vue.js
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

//Je récupère les données de la partie depuis symfony

let jsonData = ref([]);
let currentPlayer = ref([]);
let dernierIndice = ref([]);

//   onMounted(async () => {
//     try {
//         console.log('etape1')
//       const response = await fetch('http://localhost:8000/json/testsaved.json');
//         console.log('etape2')
//       if (response.ok) {
//         jsonData.value = await response.json();
//         console.table(jsonData.value);
//         currentPlayer.value = jsonData.value[25].currentPlayer;
//         dernierIndice.value = jsonData.value[25].dernierIndice;
//       } else {
//         throw new Error('Network response was not ok');
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });

async function loadData() {
  try {
    const response = await fetch('http://localhost:8000/json/testsaved.json')
    if (response.ok) {
      jsonData.value = await response.json()
      currentPlayer.value = jsonData.value[25].currentPlayer
      dernierIndice.value = jsonData.value[25].dernierIndice
    } else {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await loadData()
  setInterval(loadData, 3000)
})


  

  
  
    //lire le fichier JSON dans la console en tableau
    //???????????????????

//le bouton pour exporter le fichier JSON
function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

//les infos des boutons
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
//--------------------

//la gestion de l'output de l'indice
onMounted(() => { 
    const input = document.querySelector(".indice-input");
    const output = document.querySelector(".indice-output-zone");
    const button = document.querySelector(".indice-button");
    const outputChiffre = document.querySelector(".indice-output-chiffre");
    const inputChiffre = document.querySelector(".indice-input-chiffre");
    // envoi du mot si je clique sur le bouton
    button.addEventListener("click", (event) => {
    output.innerHTML = input.value;
    outputChiffre.innerHTML = inputChiffre.value;
    input.value = '';
    inputChiffre.value = '';
    });
    // envoi du mot si je clique sur la touche entrée
    input.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }});
});
//----------------------------------

//la gestion du chiffre de l'indice
function chiffreIndice(n) {
    console.log(n);
    const output = document.querySelector(".indice-input-chiffre");
    output.value = n;
}
//---------------------------------

// Envoyer une requête POST pour mettre à jour le fichier JSON
function postJson() {
    axios.post('http://localhost:8000/update/json', jsonData.value)
}

//la fonction pour sauvegarder le dernier indice
function saveIndice(){
    const output = document.querySelector(".indice-output-zone");
    const outputChiffre = document.querySelector(".indice-output-chiffre");
    jsonData.value[25].dernierIndice[0] = output.innerHTML
    jsonData.value[25].dernierIndice[1] = outputChiffre.innerHTML
    console.log(jsonData.value[25].dernierIndice)
    postJson();
}

//la fonction pour sauvegarder le click sur une carte
function saveClick(position) {
    console.log(position);
    jsonData.value[position].clicked = true;
    console.log(jsonData.value[position].clicked);
    postJson();
}
//--------------------------------------------------

//la fonction pour recharger la page
function reloadData() {
  loadData()
}
</script>

<template>
    <div class="app">
        <div class="app-nav">
            <div class="app-nav-content app-nav-content1">
                <BoutonMenu :content=bouton1[0] :variant=2 :link=bouton1[2] />
                <BoutonMenu :variant=currentPlayer :link=bouton1[2] />
            </div>
            <div class="app-nav-content app-nav-content2">
                <BoutonMenu :content=boutonRegles[0] :link=boutonRegles[2] />
                <BoutonMenu :content=boutonReset[0] :link=boutonReset[2] />
            </div>
        </div>
        <div class="indice-output">
            <span class="indice-indice">Indice :  </span>
            <span class="indice-output-zone">{{ dernierIndice[0] }}</span>
            <span class="indice-output-chiffre">{{ dernierIndice[1] }}</span>
        </div>
        <div class="joueur-container">
            <div class="joueur-content-left">

            </div>
            <div class="joueur-content-center">
                <div class="plateau">
                    <template v-for="word in jsonData.slice(0,25)">
                       <CardGame :mot="word.mot" :couleur=word.couleurJ1 :opponentCouleur=word.couleurJ2 :position=word.position :joueur=1 :clicked=word.clicked v-on:click="saveClick(word.position)"/>
                       <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                    </template>
                </div>
            </div>
            
        
            <div class="joueur-content-right">
                <div class="grille" >
                    <span v-for="word in jsonData.slice(0,25)">
                        <CardGrille :couleur=word.couleurJ1 :position=word.position />
                    </span>
                </div>
            </div>
        </div>
        <div class="indice-sender-container">
            <div class="chiffres">
                <button v-for="n in 10" class="chiffre" v-on:click="chiffreIndice(n)">{{n}}</button>
            </div>
            <div class="indice-sender">
                <input type="text" name="indice-sender" class="indice-input">
                <input type="text" class="indice-input-chiffre">
                <button name="indice-sender" class="indice-button" v-on:click="saveIndice()" >Valider l'indice</button>
            </div>
        </div>
        <button v-on:click="postJson()">POST</button>
        <button v-on:click="reloadData()">RELOAD</button>

    </div>


</template>

<style scoped>



a {
    text-decoration: none;
    color: black;
}

.indice-sender-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 15vh;
    width: 100%;
    /* background-color: aliceblue; */
}

.indice-sender-container .indice-sender {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    width: 40%;
    /* background-color: rgb(71, 114, 153); */
}

.indice-sender .indice-input {
    height: 50%;
    width: 50%;
    border-radius: 5px;
    border: none;
    background-color: white;
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
}

.indice-input-chiffre {
    height: 50px;
    width: 50px;
    border-radius: 5px;
    border: none;
    background-color: white;
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
}

.indice-sender button {
    height: 50%;
    width: 20%;
    border-radius: 5px;
    border: none;
    background-color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
}

.indice-output {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 10vh;
    width: 100%;
    /* background-color: white; */
    /* border: 1px solid red; */
    font-size: 40px;
    color: black;
    text-transform: uppercase;
}

.chiffres {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 10vh;
    width: 50%;
    /* background-color: white; */
    /* border: 1px solid red; */
    font-size: 40px;
    color: black;
    text-transform: uppercase;
}
    .chiffres button {
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
  text-transform: uppercase;
}

.indice-output-zone {
    margin-left: 30px;
    min-width: 500px;
    font-size: 30px;
}

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
    height: 65vh;
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
