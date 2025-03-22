const checkEmail = async () => {
  try {
    // Recherche des emails non lus récents
    const result = await search_emails({
      query: "is:unread newer_than:1d",
      maxResults: 20
    });
    
    if (!result.messages || result.messages.length === 0) {
      return "📭 Aucun email non lu récent trouvé.";
    }
    
    // Utiliser les données de la recherche directement au lieu de lire chaque email
    // La recherche contient déjà des informations de base comme l'expéditeur, l'objet et un extrait
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
      summary += `- **Email ${i+1}**: ${email.snippet || 'Pas d\'aperçu disponible'}\n`;
    }
    
    if (emailCount > 10) {
      summary += `\n...et ${emailCount - 10} autres emails\n`;
    }
    
    summary += "\n💡 **Actions suggérées:**\n";
    summary += "- Utilisez `email_search [terme]` pour rechercher des emails spécifiques\n";
    summary += "- Utilisez `email_categorize` pour une catégorisation par sujets\n";
    summary += "- Utilisez `read_email [ID]` pour lire un email spécifique\n";
    
    return summary;
  } catch (error) {
    return `❌ Erreur lors de l'analyse des emails : ${error.message}`;
  }
};

// Version simplifiée de la catégorisation qui n'accède pas au contenu complet des emails
const emailCategorize = async () => {
  try {
    // Recherche des emails non lus récents
    const result = await search_emails({
      query: "is:unread newer_than:3d",
      maxResults: 30
    });
    
    if (!result.messages || result.messages.length === 0) {
      return "📭 Aucun email récent trouvé à catégoriser.";
    }
    
    // Catégories simplifiées basées sur des mots-clés dans le snippet
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
          summary += `  ${index + 1}. ${email.snippet ? email.snippet.substring(0, 70) + '...' : 'Pas d\'aperçu disponible'}\n`;
        });
        if (emails.length > 3) {
          summary += `  ...et ${emails.length - 3} autres\n`;
        }
        summary += "\n";
      }
    }
    
    return summary;
  } catch (error) {
    return `❌ Erreur lors de la catégorisation des emails : ${error.message}`;
  }
};

// Fonction pour les emails d'action (emails qui nécessitent une action)
const emailAction = async () => {
  try {
    // Recherche des emails non lus récents qui pourraient nécessiter une action
    const result = await search_emails({
      query: "is:unread (urgent OR important OR action OR required OR deadline OR confirmation OR review OR approve)",
      maxResults: 15
    });
    
    if (!result.messages || result.messages.length === 0) {
      return "✅ Aucun email nécessitant une action urgente n'a été trouvé.";
    }
    
    // Générer un résumé des actions requises
    let summary = "🚨 **EMAILS NÉCESSITANT UNE ACTION**\n\n";
    
    result.messages.forEach((email, index) => {
      summary += `${index + 1}. **Action requise**: ${email.snippet ? email.snippet.substring(0, 100) + '...' : 'Pas d\'aperçu disponible'}\n\n`;
    });
    
    summary += "\n💡 **Actions suggérées:**\n";
    summary += "- Utilisez `read_email [ID]` pour lire un email spécifique\n";
    summary += "- Utilisez `email_draft` pour préparer des réponses\n";
    
    return summary;
  } catch (error) {
    return `❌ Erreur lors de l'analyse des actions requises : ${error.message}`;
  }
};

// Exporter les fonctions pour les déclencheurs
module.exports = {
  checkEmail,
  emailCategorize,
  emailAction
};
