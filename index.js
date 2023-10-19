import express from 'express';
import 'dotenv/config';
import userRouter from './rout/users.js';
import client from './db/client.js';




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/jwt/', userRouter);


const port = process.env.PORT || 8080;

client.on('connected', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})

