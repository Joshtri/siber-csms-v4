/* eslint-disable no-undef */
import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import session from 'express-session';

import flash from 'connect-flash';
import path from 'path';
// import RedisStore from 'connect-redis';
import MongoStore from 'connect-mongo';

import 'dotenv/config';
const app = express();
const PORT = process.env.PORT;

import mainRoute from './routes/main.route.js';
import dashboardRoute from './routes/dashboard.route.js';
import hseplanRoute from './routes/hseplan.route.js';
import psbRoute from './routes/psb.route.js';
import paRoute from './routes/pa.route.js';
import pbRoute  from './routes/pb.route.js';

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
// (async () => { await client.connect(); })();
// Express Session
app.use(
    session({
      proxy: true,
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      name: 'siber-csms',
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, // Replace with your MongoDB connection string
        collectionName: 'sessions'
      })
    
      
    })
);

// Initialize connect-flash
app.use(flash());
connectDB();

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// Apply delay to all routes for testing purposes
// app.use(async (req, res, next) => {
//     await delay(); // Delay of 5 seconds
//     next();
// });

app.use('/', mainRoute, dashboardRoute);
app.use('/data', hseplanRoute, psbRoute,paRoute,pbRoute);



// Tentukan lokasi folder views
const viewsDirectories = [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views', 'data'),
    path.join(__dirname, 'views', 'detail'),
    path.join(__dirname, 'views', 'edit')
];

// Tangani kesalahan jika rute tidak ditemukan
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.set('views', viewsDirectories);



app.listen(PORT,()=>{
    console.log('server running on port ' + PORT);
});

