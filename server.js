// requirements (like imports)
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

//this is my app
var app = express();

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/quoting_dojo');

var QuoteSchema = new mongoose.Schema({
    quote: {type: String, required: true},
    author: {type: String, required: true}
}, {timestamps: true})
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'


// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// The root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.get('/', function(req, res) {
    res.render('index');
});
  

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({quote: req.body.quote, author: req.body.author});
    quote.save(function(err) {
      if(err) {
        console.log('ERROR MESSAGES');
        for ( key in err.errors) {
            console.log(err.errors[key].message);
        }
        res.redirect('/');
      } else { 
        console.log('successfully added a quote!');
        res.redirect('/quotes');
      }
    })
});

app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, data) {
        if (err) {
            console.log(err);{}
        } else {
            console.log(data);
            res.render('quotes', {all_quotes: data});
        }
    }).sort('-createdAt');
});

// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});
