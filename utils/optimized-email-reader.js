const { handleGmailApiRequest } = require('./error-handling');

// Cache pour éviter de relire les mêmes emails
const emailCache = new Map();

const getEmailById = async (messageId, forceRefresh = false) => {
  // Vérifier le cache sauf si forceRefresh est activé
  if (!forceRefresh && emailCache.has(messageId)) {
    return emailCache.get(messageId);
  }
  
  // Obtenir l'email via l'API Gmail avec gestion d'erreur
  const email = await handleGmailApiRequest(async () => {
    return await read_email({ messageId });
  });
  
  // Mettre en cache avec expiration de 5 minutes
  emailCache.set(messageId, email);
  setTimeout(() => emailCache.delete(messageId), 5 * 60 * 1000);
  
  return email;
};

// Version optimisée pour traiter plusieurs emails
const batchGetEmails = async (messageIds) => {
  // Diviser en emails en cache et emails à récupérer
  const cachedEmails = [];
  const emailsToFetch = [];
  
  messageIds.forEach(id => {
    if (emailCache.has(id)) {
      cachedEmails.push(emailCache.get(id));
    } else {
      emailsToFetch.push(id);
    }
  });
  
  // Charger les emails manquants en parallèle avec limitation
  const fetchedEmails = await Promise.all(
    emailsToFetch.map(id => getEmailById(id))
  );
  
  // Combiner et renvoyer
  return [...cachedEmails, ...fetchedEmails];
};

module.exports = {
  getEmailById,
  batchGetEmails
};