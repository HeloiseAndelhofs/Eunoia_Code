const sql = require('mssql');
const sqlConfig = require('../database')

const userService = {

    getUserByUsername : async (username) => {
        try {

            await sql.connect(sqlConfig);
            const request = new sql.Request()
            request.input('username', sql.NVarChar, username)

            const result = await request.query('SELECT * FROM users WHERE username = @username');
            if (result.recordset.length > 0) {
                return result.recordset[0]
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            throw new Error(error)
        }
    }

}

module.exports = userService