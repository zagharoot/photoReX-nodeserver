

var express = require('express');
var redis   = require('redis'); 

var app = express.createServer();
var redisClient = redis.createClient(); 


function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

app.use(express.errorHandler({ dump: true, stack: true }));
app.use(express.bodyParser()); 
app.use(app.router);

//this is the function that handles various types of error 
//app.use(function(err, req, res, next){
//  res.send(err.status || 500, { error: err.message });
//});

app.use(function(req, res){
  res.send(404, { error: "Lame, can't find that" });
});


require('./createUser')(app, redisClient); 
require('./registerAccount')(app, redisClient); 
require('./deregisterAccount')(app, redisClient); 
require('./recommend')(app, redisClient); 
require('./updateModel')(app, redisClient); 
require('./utils')(app, redisClient); 


if (!module.parent) {
  app.listen(3000);
  console.log('photoReX server listening on port 3000');
}






