const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

var public = path.join(__dirname, 'public');

const app = express();

app.get('/timestamp', (req, res) => {
    res.send(`${Date.now()}`);
});

app.get('/', (req, res) => {
});

app.get('/hi/', (req, res) => {
    res.redirect("/");
});

app.get("/:id", function (req, res) {
    res.sendFile(path.join(__dirname + '/tempindex.html'));
    
});


exports.app = functions.https.onRequest(app);
