<script setup>
import { ref } from 'vue';

const props = defineProps(['couleur', 'mot'])

const motCard = props.mot.toUpperCase();
console.log(props.couleur)
</script>

<template>
    <div class="card">
        <div class="card-mot-container">
            <div class="card-mot">
                <p>{{motCard}}</p>
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