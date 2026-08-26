# Diablo Urgensses

Nom de travail d'un action-RPG isométrique original dans lequel des urgentistes stylisés affrontent des créatures et des boss dans des environnements hospitaliers et urbains transformés.

> Ce projet s'inspire du genre action-RPG isométrique, mais n'utilisera aucun nom, personnage, monstre, graphisme, son ou autre élément appartenant à la licence Diablo.

## Prototype jouable

Le prototype 0.1 contient actuellement :

- une salle de déchocage 3D low-poly ;
- une caméra isométrique fixe ;
- un mannequin d'Urgentiste Déchoc ;
- le déplacement au clic ou avec ZQSD/WASD ;
- des collisions simples avec les murs et le mobilier ;
- une première interface de vie, d'énergie et de capacités.

Pour le lancer localement :

```bash
npm start
```

Ouvrir ensuite `http://localhost:4173`. Three.js est chargé sous forme de module web depuis jsDelivr ; une connexion Internet est donc nécessaire pour cette première version.

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

Un agent infectieux fictif et non identifié altère certains patients et déforme progressivement les lieux associés à l'hôpital. Il ne représente ni le COVID ni aucune maladie réelle. Les urgences deviennent un point de résistance, tandis que les parkings, laboratoires, forêts voisines et rues environnantes sont envahis.

Les patients altérés sont des victimes à stabiliser, jamais des ennemis à tuer. Le ton mélangera aventure sombre, héroïsme médical et humour, sans se moquer des patients ni de situations médicales réelles.

### Premiers environnements envisagés

1. Service des urgences
2. Couloirs et sous-sols techniques
3. Parking souterrain
4. Laboratoire contaminé
5. Forêt entourant un ancien centre médical
6. Rues bloquées après la catastrophe
7. Hélistation et toit de l'hôpital

## Héros jouables

Quatre classes complémentaires sont prévues.

### Urgentiste Déchoc

Archétype : guerrier de mêlée résistant.

- combat rapproché et stabilisation au contact ;
- bistouri de précision ;
- brancard-bouclier ;
- charge, poussée et contrôle des patients altérés ;
- protection des alliés.

### Urgentiste SMUR

Archétype : combattant mobile à distance.

- lancers de seringues stabilisatrices ;
- injecteur pneumatique ;
- tirs à effets variés ;
- marquage des cibles prioritaires ;
- balises et déplacements rapides.

### Urgentiste de catastrophe

Archétype : utilisateur de capacités offensives, défensives et de soutien.

- aérosols thérapeutiques ;
- vagues de décontamination ;
- barrières sanitaires ;
- améliorations et auras ;
- grandes zones de stabilisation.

### Urgentiste régulateur

Archétype : coordinateur et invocateur.

- appel d'internes agissant comme familiers ;
- déploiement temporaire d'équipes mobiles ;
- drones sanitaires ;
- ambulances et largages de matériel ;
- passage d'un hélicoptère du SAMU en rase-motte pour un bombardement thérapeutique de grande zone.

Le premier prototype utilisera l'Urgentiste Déchoc.

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

- arsenal entièrement non létal composé d'outils hospitaliers détournés ;
- absence de sang et d'animation de mort pour les patients ;
- jauge de crise ou d'altération à la place des points de vie ennemis ;
- réponse immédiate des commandes ;
- attaques clairement télégraphiées ;
- collisions et zones d'effet compréhensibles ;
- patients altérés différenciés par leur silhouette et leur comportement ;
- peu de pouvoirs au début, mais chacun doit être utile et satisfaisant.

### Arsenal médical

- bistouri de précision pour la stabilisation au contact ;
- seringues stabilisatrices à distance ;
- diffuseurs de gaz et d'aérosols thérapeutiques ;
- défibrillateur et poches de perfusion ;
- garrot tactique et brancard-bouclier ;
- drones, ambulances, équipes médicales et hélicoptère du SAMU.

Les impacts seront représentés par des effets lumineux, la dissipation de l'aura infectieuse et des animations de stabilisation.

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

## Patients altérés et autres adversaires

Le bestiaire sera original et lié à l'agent infectieux fictif. Les humains contaminés seront appelés **patients altérés** plutôt que zombies.

Leur jauge représente leur niveau de crise. Lorsqu'elle atteint zéro :

1. le patient est stabilisé et retrouve une apparence saine ;
2. il devient immédiatement non ciblable, non cliquable et invincible ;
3. il reste brièvement désorienté ;
4. il devient un PNJ allié ;
5. il rejoint automatiquement une sortie sécurisée et quitte la zone.

Sauver un patient peut accorder de l'expérience, améliorer le score de mission ou fournir une ressource médicale.

### Profils envisagés

- patient fébrile : lent et résistant ;
- patient agité : rapide et imprévisible ;
- patient aérosolisant : crée des zones dangereuses ;
- patient en détresse : doit être stabilisé rapidement ;
- patient lourdement altéré : adversaire d'élite ;
- entités non humaines liées à la contamination, pour diversifier le bestiaire.

### Prototype

- patient altéré de mêlée lent ;
- patient altéré rapide et fragile ;
- patient altéré à distance ;
- mini-boss disposant de deux capacités spéciales.

### Conception des boss

Chaque boss devra proposer :

- une silhouette immédiatement identifiable ;
- plusieurs phases ou changements de comportement ;
- des attaques annoncées visuellement ;
- une récompense particulière ;
- une mécanique qui vérifie la maîtrise d'une capacité du héros.

## Premier prototype jouable

### Contenu

- une classe : Urgentiste Déchoc ;
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
- quatre classes terminées ;
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
