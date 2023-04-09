<script setup>
import CardGame from '../components/CardGame.vue';
import CardGrille from '../components/CardGrille.vue';
import BoutonMenu from '../components/BoutonMenu.vue';
import { onMounted, VueElement } from 'vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const rolejoueur = ref('')
const adversaire = ref('')
const tourjoueur = ref('')
const updateValue = ref('')
const agentstrouves = ref(0)
onMounted(() => {
  const encodedString = window.location.pathname.split('/').pop()
  rolejoueur.value = atob(encodedString)
})


//trucs axios
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080'; // Remplacez l'URL par l'URL de votre application Vue.js
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

//Je récupère les données de la partie depuis symfony

let jsonData = ref([]);
let currentPlayer = ref([]);
let joueur2 = ref([]);
let dernierIndice = ref([]);
let isVariableSet = false; // Sert à savoir si la variable a été affectée. Une fois qu'elle a été affectée, on ne la réaffecte plus.
let clickedArray = ref([]);




//infos de la route
const route = useRoute()
const idpartie = route.params.id
console.log(idpartie)


async function loadData() {
  try {
    // const response = await fetch('http://localhost:8000/json/testsaved.json')
    const response = await fetch(`http://localhost:8000/api/parties/${idpartie}`)
    if (response.ok) {
      jsonData.value = await response.json()
      jsonData.value = jsonData.value.savefile
        console.table(jsonData.value.savefile)
    //   je vérifie qui est le joueur, j1 ou j2
    console.log(rolejoueur.value)
    if (rolejoueur.value == 'j1') {
        currentPlayer.value = jsonData.value[25].j1
        adversaire.value = jsonData.value[25].j2
      } if (rolejoueur.value == 'j2') {
        currentPlayer.value = jsonData.value[25].j2
        adversaire.value = jsonData.value[25].j1
      }
    
      dernierIndice.value = jsonData.value[25].dernierIndice
      if (jsonData.value[25].j2 == null) {
        joueur2.value = "En attente d'un joueur"
      } else {
        joueur2.value = jsonData.value[25].j2
      }
      jsonData.value.forEach((element, index) => {
        clickedArray.value.splice(index, 1, element.clicked)
      });

      //je récupère le current player du json (qui indique de qui c'est le tour) et je le mets dans tourjoueur
      tourjoueur.value = jsonData.value[25].currentPlayer

      //je récupère le nombre d'agents trouvés
        // jsonData.value.forEach((element, index) => {
        //     if (element.greenfound == true) {
        //         agentstrouves.value = agentstrouves.value + 1
        //     }
        // });
        
    } else {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.log(error)
  }
}


onMounted(async () => {
  await loadData()
  setInterval(loadData, 2000)
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
    // const input = document.querySelector(".indice-input");
    // const output = document.querySelector(".indice-output-zone");
    // const button = document.querySelector(".indice-button");
    // const outputChiffre = document.querySelector(".indice-output-chiffre");
    // const inputChiffre = document.querySelector(".indice-input-chiffre");
    // // envoi du mot si je clique sur le bouton
    // button.addEventListener("click", (event) => {
    // output.innerHTML = input.value;
    // outputChiffre.innerHTML = inputChiffre.value;
    // input.value = '';
    // inputChiffre.value = '';
    // });
    // // envoi du mot si je clique sur la touche entrée
    // input.addEventListener("keyup", (event) => {
    // if (event.keyCode === 13) {
    //     event.preventDefault();
    //     button.click();
    // }});
});
//----------------------------------

//indice + sauvagarde
function indiceSave(){
    //constantes
    const outputMot = document.querySelector(".indice-output-zone");
    const outputChiffre = document.querySelector(".indice-output-chiffre");
    const inputChiffre = document.querySelector(".indice-input-chiffre");
    const inputMot = document.querySelector(".indice-input");

    //sauvegarde
    jsonData.value[25].dernierIndice[0] = inputMot.value
    jsonData.value[25].dernierIndice[1] = inputChiffre.value

   

    //affichage
    outputMot.innerHTML = inputMot.value;
    outputChiffre.innerHTML = inputChiffre.value;

    //nettoyage des inputs
    inputMot.value = '';
    inputChiffre.value = '';
    postJson();
    // loadData();

     // on cache l'output le temps de la requête
     const output = document.querySelector(".indice-output-zone");
    const outputChiffre2 = document.querySelector(".indice-output-chiffre");

    output.style.color = 'transparent';
    outputChiffre2.style.color = 'transparent';
    output.classList.add('blinking');
    setTimeout(() => {
        output.style.color = 'black';
        outputChiffre2.style.color = 'black';
        output.classList.remove('blinking');
    }, 3000);
        loadData();
  
    
    

}

//la gestion du chiffre de l'indice
function chiffreIndice(n) {
    console.log(n);
    const output = document.querySelector(".indice-input-chiffre");
    output.value = n;
}
//---------------------------------

// Envoyer une requête POST pour mettre à jour le fichier JSON
function postJson() {
    //on lance la requete
    console.log('lancement de la fonction postJson')
    axios.put(`http://localhost:8000/api/parties/${idpartie}`, { 
  ...jsonData.value,
  savefile: jsonData.value 
}, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => console.log(response))
  .catch(error => console.log(error));


    console.log('fin de la fonction postJson')

   
}

//la fonction pour sauvegarder le dernier indice
function saveIndice(){
    // const output = document.querySelector(".indice-output-zone");
    // const outputChiffre = document.querySelector(".indice-output-chiffre");
    // jsonData.value[25].dernierIndice[0] = output.innerHTML
    // console.log(output.innerHTML)
    // jsonData.value[25].dernierIndice[1] = outputChiffre.innerHTML
    // // console.log(jsonData.value[25].dernierIndice)
    // console.log('bg')
    // postJson();
}

//la fonction pour sauvegarder le click sur une carte
function saveClick(position) {
    if (rolejoueur.value === 'j1') {
        jsonData.value[position].clickedj2 = true;
        if (jsonData.value[position].couleurJ2 === 'green') {
            jsonData.value[position].greenfound = true;
        }

    } else {
        jsonData.value[position].clickedj1 = true;
        if (jsonData.value[position].couleurJ1 === 'green') {
            jsonData.value[position].greenfound = true;
        }
    }
    postJson();
}
//--------------------------------------------------

//la fonction pour terminer son tour
function finTour(){
    if(tourjoueur.value === jsonData.value[25].j1){
        tourjoueur.value = jsonData.value[25].j2
        jsonData.value[25].currentPlayer = jsonData.value[25].j2
        postJson();
            setTimeout(() => {
            //redirection pour test
            window.location.href = `http://127.0.0.1:5173/testrebuild/${idpartie}/ajI=`;
        }, 1000);
    }
    else{
        tourjoueur.value = jsonData.value[25].j1
        jsonData.value[25].currentPlayer = jsonData.value[25].j1
        postJson();
            setTimeout(() => {
            //redirection pour test
            window.location.href = `http://127.0.0.1:5173/testrebuild/${idpartie}/ajE=`;
        }, 1000);
    }
    

    
}

//la fonction pour recharger la page
function reloadData() {
  loadData()
}
</script>

<template>
    <div class="app">
        <p>{{ updateValue }}</p>
        <div class="app-nav">
            <div class="app-nav-content app-nav-content1">
                <BoutonMenu content="C'est le tour de : " :variant=tourjoueur />
                <BoutonMenu :variant=currentPlayer :link=bouton1[2] />
                <BoutonMenu :variant=adversaire content="Votre équipier :" />
                <BoutonMenu :variant=agentstrouves content="Agents trouvés sur 15 : " />
            </div>
            <div class="app-nav-content app-nav-content2">
                <BoutonMenu :content=boutonRegles[0] :link=boutonRegles[2] />
                <BoutonMenu content="Terminer mon tour" v-on:click="finTour()" />
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
                    <template v-for="(word, index) in jsonData.slice(0,25)" v-if="rolejoueur === 'j1'">
                       <CardGame :mot=word.mot :couleur=word.couleurJ1 :opponentCouleur=word.couleurJ2 :position=word.position :joueur=1  v-on:click="saveClick(word.position)" :clicked=word.clickedj2 :greenfound=word.greenfound />
                       <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                    </template>
                    <template v-for="(word, index) in jsonData.slice(0,25)" v-if="rolejoueur === 'j2'">
                       <CardGame :mot=word.mot :couleur=word.couleurJ2 :opponentCouleur=word.couleurJ1 :position=word.position :joueur=1  v-on:click="saveClick(word.position)" :clicked=word.clickedj1 :greenfound=word.greenfound />
                       <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                    </template>
                </div>
            </div>
            
        
            <div class="joueur-content-right">
                <div class="grille" >
                    <span v-for="word in jsonData.slice(0,25)" v-if="rolejoueur === 'j1'">
                        <CardGrille :couleur=word.couleurJ1 :position=word.position  />
                    </span>
                    <span v-for="word in jsonData.slice(0,25)" v-if="rolejoueur === 'j2'">
                        <CardGrille :couleur=word.couleurJ2 :position=word.position  />
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
                <button name="indice-sender" class="indice-button" v-on:click="indiceSave()" >Valider l'indice</button>
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
    border-radius: 20px;
}

.blinking {
  animation: blink 2s linear infinite;
}

@keyframes blink {
  50% {
    background-color: rgb(229, 229, 229);
  }
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
