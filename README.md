# dub-visualizer
c'est une application qui ouvre une vidéo en plein écran (ou en une taille convenable) ou l'on peut enregistrer un audio sur cette vidéo. Possibilité de changer de langue.

## Structure du Projet

Voici une description de la structure de base du projet :

- **forge.config.js** : C'est un fichier de configuration pour Electron Forge, un outil qui permet de créer des applications de bureau multiplateformes avec Electron. Il contient des informations sur la configuration de l'emballage de l'application, les créateurs de packages pour différentes plateformes et les plugins utilisés pour l'emballage.

- **package.json** : Ce fichier contient des informations sur notre projet et les dépendances que nous avons installées.

-**yarn.lock** : Ce fichier est généré par Yarn et contient des informations sur les dépendances de notre projet et leurs versions.

- **img/** : Ce dossier contient une image utilisée dans notre application et des icônes pour les applications de bureau.

- **src/** : Ce dossier contient les fichiers de notre application. Voici une brève description de son contenu :

    - **src/index.html** : Le fichier HTML principal de notre application.
    - **src/index.css** : Le fichier CSS principal de notre application.
    - **src/index.js** : Le processus principal Electron (création de la fenêtre).
    - **src/renderer.js** : Le code de l'interface (lecture vidéo, raccourcis clavier, enregistrement du micro, langues, thèmes). Il s'exécute dans la page, sans accès à Node.js.
    - **src/recorder-worklet.js** : L'AudioWorklet qui capture le son brut du micro (PCM), ensuite exporté en `.wav` sans compression.

## Fonctionnalités

- Lecture d'une vidéo locale, plein écran avec `F`.
- Enregistrement du micro synchronisé avec la vidéo (`R`, ou `Shift + R` pour repartir du début), export en `.wav` PCM 16 bits nommé d'après la vidéo et l'heure de la prise.
- Choix du micro et de la sortie audio, mémorisés entre deux lancements.
- Interface en 6 langues (anglais, français, espagnol, allemand, italien, russe) et thème clair / sombre, mémorisés également.

## Installation

Suivez ces étapes pour installer et exécuter le projet :

1. **Installer Node.js (version 22.13 ou plus récente) et npm :** [https://nodejs.org/](https://nodejs.org/).

2. **Installer les dépendances du projet :**

    Utilisez la commande `npm install` pour installer les dépendances du projet. npm lira le fichier `package.json` et installera tous les packages listés sous "dependencies".

    ```
    npm install
    ```

    Le dépôt fournit un `yarn.lock` : pour installer exactement les versions verrouillées, utilisez plutôt `yarn install`.

3. **Lancer l'application :**

    Enfin, une fois que toutes les dépendances sont installées, vous pouvez démarrer l'application en exécutant la commande suivante :

    ```
    npm run app
    ```

4. **Créer un package pour votre application :**

    Vous pouvez créer un package pour votre application en exécutant la commande suivante :

    ```
    npm run make
    ```

    Cette commande créera un package pour votre système d'exploitation actuel. Si vous souhaitez créer un package pour le système d'exploitation Windows, vous pouvez utiliser la commande suivante :

    ```
    npm run package-win
    ```