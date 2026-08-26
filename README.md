# Diablo Urgensses

Nom de travail d'un action-RPG isométrique original dans lequel des urgentistes stylisés affrontent des créatures et des boss dans des environnements hospitaliers et urbains transformés.

> Ce projet s'inspire du genre action-RPG isométrique, mais n'utilisera aucun nom, personnage, monstre, graphisme, son ou autre élément appartenant à la licence Diablo.

## Vision

Créer un jeu immédiatement lisible et agréable à contrôler, avec :

- une caméra isométrique fixe ;
- des combats en temps réel ;
- des héros urgentistes possédant chacun une identité de jeu forte ;
- des zones courtes mais rejouables ;
- une progression par expérience, niveaux, compétences et équipement ;
- une direction artistique 3D stylisée, légère et plus détaillée que Diablo 1 ;
- un fonctionnement fluide sur navigateur et ordinateur moyen de gamme.

Le développement commencera en solo. Un éventuel mode multijoueur sera étudié seulement après stabilisation du jeu principal.

## Direction artistique et technique

### Rendu visuel

- 3D isométrique avec caméra fixe et perspective légère ;
- modèles low-poly soignés et silhouettes très reconnaissables ;
- textures peintes, éclairage d'ambiance et ombres simples ;
- effets de pouvoirs en particules ;
- couleurs distinctes pour les attaques, dangers et objets interactifs ;
- petites zones chargées séparément afin de limiter la consommation mémoire.

### Objectif de performance

Le prototype devra viser une expérience fluide sur un ordinateur portable courant. Les options graphiques permettront ensuite de réduire :

- la résolution interne ;
- les ombres ;
- le nombre de particules ;
- la densité des éléments décoratifs.

## Univers

Une catastrophe inconnue déforme progressivement les lieux associés à l'hôpital. Les urgences deviennent un point de résistance, tandis que les parkings, laboratoires, forêts voisines et rues environnantes sont envahis.

Le ton mélangera aventure sombre, héroïsme médical et humour, sans se moquer des patients ni de situations médicales réelles.

### Premiers environnements envisagés

1. Service des urgences
2. Couloirs et sous-sols techniques
3. Parking souterrain
4. Laboratoire contaminé
5. Forêt entourant un ancien centre médical
6. Rues bloquées après la catastrophe
7. Hélistation et toit de l'hôpital

## Héros jouables

Les noms sont provisoires.

### Urgentiste interventionnel

Archétype : combattant de mêlée résistant.

- frappe lourde ;
- charge ;
- protection temporaire ;
- provocation ou contrôle des ennemis proches.

### Régulateur tactique

Archétype : combattant à distance précis.

- tir rapide ;
- attaque perforante ;
- pièges ;
- marquage d'une cible prioritaire.

### Réanimateur

Archétype : utilisateur d'énergie et soutien offensif.

- décharge électrique ;
- défibrillation en chaîne ;
- soin limité ;
- zone de contrôle.

### Toxicologue

Archétype : dégâts progressifs et affaiblissements.

- projection toxique ;
- nuage persistant ;
- antidote ;
- contamination propagée entre ennemis.

### Médecin catastrophe

Archétype : attaques de zone et soutien tactique.

- projectile explosif improvisé ;
- balise de ravitaillement ;
- onde de choc ;
- amélioration temporaire du groupe.

Le premier prototype n'utilisera que l'Urgentiste interventionnel.

## Boucle de jeu

1. Entrer dans une zone.
2. Explorer et combattre des groupes d'ennemis.
3. Trouver des objets et accomplir un objectif.
4. Affronter un ennemi renforcé ou un boss.
5. Gagner de l'expérience et des récompenses.
6. Améliorer le héros.
7. Débloquer la zone ou la difficulté suivante.

## Combat

### Commandes envisagées

- clic ou clavier pour se déplacer ;
- attaque principale ;
- trois à cinq capacités actives ;
- esquive avec délai de récupération ;
- potion ou soin limité ;
- interaction avec les objets du décor.

