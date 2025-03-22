const { GmailValidationError } = require('./error-handling');

const validateEmailData = (emailData) => {
  const errors = {};
  
  // Validation des destinataires
  if (!emailData.to || !Array.isArray(emailData.to) || emailData.to.length === 0) {
    errors.to = "Au moins un destinataire est requis";
  } else {
    // Vérifier format email
    const invalidEmails = emailData.to.filter(email => !isValidEmail(email));
    if (invalidEmails.length > 0) {
       errors.to = `Emails invalides: ${invalidEmails.join(', ')}`;
    }
  }
  
  // Validation du sujet
  if (!emailData.subject || emailData.subject.trim() === '') {
    errors.subject = "Le sujet est requis";
  }
  
  // Validation du corps
  if (!emailData.body || emailData.body.trim() === '') {
    errors.body = "Le corps du message est requis";
  }
  
  // Si des erreurs sont trouvées, lever une exception
  if (Object.keys(errors).length > 0) {
    throw new GmailValidationError("Données d'email invalides", errors);
  }
  
  return true;
};

// Fonction utilitaire pour valider l'email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateEmailData,
  isValidEmail
};