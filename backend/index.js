const express = require('express');

const server = express();

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});