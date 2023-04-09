# CODE NAMES DUO

# Reste à faire
- régler problème de changement de taille au build

- trouver un moyen de mettre à jour les props des composants. Ils se mettent à jour si je refresh, mais pas avec la fonction reload.

# process
## Le joueur 1 lance la partie
- on génère le json
- on met l'id du j1 dans "j1"
- on crée le lien vers vue avec dans l'url l'id du joueur/ou l'id de la partie elle-même
- vue s'ouvre et récupère l'id du joueur afin de construire sa requête vers la base de donnée afin d'accéder au json
- vue lit le fichier, le joueur 1 est en attente d'un joueur 2
- dans symfony, dans la page "parties en cours", maintenant que la partie est affichée, un lien pour rejoindre est crée.

## Le joueur 2 veut rejoindre
- il clique sur le lien pour rejoindre, qui se construit au click en ajoutant 'id: iddujoueur2' dans l'url.
- Ce lien mène vers vue, il ouvre le même json
- Vue remarque avec une condition que l'url contient un j2, et donc s'adapte sur cet écran là

# OU ALORS
- Sur vue, j'ai deux vue : 
    * une pour le j1, qui est ouverte avec symfony lors du lancement de la partie
    * une pour le j2, qui est ouverte avec symfony avec la création du lien pour rejoindre

# enregistrer le nombre de cartes vertes sur lesquelles on a cliqué
- Au reload du json :
    - je fais un foreach qui cherche dans le tableau les entrées dont clicked = true et couleur = green
    - Quand c'est le cas, je fais un +1 dans json[25].greenfound

    * Je dois donc créer une entrée greenfoundj1 et greenfoundj2 dans json[25]
    * Je dois créer une entrée clickedj1 et clickedj2 pour chaque carte

# QUAND UNE CARTE VERTE EST TROUVEE (à faire)
- pour les deux joueurs : la carte est remplacée par une carte verte qui indique qu'on l'a trouvée
    -> Une entrée "greenfound" est ajoutée. Si elle est true, on change l'image de la carte pour les DEUX joueurs
- +1 sur le compteur /15