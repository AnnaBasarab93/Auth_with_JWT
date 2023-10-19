import express from 'express';
import 'dotenv/config';
import userRouter from './rout/user.js';




const app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/api/jwt/', userRouter);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
