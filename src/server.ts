import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import { client } from './model/postgres';
const app = express();
const port:string | number = process.env.PORT ?? 8888;

client.connect().then(res => console.log('Connected to DB')).catch(err => console.log(err))

app.use(cors())
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))


app.use('/api', require('./router/controller'))

app.listen(port, () => console.log(`server is runnig on port http://localhost:${port}`));

