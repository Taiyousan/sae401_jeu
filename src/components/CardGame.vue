<script setup>
import { ref } from 'vue';

const props = defineProps(['couleur','mot', 'position', 'joueur', 'opponentCouleur'])
const motCard = props.mot.toUpperCase();

function clicked(e){
    console.log(props.opponentCouleur)
    const clickedCard = e.target
    if(props.opponentCouleur == "black"){
        clickedCard.style.backgroundColor = "black";
    }
    if (props.opponentCouleur == "green") {
        clickedCard.style.backgroundColor = "green";
     
    } if(props.opponentCouleur == "#f9e4b7") {
     clickedCard.style.backgroundColor = "#f2c667";   
    }
}

</script>

<template>
    <div class="card" v-on:click="clicked($event)" >
        <div class="card-mot-container" v-on:click.stop>
            <div class="card-mot" v-on:click.stop>
                <p v-on:click.stop>{{motCard}}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 120px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: end;
    padding-bottom: 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;
    background-size: cover;
    background-color: #f9e4b7;
    /* background-color: v-bind($props.couleur); */
}

.card-mot-container {
    height: 20%;
    width: 80%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-mot-container p {
    font-size: 60%;
    font-weight: bold;
    text-align: center;
    margin: 0;
}
</style>