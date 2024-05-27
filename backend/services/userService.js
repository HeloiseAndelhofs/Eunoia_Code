const sql = require('mssql');
const sqlConfig = require('../database');

const userService = {

    getUserByUsername: async (username) => {
        try {
            await sql.connect(sqlConfig);
            const request = new sql.Request();

            // Utilisation de '=' pour une correspondance exacte
            const result = await request
                .input('username', sql.NVarChar, username)
                .query('SELECT username, description FROM users WHERE username = @username');

            if (result.recordset.length > 0) {
                return result.recordset[0]; // Retourner l'utilisateur s'il est trouvé
            } else {
                return null; // Retourner null si l'utilisateur n'est pas trouvé
            }
        } catch (error) {
            console.error("[getUserByUsername] Erreur lors de la recherche de l'utilisateur : ", error.message);
            throw error;
        }
    }
};

module.exports = userService;
