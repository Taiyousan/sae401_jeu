<script setup>
const props = defineProps(['couleur','mot', 'position', 'joueur', 'opponentCouleur'])
</script>

<template>
    <div></div>
</template>

<style scoped>
div {
    background-color: v-bind($props.couleur);
    width: 50px;
    height: 50px;
}
</style>