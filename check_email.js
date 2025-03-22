// Importer les utilitaires
const { handleGmailApiRequest } = require('./utils/error-handling');
const { rateLimitedApiCall } = require('./utils/rate-limiter');
const { retry } = require('./utils/retry');
const { batchGetEmails, getEmailById } = require('./utils/optimized-email-reader');
const { validateEmailData } = require('./utils/validation');

const checkEmail = async () => {
  try {
    // Recherche des emails non lus récents avec gestion d'erreur et retry
    const result = await retry(
      () => handleGmailApiRequest(
        () => rateLimitedApiCall(search_emails, {
          query: "is:unread newer_than:1d",
          maxResults: 20
        })
      ),
      {
        maxRetries: 3,
        retryDelay: 2000,
        shouldRetry: (error) => error.status >= 500 || error.status === 429,
        onRetry: (error, count) => console.log(`Retry ${count} due to ${error.message}`)
      }
    );
    
    if (!result.messages || result.messages.length === 0) {
      return "📭 Aucun email non lu récent trouvé.";
    }
    
    // Utiliser les données de la recherche directement
    const emailCount = result.messages.length;
    
    // Créer un résumé simple basé sur les informations disponibles
    let summary = "📊 **RÉSUMÉ DE VOTRE BOÎTE DE RÉCEPTION**\n\n";
    summary += `📬 **${emailCount} emails non lus récents trouvés**\n\n`;
    
    // Ajouter une liste simple des emails
    summary += "📋 **Aperçu des emails récents:**\n";
    
    // Limiter à 10 emails pour éviter une réponse trop longue
    const emailsToShow = Math.min(emailCount, 10);
    
    for (let i = 0; i < emailsToShow; i++) {
      const email = result.messages[i];
      summary += `- **Email ${i+1}** (ID: ${email.id}): ${email.snippet || 'Pas d\'aperçu disponible'}\n`;
    }
    
    if (emailCount > 10) {
      summary += `\n...et ${emailCount - 10} autres emails\n`;
    }
    
    summary += "\n💡 **Actions suggérées:**\n";
    summary += "- Utilisez `email_search [terme]` pour rechercher des emails spécifiques\n";
    summary += "- Utilisez `email_categorize` pour une catégorisation par sujets\n";
    summary += "- Utilisez `read_email [ID]` pour lire un email spécifique\n";
    summary += "- Utilisez `email_archive [ID]` pour archiver un email\n";
    summary += "- Utilisez `email_archive_all` pour archiver tous les emails affichés\n";
    
    return summary;
  } catch (error) {
    if (error.name === "GmailValidationError") {
      return `❌ Erreur de validation: ${error.message}. Détails: ${JSON.stringify(error.fieldErrors)}`;
    }
    return `❌ Erreur lors de l'analyse des emails : ${error.message}`;
  }
};

