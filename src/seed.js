const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // we need to connect to default in order to make a new one
  password: '123',
  port: 5432
});

client.connect();

client.query('CREATE DATABASE ethereum_monitor;', (err, res) => {
  if (err) {
    console.error('Could not create database', err);
  } else {
    console.log('Database created');
  }
  client.end();
});
