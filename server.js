import  mongoose from "mongoose"

import http from 'http'
import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'

// defintion du dotenv
dotenv.config({path: './config/.env'});

// defintion du cors
const corsOptions = {
  origin : "*",
  methods: ["POST","GET","PUT","DELETE","UPDATE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Headers",
    "Origin"
  ],
  
  credentials: true
}
 const  server = http.Server(app)
// importer des route
import UserRoutes from './routes/userRoutes.js';
import ArticlesRoutes from './routes/artcilesRoutes.js'
// creation de l'app express
const app = express()

// connection a la  db
const connectToMongo = async() => {
  await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  return mongoose;
};

await connectToMongo().then(async() => console.log('connected TO MONGO DataBase'));

// apply des mmiddlewares
app.use(cors(corsOptions))


// implementation de socketIo

//Routage 
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/api/users',UserRoutes)
app.use('/api/articles',ArticlesRoutes)



server.listen(process.env.PORT || 5000,(req, res) => {
  console.log(`server running on port ${process.env.PORT} ` )})