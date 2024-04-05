const guidv4Module = require('./gen_guid');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const app = express();
app.use(express.json());

require('dotenv').config();
const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (e) => {
    console.log(e);
})
database.once('connected', () => {
    console.log('Database connected');
})

app.use('', routes)

app.listen(3000, () => {
    console.log(`listening on port 3000`);
});