### Principes

- réponse immédiate des commandes ;
- attaques clairement télégraphiées ;
- collisions et zones d'effet compréhensibles ;
- ennemis différenciés par leur silhouette et leur comportement ;
- peu de pouvoirs au début, mais chacun doit être utile et satisfaisant.

## Progression

### Expérience et niveaux

Les combats et objectifs donnent de l'expérience. Chaque niveau peut apporter :

- une augmentation légère des caractéristiques ;
- un point de compétence ;
- le déblocage d'une capacité à certains paliers.

### Compétences

Chaque héros disposera d'un arbre compact comportant :

- capacités actives ;
- améliorations des capacités ;
- bonus passifs ;
- choix exclusifs permettant plusieurs styles de jeu.

### Caractéristiques provisoires

- puissance ;
- défense ;
- rapidité ;
- énergie ;
- récupération.

### Équipement

Emplacements envisagés :

- arme ou outil principal ;
- tenue ;
- gants ;
- chaussures ;
- accessoire médical.

Les raretés et statistiques aléatoires ne seront ajoutées qu'après validation du combat de base.

## Ennemis

Le bestiaire sera original et lié à la déformation du monde, sans représenter directement des patients réels.

### Prototype

- créature de mêlée lente ;
- créature rapide et fragile ;
- ennemi à distance ;
- mini-boss disposant de deux attaques spéciales.

### Conception des boss

Chaque boss devra proposer :

- une silhouette immédiatement identifiable ;
- plusieurs phases ou changements de comportement ;
- des attaques annoncées visuellement ;
- une récompense particulière ;
- une mécanique qui vérifie la maîtrise d'une capacité du héros.

## Premier prototype jouable

### Contenu

- une classe : Urgentiste interventionnel ;
- une petite zone dans l'hôpital ;
- déplacement, caméra et collisions ;
- attaque principale ;
- deux capacités actives ;
- esquive ;
- trois types d'ennemis ;
- un mini-boss ;
- barre de vie et ressource ;
- expérience et passage au niveau 2 ;
- déblocage d'une capacité ;
- sauvegarde locale.

### Hors périmètre initial

- multijoueur ;
- monde ouvert ;
- génération procédurale complète ;
- cinq classes terminées ;
- nombreux objets aléatoires ;
- boutique ou achats intégrés ;
- versions mobiles natives.

## Étapes de développement

### Phase 1 — Prototype de déplacement

- scène isométrique ;
- héros temporaire ;
- clic pour se déplacer ;
- collisions ;
- caméra et réglages de performance.

### Phase 2 — Combat fondamental

- cible et attaque ;
- points de vie ;
- deux capacités ;
- un premier ennemi ;
- effets visuels et sonores temporaires.

### Phase 3 — Boucle jouable

- plusieurs groupes d'ennemis ;
- expérience ;
- montée de niveau ;
- mini-boss ;
- victoire, défaite et recommencement.

### Phase 4 — Identité visuelle

- modèles originaux ;
- environnement d'hôpital ;
- interface ;
- animations ;
- effets et ambiance sonore.

### Phase 5 — Vertical slice

Une courte démonstration représentative de la qualité finale, utilisée pour décider de la suite du projet.

## Décisions encore ouvertes

- titre définitif du jeu ;
- moteur et bibliothèque 3D ;
- déplacement exclusivement à la souris ou mixte souris/clavier ;
- style précis des personnages ;
- ton narratif ;
- système d'équipement ;
- structure linéaire ou rejouabilité procédurale ;
- priorité future entre ordinateur, navigateur et mobile.

## Critères de réussite du prototype

Le prototype sera considéré comme concluant si :

- le déplacement est agréable ;
- les attaques ont un impact perceptible ;
- les dangers sont lisibles en vue isométrique ;
- une partie courte donne envie de recommencer ;
- les performances restent stables sur une machine courante ;
- l'ajout de nouvelles capacités et de nouveaux ennemis est simple.
