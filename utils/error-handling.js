class GmailError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = "GmailError";
    this.status = status;
    this.response = response;
  }
}

class GmailValidationError extends GmailError {
  constructor(message, fieldErrors = {}) {
    super(message, 400);
    this.name = "GmailValidationError";
    this.fieldErrors = fieldErrors;
  }
}

// Fonction d'enveloppe pour gérer les erreurs Gmail API
const handleGmailApiRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    // Transformation des erreurs brutes en erreurs structurées
    if (error.response) {
      throw new GmailError(
        error.message || "Erreur de l'API Gmail",
        error.response.status,
        error.response.data
      );
    }
    // Erreurs réseau ou autres
    throw new GmailError(
      "Erreur de connexion à l'API Gmail",
      0,
      error
    );
  }
};

module.exports = {
  GmailError,
  GmailValidationError,
  handleGmailApiRequest
};