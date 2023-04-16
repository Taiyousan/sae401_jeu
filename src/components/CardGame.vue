<script>
import { watch } from 'vue';

export default {
    props: ['couleur','mot', 'position', 'joueur', 'opponentCouleur', 'clicked', 'greenfound', 'desactive'],
    name : 'CardGame',
    methods: {
        affichageCouleur() {
            if (this.clicked == true) {
            if (this.opponentCouleur == "#f2c667") {
                this.$el.style.backgroundImage = "url('/src/assets/img/cards_beige_token.png')" ;
                this.$el.style.backgroundSize = "cover";
            }else if(this.opponentCouleur == "black"){
                this.$el.style.backgroundImage = "url('/src/assets/img/cards_black_cut.png')" ;
                this.$el.style.color = "white";
            }
            
        }
            if (this.greenfound == true) {
                console.log(this.mot)
                this.$el.style.backgroundImage = "url('/src/assets/img/cards_green_cut.png')" ;
            }
        },
        clickedHandle(e){
            const clickedCard = e.target
            if(this.clicked == true){
                console.log("Vous avez déjà cliqué sur cette carte")
            }else{
                if(this.opponentCouleur == "black"){
                clickedCard.style.backgroundColor = "black";
                
            }
            if (this.opponentCouleur == "green") {
                clickedCard.style.backgroundColor = "green";
                clickedCard.style.backgroundImage = "url('/src/assets/img/cards_green_cut.png')" ;
             
            } if(this.opponentCouleur == "#f2c667") {
             clickedCard.style.backgroundColor = "#f2c667";
            }
            this.$el.style.transform = 'translateY(-10px)'
            setTimeout(() => {
                this.$el.style.transform = 'translateY(0px)'
            }, 100)
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.$el.style.transform = 'translateY(0px)'
        }, this.position*100),
        this.affichageCouleur()
    },
    watch: {
    clicked: {
        handler() {
            this.affichageCouleur();
        },
        deep: true
    },
    greenfound: {
        handler() {
            this.affichageCouleur();
        },
        deep: true
    }
}
}






</script>

<template>
    <div class="card" v-on:click="(!desactive && !greenfound) && clickedHandle($event)" v-on:load="slideIn($event)"  >
        <div class="card-mot-container" v-on:click.stop>
            <div class="card-mot" v-on:click.stop>
                <p v-on:click.stop>{{this.mot.toUpperCase()}}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 95px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: end;
    padding-bottom: 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;
    background-size: cover;
    /* background-color: #f9e4b7; */
    background-image: url('/src/assets/img/cards_beige_cut.png');
    /* background-color: v-bind($props.couleur); */
    /* border: 1px solid red; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transform: translateY(-1000px);
    
}

.card-mot-container {
   position: absolute;
   bottom: 17%;
}

.card-mot-container p {
    font-size: 10px;
    margin: 5px;
    font-weight: bold;
    text-align: center;
    margin: 0;
}
</style>