const sql = require('mssql')
const sqlConfig = require('../database')

utilityFuncService = {

    tokenStatus : async (username) => {
        try {
            await sql.connect(sqlConfig)

            const checkStatusReq = new sql.Request()
            const checkStatus = await checkStatusReq
                                    .input('username', sql.NVarChar, username)
                                .query('SELECT * FROM users WHERE username = @username')

            
                                console.log(`Requête SQL exécutée : SELECT * FROM users WHERE username = ${username}`);
                                console.log(`Résultat de la requête : `, checkStatus.recordset);
                                console.log(checkStatus.recordset);
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
            await sql.connect(sqlConfig)

// console.log( 'update token : ' + updateTokenStatus);

            const updateStatusReq = new sql.Request()
            const updateStatus = await updateStatusReq
                                    .input('updateTokenStatus', sql.Bit, updateTokenStatus)
                                    .input('username', sql.NVarChar, username)
                                .query('UPDATE users SET tokenAccepted = @updateTokenStatus WHERE username = @username')

            const selectStatusReq = new sql.Request()
            const selectStatus = await selectStatusReq
                                    .input('username', sql.NVarChar, username)
                                    .query('SELECT * FROM users WHERE username = @username')

            if (selectStatus.recordset.length > 0) {
                // console.log('update status service : ' + selectStatus.recordset[0].tokenAccepted);
                return selectStatus.recordset[0].tokenAccepted
            }

            throw new Error('Problème pendant l\'update du status du token')
        } catch (error) {
            throw new Error(error)
        }

    },

    checkUserByUsernameAndPassword : async (username, password) => {
        try {
            await sql.connect(sqlConfig)

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
    },
    selectUserById : async (userId) => {
        try {
            
            await sql.connect(sqlConfig)

            const selectUserReq = new sql.Request()
            const selectUser = await selectUserReq
                                .input('userId', sql.Int, userId)
                                .query('SELECT * FROM users WHERE user_id = @userId')

            if (selectUser.recordset.length > 0) {
                return selectUser.recordset[0]
            }

                throw new Error('[LOGIN ==> UTILITY FUNC SERVICE ==> SELECT USER BY ID] : Aucun utilisateur trouvé')

        } catch (error) {
            console.error(error);
            throw new Error

        }
    }
}

module.exports = utilityFuncService