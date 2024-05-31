const express = require('express');
const router = require('./routes/router');
const cookieParser = require('cookie-parser');

const {PORT} = process.env
const server = express();

server.use(express.json());
server.use(cookieParser())
server.use('/', router)

server.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});