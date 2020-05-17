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
const currency = 'INR';
var currRate;
var showCurrency;

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
  var final = url+'&source='+source+'&currencies='+currency;
  http.get(final, function(response){
    response.on('data', function(data){
      var out = JSON.parse(data);
      currRate = out.quotes[source+currency];
    })
  })
})

app.post('/', function(req,res){
  var value = req.body.value;
  if (req.body.currency == 'INR'){
    var ans = value / currRate;
    showCurrency = 'USD';
  }
  else{
    var ans = currRate*value;
    showCurrency = 'INR';
  }
  var output = (Math.round((ans+Number.EPSILON)*100)/100).toLocaleString()
  res.render('output', {output:output, currency:showCurrency});
})



let port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('Server listening');
});
