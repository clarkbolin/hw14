var fs = require('fs');
var readline = require('readline');
const mongoose = require('mongoose');

function main() {

    mongoose.connect("mongodb+srv://clarkbolin:U2IvoMjXIUSo1WVq@cluster0.thojgej.mongodb.net/hw14").
        catch(error => handleError(error));

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connection Successful!");
    });

    var companyArr = [];

    var myFile = readline.createInterface({
        input: fs.createReadStream('companies.csv')
    });
    myFile.on('line', function (line) {
        let data = line.split(',');
        companyArr.push({
                name: data[0],
                ticker: data[1]
        });
    });
    myFile.on('close', function () {
        companyArr.shift();
    
        var collection = db.collection('equities');
        collection.insertMany(companyArr, (err, res) => {
          if (err) throw err;
          db.close();
        });
        console.log('Full success!');
      });
    }

main();
