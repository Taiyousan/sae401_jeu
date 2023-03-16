<script setup>

const props = defineProps(['content','variant', 'link'])



</script>

<template>
    <a href="">
        <div class="bouton-menu">
            <div class="bouton-menu__texte">{{props.content}}{{ props.variant }}</div>
        </div>
    </a>
</template>

<style scoped>

a {
    text-decoration: none;
}

.bouton-menu {
    width: fit-content;
    height: 50px;
    background-color: #F2F2F2;
    border-radius: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    padding: 0 10px 0 10px;
}

.bouton-menu:hover {
    transform: scale(1.1);
}

.bouton-menu__texte {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    text-transform: uppercase;
}
</style>