// Version améliorée de la catégorisation
const emailCategorize = async () => {
  try {
    // Recherche des emails non lus récents avec gestion améliorée
    const result = await retry(
      () => handleGmailApiRequest(
        () => rateLimitedApiCall(search_emails, {
          query: "is:unread newer_than:3d",
          maxResults: 30
        })
      ),
      {
        maxRetries: 2,
        retryDelay: 1500
      }
    );
    
    if (!result.messages || result.messages.length === 0) {
      return "📭 Aucun email récent trouvé à catégoriser.";
    }
    
    // Catégories simplifiées
    const categories = {
      "URGENT": [],
      "PROFESSIONNEL": [],
      "MARKETING": [],
      "NEWSLETTERS": [],
      "PERSONNEL": [],
      "AUTRES": []
    };
    
    // Mots-clés simplifiés pour la catégorisation
    const keywordMap = {
      "URGENT": ["urgent", "important", "immédiat", "deadline", "aujourd'hui", "rappel", "critical"],
      "PROFESSIONNEL": ["projet", "client", "réunion", "meeting", "facture", "contrat", "proposition", "devis"],
      "MARKETING": ["offre", "promotion", "soldes", "réduction", "newsletter", "campaign", "marketing"],
      "NEWSLETTERS": ["newsletter", "abonnement", "subscription", "bulletin", "update", "weekly", "monthly"],
      "PERSONNEL": ["personnel", "privé", "famille", "ami", "invitation", "event", "social"]
    };
    
    // Catégorisation basée sur les snippets uniquement
    for (const email of result.messages) {
      const snippet = email.snippet || "";
      let categorized = false;
      
      for (const [category, keywords] of Object.entries(keywordMap)) {
        if (keywords.some(keyword => snippet.toLowerCase().includes(keyword.toLowerCase()))) {
          categories[category].push(email);
          categorized = true;
          break;
        }
      }
      
      if (!categorized) {
        categories["AUTRES"].push(email);
      }
    }
    
    // Générer un résumé des catégories
    let summary = "📊 **CATÉGORISATION DE VOS EMAILS**\n\n";
    
    for (const [category, emails] of Object.entries(categories)) {
      if (emails.length > 0) {
        summary += `📁 **${category}** (${emails.length})\n`;
        emails.slice(0, 3).forEach((email, index) => {
          summary += `  ${index + 1}. (ID: ${email.id}) ${email.snippet ? email.snippet.substring(0, 70) + '...' : 'Pas d\'aperçu disponible'}\n`;
        });
        if (emails.length > 3) {
          summary += `  ...et ${emails.length - 3} autres\n`;
        }
        summary += "\n";
      }
    }
    
    summary += "\n💡 **Actions suggérées:**\n";
    summary += "- Utilisez `email_archive [ID]` pour archiver un email spécifique\n";
    summary += "- Utilisez `email_archive_category [CATEGORIE]` pour archiver tous les emails d'une catégorie\n";
    
    return summary;
  } catch (error) {
    if (error.name === "GmailValidationError") {
      return `❌ Erreur de validation: ${error.message}. Détails: ${JSON.stringify(error.fieldErrors)}`;
    }
    return `❌ Erreur lors de la catégorisation des emails : ${error.message}`;
  }
};

// Fonction améliorée pour les emails d'action
const emailAction = async () => {
  try {
    // Recherche des emails nécessitant une action avec rate limiting et gestion d'erreurs
    const result = await retry(
      () => handleGmailApiRequest(
        () => rateLimitedApiCall(search_emails, {
          query: "is:unread (urgent OR important OR action OR required OR deadline OR confirmation OR review OR approve)",
          maxResults: 15
        })
      )
    );
    
    if (!result.messages || result.messages.length === 0) {
      return "✅ Aucun email nécessitant une action urgente n'a été trouvé.";
    }
    
    // Générer un résumé des actions requises
    let summary = "🚨 **EMAILS NÉCESSITANT UNE ACTION**\n\n";
    
    result.messages.forEach((email, index) => {
      summary += `${index + 1}. **Action requise** (ID: ${email.id}): ${email.snippet ? email.snippet.substring(0, 100) + '...' : 'Pas d\'aperçu disponible'}\n\n`;
    });
    
    summary += "\n💡 **Actions suggérées:**\n";
    summary += "- Utilisez `read_email [ID]` pour lire un email spécifique\n";
    summary += "- Utilisez `email_draft` pour préparer des réponses\n";
    
    return summary;
  } catch (error) {
    return `❌ Erreur lors de l'analyse des actions requises : ${error.message}`;
  }
};

// Fonction améliorée pour archiver un email spécifique
const emailArchive = async (messageId) => {
  try {
    if (!messageId) {
      return "❌ Veuillez spécifier l'ID de l'email à archiver. Exemple: email_archive 195bbb0cc92191ce";
    }
    
    // Archiver l'email avec gestion d'erreurs améliorée
    await retry(
      () => handleGmailApiRequest(
        () => rateLimitedApiCall(modify_email, {
          messageId: messageId,
          removeLabelIds: ["INBOX"]
        })
      ),
      {
        maxRetries: 2,
        retryDelay: 1000
      }
    );
    
    return `✅ Email avec ID ${messageId} archivé avec succès.`;
  } catch (error) {
    return `❌ Erreur lors de l'archivage de l'email : ${error.message}`;
  }
};

