const { DB_USER, DB_PSW, DB_NAME, DB_SERVER } = process.env;

const sqlConfig = {
    user: DB_USER,
    password: DB_PSW,
    database: DB_NAME,
    server: DB_SERVER, 
    pool: { 
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 300000  
    },
    options: {
        trustServerCertificate: true
    } 
};

module.exports = sqlConfig