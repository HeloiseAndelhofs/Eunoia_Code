const express = require('express');
const router = require('./routes/router');
const cookieParser = require('cookie-parser');
const http = require('http')
const configureSocketIo = require('./socket')
const cors = require('cors')

const { PORT } = process.env
const app = express();
const server = http.createServer(app);

configureSocketIo(server);

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

app.use(express.json());
app.use(cookieParser())
app.use('/api', router)


server.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});