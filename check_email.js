ivés.`;
    
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