var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
const MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.render('form');
});

app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.post('/', function (req, res) {
    var company = req.body.requested;
    var choice = req.body.type;

    const db_url = "mongodb+srv://clarkbolin:U2IvoMjXIUSo1WVq@cluster0.thojgej.mongodb.net/?retryWrites=true&w=majority";

    MongoClient.connect(db_url, { useUnifiedTopology: true }, async function (err, db) {
        if (err) {
            console.log("Connection err: " + err); return;
        }

        var dbo = db.db("hw14");
        var collection = dbo.collection('equities');
        if (choice == "name") {
            theQuery = { name: company };
        }
        else {
            theQuery = { ticker: company };
        }

        await collection.find(theQuery).toArray(function (err, result) {
            if (err) console.log(err);
            return processForm(req, res, result);
        });
        setTimeout(() => { db.close() }, 100);
    });
});

function processForm(req, res, arr) {
    res.setHeader('Content-Type', 'text/html');
    if (arr.length == 0) {
        res.write("No results in the database match the query.");
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            res.write("</p>Company: " + arr[i].name + "</br>Ticker: " + arr[i].ticker + "</p>");
        }
    }
};

app.listen(port);
