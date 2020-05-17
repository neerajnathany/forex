const express = require("express");
const bodyParser = require('body-parser');
const http = require('http');
const ejs = require('ejs');

app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

const url = 'http://api.currencylayer.com/live?access_key=b22031f591ef1848e3229c6e23c73712';
const source = 'USD';   //Unchageable in the basic api plan

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
})

app.post('/', function(req,res){
  var currency = 'INR';
  var final = url+'&source='+source+'&currencies='+currency;
  var value = req.body.value;
  http.get(final, function(response){
    response.on('data', function(data){
      var out = JSON.parse(data);
      if (req.body.currency == 'INR'){
        var ans = value / out.quotes[source+currency];
        currency = 'USD';
      }
      else{
        var ans = out.quotes[source+currency]*value;
      }
      var output = (Math.round((ans+Number.EPSILON)*100)/100).toLocaleString()
      //res.render("That's approximately "+ output + ' ' + currency);
      res.render('output', {output:output, currency:currency});
    })
  })
})

let port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('Server listening');
});
