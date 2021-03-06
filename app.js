// app.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')

const userRouter = require('./routes/user');
const listingRouter = require('./routes/jobListing');

const app = express();

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/listing', listingRouter);

const port = process.env.MONGODB_PORT;

db.once('open', function () {
    console.log('Connected!');
    app.listen(port, () => {
        console.log('Server is up and running on port numner ' + port);
    });
});