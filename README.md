# Assistant Gmail MCP

Un assistant intelligent pour Gmail basé sur l'architecture Multi-Cloud Platform (MCP), conçu pour révolutionner la gestion de votre boîte de réception avec des fonctionnalités avancées d'automatisation, de catégorisation et de gestion proactive.

## 🎯 Mission

Soulager l'utilisateur de la gestion quotidienne de sa boîte mail tout en le gardant informé des éléments vraiment importants, avec une organisation intelligente et proactive.

## 🛠 Fonctionnalités principales

- **Scan intelligent de boîte de réception** : Analyse automatique des emails récents
- **Catégorisation avancée** : Organisation des emails par thèmes et priorités
- **Détection d'emails prioritaires** : Identification des messages nécessitant une action rapide
- **Gestion proactive** : Suggestions d'actions basées sur le contenu des emails
- **Fonctions d'archivage** : Par ID, par lot ou par catégorie
- **Rédaction assistée** : Génération de réponses contextuelles et professionnelles
- **Protection de la confidentialité** : Traitement local des données

## 🎮 Commandes disponibles

### Analyse et catégorisation
- `check_email` : Vérifier les emails non lus récents
- `email_categorize` : Catégoriser les emails récents
- `email_action` : Identifier les emails nécessitant une action

### Gestion des emails
- `email_archive [ID]` : Archiver un email spécifique
- `email_archive_all` : Archiver tous les emails non lus récents
- `email_archive_category [CATEGORIE]` : Archiver tous les emails d'une catégorie 

### Lecture et recherche
- `read_email [ID]` : Lire un email spécifique
- `search_emails [REQUÊTE]` : Rechercher des emails

### Rédaction et envoi
- `draft_email` : Créer un brouillon d'email
- `send_email` : Envoyer un email après confirmation

## ⚙️ Architecture technique

L'Assistant Gmail MCP s'appuie sur plusieurs modules spécialisés :

- **Module d'analyse** : Traitement et interprétation des emails
- **Système de catégorisation** : Classification intelligente basée sur une taxonomie à deux niveaux
- **Gestionnaire d'API Gmail** : Communication optimisée avec l'API Gmail
- **Utilitaires de traitement** : Gestion des erreurs, validation, limitation de débit

## 🔐 Sécurité et confidentialité

L'assistant traite vos emails avec un souci constant de confidentialité :
- Aucune donnée n'est stockée en dehors de votre environnement
- Le traitement s'effectue localement via l'API Gmail
- Confirmation explicite requise pour toute action sensible (envoi, suppression)

## 📊 Catégories de classification

L'assistant organise vos emails selon les catégories suivantes :
- `URGENT` : Emails marqués comme urgents ou avec des délais imminents
- `PROFESSIONNEL` : Communications liées au travail, projets, clients
- `MARKETING` : Emails promotionnels et campagnes marketing
- `NEWSLETTERS` : Bulletins d'information et abonnements
- `PERSONNEL` : Communications personnelles
- `AUTRES` : Emails qui ne correspondent à aucune catégorie spécifique

## 🚀 Installation et utilisation

1. Clonez ce dépôt : `git clone https://github.com/Eliassylla/Assistant-Gmail-MCP.git`
2. Configurez les accès à l'API Gmail selon la documentation
3. Personnalisez vos préférences de catégorisation si nécessaire
4. Lancez l'assistant via l'interface MCP

## 🔗 Intégration

Ce projet s'intègre avec le [système de catégorisation d'emails](https://github.com/Eliassylla/email-categorization-system) pour une classification avancée et personnalisable.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Nous recherchons particulièrement :
- Amélioration des algorithmes de catégorisation
- Nouvelles fonctionnalités de gestion d'emails
- Optimisations de performances
- Documentation et tutoriels

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
