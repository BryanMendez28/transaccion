const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Connection', 'keep-alive');
  next();
});

app.set('port', process.env.PORT || 9000);

const dbOptions = {
  host: 'database-1.c2p2huynj5eb.us-east-2.rds.amazonaws.com',
  port: 3306,
  user: 'bryan',
  password: 'develop82',
  database: 'amazon_test',
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbOptions);

// Middleware para agregar el pool de conexiones a la solicitud
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('Welcome to my API');
});
app.use('/api', routes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// server running
app.listen(app.get('port'), () => {
  console.log('Server running on port', app.get('port'));
});
