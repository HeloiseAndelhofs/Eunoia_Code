# Fonctionnalités à commencer

### ***User :***




*Mettre en place les avatars*


### ***Messages :***

- Web Socket


### ***Salons :***

- Web Socket

-- Salons likés

-- Pouvoir créer un salon et en devenir admin

***Mettre en place les web socket coté server après le client***





## A faire absolument

- Trouver un autre moyen d'update les préférences (éviter de delete et de rajouter après)

- Vérifier que l'authentification fonctionne (les deux durées, session et 10 jours)

- Penser à quand est ce que l'utilisateur va créer son avatar pour savoir si l'url va être envoyé au même moment que les autres données.
***Si non il faut aller changer dans le register validator et le register service / controller***



## A rajouter si il y a le temps

- Faire en sorte que si l'utilisateur est connecté, il soit marqué comme "en ligne" et ne puisse que se déconnecter

- Rajouter jwt connection et refresh

- Quand on cherche un utilisateur, faire une recherche sur les utilisateurs avec un nom ressemblant (majuscule, sans majuscule, espace, pas espace, tiret, pas tiret, ...) --> il faudra changer le controller/service pour ça

-- Rajouter les admins et créateurs des salons/évenements