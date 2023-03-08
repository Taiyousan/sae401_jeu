<script setup>
import { ref } from 'vue';

const props = defineProps(['couleur','mot'])
const motCard = props.mot.toUpperCase();

function clicked(e){
    const clickedCard = e.target
    clickedCard.style.transform = 'scale(0.9)'
  
}
</script>

<template>
    <div class="card" v-on:click="clicked($event)">
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
    
    background-color: v-bind($props.couleur);
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