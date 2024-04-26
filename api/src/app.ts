import express, { Express } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors, { CorsOptions }  from 'cors';

const app: Express = express();
const PORT: number = 3000;

const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
