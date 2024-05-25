/* eslint-disable no-undef */
import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import redis from 'redis';
import RedisStore from 'connect-redis';

import 'dotenv/config';
const app = express();
const PORT = process.env.PORT;

import mainRoute from './routes/main.route.js';
import dashboardRoute from './routes/dashboard.route.js';

import connectDB from './config/configDb.js';

// import mainRoute from './routes/main.route.js';
// import customerRoute from './routes/customer.route.js';
// import transactionRoute from './routes/transaction.route.js';

// const client = redis.createClient({
//   password: process.env.REDIS_PASS,
//   socket: { 
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   }
// });
// (async () => { await client.connect(); })()
// Express Session
app.use(
    session({
      proxy: true,
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      name: 'siber-csms',
    //   store: new RedisStore({ 
    //     client: client,
    //     // ttl: 3600, // waktu kadaluwarsa dalam detik (misalnya 1 jam)
      
      
    //   }),
    
      
    })
);


connectDB();
// Gunakan middleware untuk membaca JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//atur view engine menggunakan ejs.
app.set('view engine', 'ejs');

// Gunakan middleware untuk menyajikan file statis dari folder 'public'
// eslint-disable-next-line no-undef
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/', mainRoute, dashboardRoute);
// Tentukan lokasi folder views
app.set('views', path.join(__dirname, 'views'));



app.listen(PORT,()=>{
    console.log('server running on port ' + PORT);
});

