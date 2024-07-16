const mongoose = require('mongoose');
const express = require('express');
const connectdb = require('./config/connectdb');
const routes = require('./routes/routes');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'https://www.rubbbur.xyz, https://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    optionsSuccessStatus: 204,
  };
  
  // Apply CORS Middleware Globally
app.use(cors(corsOptions));


connectdb();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/',routes);

app.listen(PORT, ()=>{
    console.log('app running on port: ',PORT);
});