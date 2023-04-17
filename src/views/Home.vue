<script setup>
import CardGame from '../components/CardGame.vue';
import CardGrille from '../components/CardGrille.vue';
import BoutonMenu from '../components/BoutonMenu.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import { Modal } from 'usemodal-vue3';

//visibilité du modal :
let isVisible= ref(false);

//infos du modal
let modalTitre = ref()
let modalTexte = ref()

//indication pour le joueur
let indication = ref('BONJOUR A VOUS, AGENT !')

//indice envoyé ou non :
let indiceenvoye = ref(false)

//j1 ou j2, récupéré dans l'url :
// const rolejoueur = ref('')

const adversaire = ref('')
const tourjoueur = ref('')
const updateValue = ref('')
const agentstrouves = ref(0)
const jetonsrestants = ref(0)

//une variable qui sert à savoir si les cartes sont cliquables
const isDisabled = ref(false)
// onMounted(() => {
//   const encodedString = window.location.pathname.split('/').pop()
//   rolejoueur.value = atob(encodedString)
// })

//Je récupère les données de la partie depuis symfony
let jsonData = ref([]); // Sert à stocker les données du JSON
let currentPlayer = ref([]); // Sert à stocker le nom du joueur qui joue
let joueur2 = ref([]); // Sert à stocker le nom du joueur 2
let dernierIndice = ref([]); // Sert à stocker le dernier indice envoyé
let isVariableSet = false; // Sert à savoir si la variable a été affectée. Une fois qu'elle a été affectée, on ne la réaffecte plus.
let clickedArray = ref([]);

//infos de la route
const route = useRoute()
// const idpartie = route.params.id
console.log(idpartie)

//infos url
const url = window.location.href;
var params = {};
url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
  params[key] = value;
});

console.log(params["param1"]);
console.log(params["param2"]);
const idpartie = params["param1"];
const rolejoueur = params["param2"]



