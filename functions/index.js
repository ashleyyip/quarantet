const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
// const combineAudio = require('combineAudio')

var public = path.join(__dirname, 'public');

const app = express();
// const bodyParser = require('body-parser'); 
// app.use(bodyParser.json()); 

app.use(express.static(path.join(__dirname, 'public')));

// var dogsArr = [];


// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/timestamp', (req, res) => {
    res.send(`${Date.now()}`);
});

app.get('/', (req, res) => {
});


app.get("/:roomID", function (req, res) {
    console.log("hello " + req.params.roomID);
    res.render(path.join(public, 'room.html'), {title: req.params.roomID});
});

// app.post('/dogs', function(req, res) {
//     var dog = req.body;
//     console.log(dog);
//     dogsArr.push(dog);
//     res.send("Dog added!");
// });


// var port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log("http://localhost:" + port);
// });

exports.app = functions.https.onRequest(app);
