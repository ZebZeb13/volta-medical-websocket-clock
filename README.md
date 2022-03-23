# Volta medical websocket clock

## Description

Dans ce repository, vous trouverez une application web(client) qui affiche une horloge. Le temps est transmis via une websocket depuis le serveur. L'application est du type SPA(single page application) développée en typescript utilisant la librairie javascript React, le serveur est développé en python. Sur l'application, il est possible de choisir sa timezone, d'ajouter des alarmes.

## Fonctionnement

Le temps est transmis par le serveur au format timestamp toutes les secondes. L'application l'affiche en tenant compte de la timezone sélectionnée. À l'ajout d'une alarme, elle est envoyée au serveur avec l'offset correspondant à la timezone, exemple : +2 pour Paris. À la réception, le serveur crée un événement avec l'heure de l'alarme calculée en fonction de l'offset du client et celui du serveur, afin d'envoyer un message lorsque l'alarme "sonne".

![schéma de l'architecture](websocket-clock.png)

## Démarrer

Serveur:

il faut avoir python3 d'installer, puis executer les commandes suivantes à la racine du projet

```
cd backend
python3 /server.py
```

Client:

il faut avoir Node.js et npm d'installer, ensuite il faut télécharger les packets via les commandes

```
cd frontend
npm install
```

puis pour lancer l'application

```
npm run start
```

## Améliorations

- Ne pas avoir l'offset du serveur fixe
- L'envoie du temps doit pouvoir se faire avec une fonction qui s'exécute toutes les secondes dans un thread
- Ajouter des tests

## Fonctionnalités à implémenter

- Pouvoir annuler les alarmes
- Persister les alarmes
- Gérer plusieurs clients
