const express = require('express');
const router = require('./routes/router')

const {PORT} = process.env
const server = express();

server.use('/', router)

server.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});