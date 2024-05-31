const sql = require('mssql')
const sqlConfig = require('../database')

utilityFuncService = {

    tokenStatus : async (username) => {
        try {
            sql.connect(sqlConfig)

            const checkStatusReq = new sql.Request()
            const checkStatus = await checkStatusReq
                                    .input('username', sql.NVarChar, username)
                                .query('SELECT tokenAccepted FROM users WHERE username = @username')

            if (!(checkStatus.recordset.length > 0)) {
                throw new Error('Utilisateur introuvable')
            }

            return checkStatus.recordset[0].tokenAccepted;
            
        } catch (error) {
            throw new Error(error)
        }
    },

    tokenStatusUpdate : async (updateTokenStatus, username) => {

        try {
            sql.connect(sqlConfig)

            const updateStatusReq = new sql.Request()
            const updateStatus = await updateStatusReq
                                    .input('updateTokenStatus', sql.Bit, updateTokenStatus)
                                    .input('username', sql.NVarChar, username)
                                .query('UPDATE users SET tokenAccepted = @updateTokenStatus WHERE username = @username')

            if (updateStatus.rowsAffected > 0) {
                return updateStatus
            }

            throw new Error('Problème pendant l\'update du status du token')
        } catch (error) {
            throw new Error(error)
        }

    },

    checkUserByUsernameAndPassword : async (username, password) => {
        try {
            const checkUserReq = new sql.Request();
            const checkUser = await checkUserReq
                .input('username', sql.NVarChar, username)
                .query('SELECT username, email, password, description, avatar_url, created_at FROM users WHERE username = @username');
        
            if (checkUser.recordset.length > 0) {
                const user = checkUser.recordset[0];
                const passwordOK = await bcrypt.compare(password, user.password);
                if (passwordOK) {
                    return user;
                } else {
                    throw new Error('Mot de passe incorrect');
                }
            }  
            
        } catch (error) {
            
            throw new Error(`Aucun utilisateur n'a été trouvé.`);
        }
    }
}

module.exports = utilityFuncService