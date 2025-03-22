# Assistant Gmail - Module de Gestion d'Emails

Ce module fait partie de l'Assistant Gmail MCP et fournit des fonctions pour analyser, catégoriser et gérer efficacement votre boîte de réception Gmail.

## 📋 Fonctionnalités

Le module `check_email.js` propose les fonctionnalités suivantes :

- **Analyse des emails non lus** (`checkEmail`) : Scanne les emails non lus récents et fournit un résumé clair.
- **Catégorisation des emails** (`emailCategorize`) : Organise les emails par catégories thématiques.
- **Identification des emails urgents** (`emailAction`) : Détecte les emails qui nécessitent une action rapide.
- **Archivage des emails** :
  - `emailArchive` : Archive un email spécifique.
  - `emailArchiveAll` : Archive tous les emails non lus récents.
  - `emailArchiveCategory` : Archive tous les emails d'une catégorie spécifique.
- **Processeur de commandes** (`processEmailCommand`) : Point d'entrée unique pour traiter toutes les commandes sans confirmation supplémentaire.

## 🛠️ Utilisation

Le module s'intègre à l'Assistant Gmail MCP et utilise les fonctions d'API Gmail pour interagir avec votre boîte de réception.

### Nouvelle méthode simplifiée

La nouvelle fonction `processEmailCommand` sert de point d'entrée pour toutes les commandes :

```javascript
// Syntaxe générale
processEmailCommand(command, args);

// Exemples d'utilisation
processEmailCommand('check_email');
processEmailCommand('email_archive', '18428abce778dd23');
processEmailCommand('email_archive_category', 'NEWSLETTERS');
```

Cette approche permet l'exécution directe des commandes sans demander de confirmation supplémentaire, simplifiant ainsi l'interaction avec l'assistant.

### Commandes disponibles

Les commandes suivantes sont prises en charge par le processeur de commandes :

- `check_email` : Vérifier les emails non lus récents
- `email_categorize` : Catégoriser les emails récents
- `email_action` : Identifier les emails nécessitant une action
- `email_archive [ID]` : Archiver un email spécifique
- `email_archive_all` : Archiver tous les emails non lus récents
- `email_archive_category [CATEGORIE]` : Archiver tous les emails d'une catégorie spécifique

## 📊 Catégories disponibles

Les emails peuvent être classés dans les catégories suivantes :
- `URGENT` : Emails marqués comme urgents ou avec des délais imminents.
- `PROFESSIONNEL` : Communications liées au travail, projets, clients.
- `MARKETING` : Emails promotionnels et campagnes marketing.
- `NEWSLETTERS` : Bulletins d'information et abonnements.
- `PERSONNEL` : Communications personnelles.
- `AUTRES` : Emails qui ne correspondent à aucune catégorie spécifique.

## 🔍 Algorithme de catégorisation

Le module utilise une approche basée sur des mots-clés pour catégoriser automatiquement les emails. La catégorisation est effectuée en analysant les snippets (aperçus) des emails sans accéder au contenu complet, ce qui offre :
- Une meilleure performance
- Un respect accru de la confidentialité
- Un traitement rapide même avec un grand volume d'emails

## ⚙️ Configuration

Ce module est conçu pour fonctionner avec l'API Gmail et nécessite les autorisations appropriées pour accéder à votre boîte de réception. Il s'intègre parfaitement à l'écosystème MCP (Multi-Cloud Platform).

## 🔄 Intégration

Le module exporte ses fonctions pour être facilement utilisé par d'autres composants de l'Assistant Gmail :

```javascript
module.exports = {
  processEmailCommand, // Fonction principale pour traiter les commandes
  checkEmail,
  emailCategorize,
  emailAction,
  emailArchive,
  emailArchiveAll,
  emailArchiveCategory
};
```

## 🚀 Exemple de sortie

```
📊 **RÉSUMÉ DE VOTRE BOÎTE DE RÉCEPTION**

📬 **5 emails non lus récents trouvés**

📋 **Aperçu des emails récents:**
- **Email 1** (ID: 18428abce778dd23): Réunion de projet prévue pour demain à 14h00...
- **Email 2** (ID: 18428c5db91aef47): Votre facture du mois de mars est disponible...
- **Email 3** (ID: 18429d6fb82cf33a): Offre spéciale : -20% sur notre nouvelle gamme...

💡 **Actions suggérées:**
- Utilisez `email_search [terme]` pour rechercher des emails spécifiques
- Utilisez `email_categorize` pour une catégorisation par sujets
- Utilisez `read_email [ID]` pour lire un email spécifique
- Utilisez `email_archive [ID]` pour archiver un email
```

## 📈 Système de catégorisation avancé

Ce module s'appuie sur le système de catégorisation décrit dans `email-categorization.js` et la base de données de mots-clés définie dans `keyword-database.js`. Pour une catégorisation plus précise et personnalisée, vous pouvez consulter le guide complet des catégories dans le fichier `Guide de catégorisation des emails par labels.md`.

## 🔐 Sécurité et confidentialité

L'assistant traite vos emails avec un souci constant de confidentialité :
- Aucune donnée n'est stockée en dehors de votre environnement
- Le traitement s'effectue localement via l'API Gmail
- Seules les métadonnées des emails sont utilisées pour la catégorisation rapide

## 🔧 Développement

Pour contribuer au développement de ce module :
1. Clonez le dépôt
2. Installez les dépendances requises
3. Testez vos modifications avec un compte Gmail de test
4. Soumettez une pull request avec une description détaillée de vos changements

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