//fonction de chargement des données
async function loadData() {
  try {
    const response = await fetch(`http://mmi21g01.sae401.ovh/api/parties/${idpartie}`)
    if (response.ok) {
      jsonData.value = await response.json()
      jsonData.value = jsonData.value.savefile
        console.table(jsonData.value.savefile)
        // Je vérifie si la partie est perdue ou non
            // Si elle est perdue parce qu'il n'y a plus de jetons :
        if (jsonData.value[25].etat == "perdu" && jsonData.value[25].jetonsrestants == 0) {
            modalTitre.value = "A COURT DE TEMPS"
            modalTexte.value = "Vous n'avez plus de jetons, vous avez perdu ! Vous et votre partenaire avez échoué."
            isVisible.value = true
            // Si elle est perdue parce qu'on a trouvé l'assassin :
        } else if (jsonData.value[25].etat == "perdu") {
            modalTitre.value = "ASSASSIN !"
            modalTexte.value = "Vous avez trouvé l'assassin, vous avez perdu ! Vous et votre partenaire avez échoué."
            isVisible.value = true
        }

    //   je vérifie qui est le joueur, j1 ou j2
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
        agentstrouves.value = jsonData.value[25].agentstrouves

        //je récupère le nombre de jetons restants
        jetonsrestants.value = jsonData.value[25].jetonsrestants
        if(jetonsrestants.value == 0){
            jsonData.value[25].etat = "perdu"
            postJson();
            isVisible.value = true
        }

        //je cache ou affiche le formulaire d'indice
      if (currentPlayer.value == jsonData.value[25].currentPlayer) {
        //j'affiche le formulaire d'indice
        //je rend les cartes impossibles à cliquer
        if (indiceenvoye == false){
            document.querySelector(".indice-sender-container").style.visibility = "visible";
            //je donne une indication au joueur
        indication.value = "A vous de donner un indice, " + currentPlayer.value + " !"
        indication.value = indication.value.toUpperCase()
        }
        isDisabled.value = true
        

      } else {
        //je cache le formulaire d'indice
        //je rend les cartes cliquables
        document.querySelector(".indice-sender-container").style.visibility = "hidden";
        isDisabled.value = false
        //je donne une indication au joueur
        indication.value = "Essayez de trouver les mots avec l'indice de votre partenaire, " + currentPlayer.value + " !"
        indication.value = indication.value.toUpperCase()
      }

      //j'indique le nombre de cartes vertes trouvées
      let i = 0;
        jsonData.value.forEach((element, index) => {
        if (element.greenfound == true) {
            i++;
        }
        });
        agentstrouves.value = i;
        
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

//le bouton pour exporter le fichier JSON (test file)
function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

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
  
    //on cache le sender
    document.querySelector(".indice-sender-container").style.visibility = "hidden";
    indiceenvoye = true;
    indication.value = "Votre partenaire essaye de trouver les mots avec votre indice."
    indication.value = indication.value.toUpperCase()
}

//la gestion du chiffre de l'indice
function chiffreIndice(n) {
    const output = document.querySelector(".indice-input-chiffre");
    output.value = n;
}
//---------------------------------

// Envoyer une requête POST pour mettre à jour le fichier JSON
function postJson() {
    //on lance la requete
    // axios.put(`http://127.0.0.1:8000/api/parties/${idpartie}`, { 
    axios.put(`http://mmi21g01.sae401.ovh/api/parties/${idpartie}`, { 
  ...jsonData,
  savefile: jsonData.value 
}, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => console.log(response))
  .catch(error => console.log(error));



   
}

//la fonction pour sauvegarder le click sur une carte
function saveClick(position) {
if (isDisabled.value === true) {
        return;
    }
    //SI C'EST LE JOUEUR 1
    if (rolejoueur.value === 'j1') {
        if (jsonData.value[position].clickedj2 === true) {
            return;
        }else{
        jsonData.value[position].clickedj2 = true;

        //SI LA CARTE CLIQUEE EST NOIRE
        if(jsonData.value[position].couleurJ2 == 'black'){
            isVisible.value = true
            jsonData.value[25].etat = 'perdu'
        }

        //SI LA CARTE CLIQUEE EST VERTE
        if (jsonData.value[position].couleurJ2 === 'green') {
            if (jsonData.value[position].greenfound === true) {
                return;
            }
            jsonData.value[position].greenfound = true;
            indication.value = 'Vous avez trouvé une carte verte ! Vous pouvez continuer votre tour.'
            indication.value = indication.value.toUpperCase();
            
        }

        //SI LA CARTE CLIQUEE EST BEIGE
        if (jsonData.value[position].couleurJ2 === '#f2c667') {
            jsonData.value[25].jetonsrestants = jsonData.value[25].jetonsrestants - 1;
            indication.value = 'Oups ! Vous avez trouvé une carte beige ! Vous perdez un jeton.'
            indication.value = indication.value.toUpperCase();
            finTour();
        }
    }

    //SI C'EST LE JOUEUR 2
    } else {
        if (jsonData.value[position].clickedj1 === true) {
            return;
        }else{
        jsonData.value[position].clickedj1 = true;

        //SI LA CARTE CLIQUEE EST NOIRE
        if(jsonData.value[position].couleurJ1 == 'black'){
            isVisible.value = true
            jsonData.value[25].etat = 'perdu'
        }

        //SI LA CARTE CLIQUEE EST VERTE
        if (jsonData.value[position].couleurJ1 === 'green') {
            if (jsonData.value[position].greenfound === true) {
                return;
            }
            jsonData.value[position].greenfound = true; 
            indication.value = 'Vous avez trouvé une carte verte ! Vous pouvez continuer votre tour.'
            indication.value = indication.value.toUpperCase();
        }

        //SI LA CARTE CLIQUEE EST BEIGE
        if (jsonData.value[position].couleurJ1 === '#f2c667') {
            jsonData.value[25].jetonsrestants = jsonData.value[25].jetonsrestants - 1;
            indication.value = 'Oups ! Vous avez trouvé une carte beige ! Vous perdez un jeton.'
            indication.value = indication.value.toUpperCase();
            finTour();
        }
    }
    }
    postJson();
}
//--------------------------------------------------

//la fonction pour terminer son tour
function finTour(){
    indiceenvoye = false;
    console.log('envoyé ? : ' + indiceenvoye)
    if(tourjoueur.value === jsonData.value[25].j1){
        tourjoueur.value = jsonData.value[25].j2
        jsonData.value[25].currentPlayer = jsonData.value[25].j2
        postJson();
    }
    else{
        tourjoueur.value = jsonData.value[25].j1
        jsonData.value[25].currentPlayer = jsonData.value[25].j1
        postJson();
    }
    

    
}

//en cas de defaite, les fonctions du modal pour quitter
function quitter(){
    // window.location.href = `http://localhost:8000/fr/accueil`;
    window.location.href = `http://mmi21g01.sae401.ovh/fr/accueil`;
}

function retournerProfil(){
    window.location.href = `http://mmi21g01.sae401.ovh/fr/accueil`;
}

//la fonction pour recharger la page
function reloadData() {
  loadData()
}
</script>

<template>
    <div class="app">
         <Modal v-model:visible="isVisible" :closable="false" :title=modalTitre :cancelButton="{ text: 'Retourner à l\'accueil', onclick: quitter }" :okButton="{ text: 'Quitter', onclick: quitter }">
            <div>{{ modalTexte }} </div>
        </Modal>
        <p>{{ updateValue }}</p>
        <div class="app-nav">
            <div class="app-nav-content app-nav-content1">
                <!-- <BoutonMenu content="C'est le tour de " :variant=tourjoueur /> -->
                <BoutonMenu :variant=adversaire content="Votre équipier" />
                <BoutonMenu :variant=agentstrouves variant2="/15" content="Agents trouvés" />
                <BoutonMenu :variant=jetonsrestants content="Jetons restants " />
                <BoutonMenu v-if="isDisabled == false" content="Terminer mon tour" v-on:click="finTour()" />
            </div>
        </div>
        <div class="indice-output">
            <div class="indice-output-wrapper">
                <span class="indice-indice">Indice :  </span>
                <span class="indice-output-zone">{{ dernierIndice[0] }}</span>
                <span class="indice-output-chiffre">{{ dernierIndice[1] }}</span>
            </div>
        </div>
        <div class="joueur-container">
            <div class="joueur-content-left">
                <p class="joueur-content-left-texte">{{indication}}</p>
            </div>
            <div class="joueur-content-center">
                <div class="plateau">
                    <template v-for="(word, index) in jsonData.slice(0,25)" v-if="rolejoueur === 'j1'">
                       <CardGame :mot=word.mot :couleur=word.couleurJ1 :opponentCouleur=word.couleurJ2 :position=word.position :joueur=1  v-on:click="saveClick(word.position)" :clicked=word.clickedj2 :greenfound=word.greenfound :desactive="isDisabled"/>
                       <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                    </template>
                    <template v-for="(word, index) in jsonData.slice(0,25)" v-if="rolejoueur === 'j2'">
                       <CardGame :mot=word.mot :couleur=word.couleurJ2 :opponentCouleur=word.couleurJ1 :position=word.position :joueur=1  v-on:click="saveClick(word.position)" :clicked=word.clickedj1 :greenfound=word.greenfound :desactive="isDisabled"/>
                       <!-- // Je passe les props 'mot' et 'couleur' à mon composant CardGame avec une couleur spécifique au joueur 1 -->
                    </template>
                </div>
            </div>
            
        
            <div class="joueur-content-right">
                <h3>Votre grille :</h3>
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
    height: 20vh;
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
    /* background-color: #5e5e5e; */
    border: 1px solid #5e5e5e;
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
    height: 5vh;
    width: 100%;
    margin-top: 25px;
    /* border: 1px solid red; */
    font-size: 20px;
    color: white;
    text-transform: uppercase;
}

.indice-output-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 5vh;
    width: fit-content;
    padding: 10px;
    border-radius: 15px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    background-color: rgba(4, 0, 0, 0.177);
    font-size: 20px;
    color: white;
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
    width: 200px;
    height: 250px;
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
    height: 60vh;
}

.joueur-content-left {
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
}

.joueur-content-left-texte {
    /* border: 1px solid black; */
    font-size: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);

}

.joueur-content-center {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

}

.joueur-content-right {
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
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
}

.app-nav-content1 {
    width: 100%;
}
</style>
