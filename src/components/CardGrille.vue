<script>

export default {
    props: ['couleur','mot', 'position', 'joueur', 'opponentCouleur'],
    name : 'CardGame',
    mounted() {
        setTimeout(() => {
            this.$el.style.transform = 'translateX(0px)'
        }, this.position*100)
    },
  }

</script>

<template>
    <div class="case"></div>
</template>

<style scoped>
.case {
    width: 50px;
    height: 50px;
    transition: 0.2s;
    transform: translateX(500px);
    background-color: v-bind($props.couleur);
}
</style>