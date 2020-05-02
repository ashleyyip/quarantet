const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

var public = path.join(__dirname, 'public');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/timestamp', (req, res) => {
    res.send(`${Date.now()}`);
});

app.get('/', (req, res) => {
});

app.get('/hi/', (req, res) => {
    res.redirect("/");
});

app.get("/:roomID", function (req, res) {
    console.log("hello " + req.params.roomID);
    // res.render(path.join(public, 'tempindex.html'));
    res.render(path.join(public, 'tempindex.html'), {title: req.params.roomID});
});


// app.get("/:id", function (req, res) {
//     res.sendFile(path.join(public, 'tempindex.html'));
// });


exports.app = functions.https.onRequest(app);
