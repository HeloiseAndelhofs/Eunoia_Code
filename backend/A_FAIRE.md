# Fonctionnalités à commencer

### ***User :***

- Update

- Delete 


*Mettre en place les avatars*


### ***Messages :***

- Web Socket


### ***Salons :***

- Web Socket





## A faire absolument


- Récupérer les pérerences quand on récupere un user

- Vérifier que l'authentification fonctionne (les deux durées, session et 10 jours)

- Penser à quand est ce que l'utilisateur va créer son avatar pour savoir si l'url va être envoyé au même moment que les autres données.
***Si non il faut aller changer dans le register validator et le register service / controller***



## A rajouter si il y a le temps

- Faire en sorte que si l'utilisateur est connecté, il soit marqué comme "en ligne" et ne puisse que se déconnecter

- Rajouter jwt connection et refresh

- Quand on cherche un utilisateur, faire une recherche sur les utilisateurs avec un nom ressemblant (majuscule, sans majuscule, espace, pas espace, tiret, pas tiret, ...) --> il faudra changer le controller/service pour ça