// Fonction améliorée pour archiver tous les emails
const emailArchiveAll = async (maxCount = 20) => {
  try {
    // Recherche des emails non lus récents avec gestion d'erreurs
    const result = await retry(
      () => handleGmailApiRequest(
        () => rateLimitedApiCall(search_emails, {
          query: "is:unread newer_than:1d",
          maxResults: maxCount
        })
      )
    );
    
    if (!result.messages || result.messages.length === 0) {
      return "📭 Aucun email non lu récent trouvé à archiver.";
    }
    
    let archivedCount = 0;
    const errors = [];
    
    // Archiver chaque email avec rate limiting
    for (const email of result.messages) {
      try {
        await rateLimitedApiCall(modify_email, {
          messageId: email.id,
          removeLabelIds: ["INBOX"]
        });
        archivedCount++;
      } catch (err) {
        errors.push(`Email ID ${email.id}: ${err.message}`);
      }
    }
    
    let summary = `✅ ${archivedCount} emails sur ${result.messages.length} ont été archivés.`;
    
    if (errors.length > 0) {
      summary += `\n\n⚠️ Erreurs rencontrées (${errors.length}):\n`;
      errors.slice(0, 3).forEach(error => {
        summary += `- ${error}\n`;
      });
      if (errors.length > 3) {
        summary += `- ...et ${errors.length - 3} autres erreurs`;
      }
    }
    
    return summary;
  } catch (error) {
    return `❌ Erreur lors de l'archivage des emails : ${error.message}`;
  }
};

// Fonction améliorée pour archiver par catégorie
const emailArchiveCategory = async (category) => {
  try {
    if (!category) {
      return "❌ Veuillez spécifier la catégorie des emails à archiver. Exemple: email_archive_category NEWSLETTERS";
    }
    
    // Liste des catégories valides
    const validCategories = ["URGENT", "PROFESSIONNEL", "MARKETING", "NEWSLETTERS", "PERSONNEL", "AUTRES"];
    
    // Vérifier si la catégorie est valide
    const upperCategory = category.toUpperCase();
    if (!validCategories.includes(upperCategory)) {
      return `❌ Catégorie invalide. Les catégories valides sont: ${validCategories.join(", ")}`;
    }
    
    // Construire la requête de recherche en fonction de la catégorie
    let query = "is:unread newer_than:3d";
    
    // Ajouter des mots-clés en fonction de la catégorie
    const keywordMap = {
      "URGENT": ["urgent", "important", "immédiat", "deadline", "aujourd'hui", "rappel", "critical"],
      "PROFESSIONNEL": ["projet", "client", "réunion", "meeting", "facture", "contrat", "proposition", "devis"],
      "MARKETING": ["offre", "promotion", "soldes", "réduction", "newsletter", "campaign", "marketing"],
      "NEWSLETTERS": ["newsletter", "abonnement", "subscription", "bulletin", "update", "weekly", "monthly"],
      "PERSONNEL": ["personnel", "privé", "famille", "ami", "invitation", "event", "social"]
    };
    
    // Si ce n'est pas la catégorie AUTRES, ajouter les mots-clés à la requête
    if (upperCategory !== "AUTRES" && keywordMap[upperCategory]) {
      const keywords = keywordMap[upperCategory];
      if (keywords.length > 0) {
        query += ` (${keywords.join(" OR ")})`;
      }
    }
    
    // Recherche des emails avec gestion d'erreurs améliorée
    const result = await retry(
      () => handleGmailApiRequest(
        () => rateLimitedApiCall(search_emails, {
          query: query,
          maxResults: 30
        })
      )
    );
    
    if (!result.messages || result.messages.length === 0) {
      return `📭 Aucun email de la catégorie ${upperCategory} trouvé à archiver.`;
    }
    
    let archivedCount = 0;
    const errors = [];
    
    // Archiver chaque email avec rate limiting
    for (const email of result.messages) {
      try {
        await rateLimitedApiCall(modify_email, {
          messageId: email.id,
          removeLabelIds: ["INBOX"]
        });
        archivedCount++;
      } catch (err) {
        errors.push(`Email ID ${email.id}: ${err.message}`);
      }
    }
    
    let summary = `✅ ${archivedCount} emails de la catégorie ${upperCategory} sur ${result.messages.length} ont été archivés.`;
    
    if (errors.length > 0) {
      summary += `\n\n⚠️ Erreurs rencontrées (${errors.length}):\n`;
      errors.slice(0, 3).forEach(error => {
        summary += `- ${error}\n`;
      });
      if (errors.length > 3) {
        summary += `- ...et ${errors.length - 3} autres erreurs`;
      }
    }
    
    return summary;
  } catch (error) {
    return `❌ Erreur lors de l'archivage des emails de la catégorie : ${error.message}`;
  }
};

// Exporter les fonctions pour les déclencheurs
module.exports = {
  checkEmail,
  emailCategorize,
  emailAction,
  emailArchive,
  emailArchiveAll,
  emailArchiveCategory
};
