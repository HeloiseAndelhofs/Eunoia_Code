const jwt = require('jsonwebtoken');

// Middleware pour la vérification du JWT
const jwtVerification = (req, res, next) => {

    // Récupération de la clé secrète du JWT à partir des variables d'environnement
    const secret = process.env.JWT_SECRET;

    // Récupération des en-têtes d'autorisation de la requête
    const authHeaders = req.headers['authorization'];

    // Extraction du token de l'en-tête d'autorisation (le format est généralement "Bearer [token]")
    const token = authHeaders && authHeaders.split(' ')[1]

    // Si le token n'existe pas, passer au middleware suivant
    if (!token) {
        next()
    } else {
        // Vérification du token avec la clé secrète
        jwt.verify(token, secret, (error, payload) => {
            // Si une erreur survient lors de la vérification et que ce n'est pas une erreur d'expiration du token
            if (error && error.name !== "TokenExpiredToken") {
                // Répondre avec un statut 401 (Non autorisé)
                return res.sendStatus(401)
            // Si l'erreur est due à l'expiration du token
            } else if (error && error.name == "TokenExpiredToken") {
                // Répondre avec un statut 403 (Interdit) et un message d'erreur
                return res.status(403).json({ message: "Le token a expiré, veuillez vous reconnecter." })
            } else {
                // Si le token est valide, ajouter les données du payload à la requête
                req.payload = payload;
                // Passer au middleware suivant
                next()
            }
        })
    }
};

module.exports = jwtVerification