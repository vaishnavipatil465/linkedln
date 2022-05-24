const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // to use ENV_VARIABLE
const path = require('path');


// set up our express app
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser')
// connect to mongodb
mongoose.connect(
    'mongodb://localhost:27017/linkedinPost',
    { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log("Connection Error!\n" + err);
    });
mongoose.Promise = global.Promise;
dotenv.config();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: '*'
}));// initialize routes

// app.use(express.static(__dirname + '/../dist/post'));
// // Send all requests to index.html
// app.use('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '/../src', 'index.html'));
// });
app.use('/post', require('./router/posts.route'));
app.use('/post', require('./router/comments.route'));

app.use(express.static(__dirname + '/../dist/linkldn'));

app.use('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/../src', 'index.html'));
});


module.exports = app;
