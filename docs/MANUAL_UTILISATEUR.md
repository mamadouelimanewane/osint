# MANUEL UTILISATEUR COMPLET - GRAVITY OSINT PLATFORM v5.8
**Classification :** CONFIDENTIEL / USAGE INTERNE
**Auteur :** Gravity Systems AI
**Langue :** Français

---

## 1. INSTALLATION ET DÉMARRAGE RAPIDE 🚀

### Prérequis
*   Un ordinateur sous Windows (10 ou 11).
*   Aucune installation complexe n'est requise. Le système est "Portable".

### Comment lancer le logiciel
1.  Ouvrez le dossier du projet : `c:\gravity\osint`.
2.  Cherchez le fichier nommé **`START_SYSTEM.bat`**.
3.  **Double-cliquez** dessus.
    *   Une fenêtre noire (la console du serveur) va s'ouvrir. **Ne la fermez pas !** C'est le moteur du logiciel.
    *   Votre navigateur internet va s'ouvrir automatiquement sur la page de connexion.

---

## 2. PREMIÈRE CONNEXION 🔐

Vous arrivez sur une interface sécurisée (écran noir et bleu avec des grilles).
1.  **Operator ID** : Entrez ce que vous voulez (ex: `admin`).
2.  **Access Key** : Entrez ce que vous voulez (ex: `password`).
3.  Cliquez sur **INITIATE SESSION**.
4.  **2FA Token** : Une demande de code apparaît. Entrez `123456` (ou n'importe quel chiffre) pour simuler l'authentification.
5.  Vous accédez au **Dashboard** (Tableau de Bord).

---

## 3. L'INTERFACE PRINCIPALE 🖥️

L'écran est divisé en 4 zones :
1.  **Barre Latérale (Gauche)** : Permet de changer de vue (Graph, Map, Analysis).
2.  **Barre de Recherche (Haut)** : Pour entrer vos cibles (IP, Nom, Email).
3.  **Zone Centrale (Le Graphe)** : Là où s'affichent les bulles (Nœuds) et les liens.
4.  **Terminal (Bas)** : La console noire pour les commandes système (Ping, etc.).

---

## 4. GUIDES DES FONCTIONNALITÉS (Pas à Pas)

### A. Recherche & Enquête 🔍
*   **Recherche Classique** : Tapez un nom (ex: "John Doe") dans la barre du haut et faites "Entrée". Le système va générer des connexions simulées (Email, Téléphone, Twitter).
*   **Recherche Réelle (IP)** : Tapez une vraie adresse IP (ex: `8.8.8.8`). Le système va trouver sa vraie localisation (Ville, Pays, FAI) et l'afficher en **VERT**.
*   **Google Dorks** : Si vous cherchez un nom, des carrés bleus "Search" apparaissent. Double-cliquez dessus pour ouvrir une recherche Google ciblée (pour trouver des fuites de données réelles).

### B. Le Graphe Interactif 🕸️
*   **Zoom/Pan** : Utilisez la molette de la souris pour zoomer. Cliquez-glissez le fond pour vous déplacer.
*   **Détails** : Cliquez sur une bulle pour voir ses détails dans le panneau de droite.
*   **Actions** : Dans le panneau de droite, des boutons apparaissent selon le type de cible :
    *   *Sur un Email* : "Check Leaks" (Vérifier les fuites de mots de passe).
    *   *Sur une Personne* : "Deep Search" ou "Biometric Scan".

### C. Le Scanner de Réseau (Nmap) 📡
Voulez-vous voir tous les appareils connectés à votre Wi-Fi ?
1.  Regardez en haut à droite, la barre d'outils "Analysis Modules".
2.  Cliquez sur le bouton **"Scan Local Network (Nmap)"**.
3.  Patientez quelques secondes.
4.  Le graphe va se remplir de point verts : ce sont votre ordinateur, votre téléphone, votre imprimante, etc.

### D. La Carte du Monde (Map) 🌍
1.  Cliquez sur l'icône **"Geo Map"** dans la barre de gauche.
2.  Vous verrez tous les points géolocalisés (ex: les Adresses IP réelles) sur une carte mondiale sombre.

---

## 5. SCÉNARIO DE DÉMONSTRATION : "OPÉRATION CHIMERA" 🕵️‍♂️
Suivez ce script pour impressionner vos collègues ou amis. C'est une enquête scénarisée intégrée.

1.  Dans la barre de recherche, tapez exactement : **`CHIMERA`** (en majuscules ou minuscules).
2.  Validez. Un nœud rouge **"X (The Architect)"** apparaît.
3.  Cliquez sur ce nœud rouge.
4.  Dans le panneau de droite, choisissez **"Biometric Facial Scan"**.
    *   Admirez l'animation de scan et la confirmation d'identité.
5.  Le graphe s'est agrandi. Cliquez maintenant sur le nœud violet **"Server: 192.168.X.X"**.
6.  Dans le panneau de droite, cliquez sur **"Decrypt Traffic"**.
    *   Le terminal de décryptage se lance et casse le code.
7.  Pour finir, cliquez sur l'onglet **"AI Analysis"** (à gauche) pour voir le score de risque de la cible.
8.  Cliquez sur le bouton **"Reports"** (à gauche) pour télécharger le dossier de preuves (Fichier Texte).

---

## 6. LE TERMINAL SYSTÈME (Pour les Experts) ⌨️
La zone noire en bas ("GRAVITY_SYSTEM_CONSOLE") est un vrai terminal de commande.
Vous pouvez taper :
*   `ping google.com` : Pour vérifier votre connexion internet.
*   `tracert 1.1.1.1` : Pour voir par où passent vos données.
*   `clear` : Pour effacer l'écran.

---

## 7. SAUVEGARDER VOTRE TRAVAIL 💾
1.  Cliquez sur le bouton **"Save Case"** dans le menu de gauche.
2.  Donnez un nom à votre enquête (ex: "Enquete_1").
3.  Votre travail est sauvegardé dans le dossier `c:\gravity\osint\cases`.

---

**Besoin d'aide ?**
Consultez les fichiers techniques ou contactez l'administrateur système (Vous !).

*Gravity OSINT Platform - v5.8*
