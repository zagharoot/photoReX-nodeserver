

var express = require('express');
var redis   = require('redis'); 

var app = express.createServer();
var redisClient = redis.createClient(); 


//There is a reason we do error handling this way. we can't just throw exception here because the call 
// stack rolls up under redis and therefore app.error is not called, which means can't do clean error checking 
redis.RedisClient.prototype.errorCheck = function (err, next) 
{	
	if (!err)
		return false; //no error 
	

	var e = require('./serverError').internalError(5,err); 
	
	next(e); 
	return true; 
}; 

redisClient.on('error', function(err)
		{
			console.log('redis error occurred: ' + err); 
		}); 

redisClient.on('end', function(){
}); 


redisClient.on('reconnecting', function(){
}); 


app.use(express.errorHandler({ dump: true, stack: true }));
app.use(express.bodyParser()); 
app.use(app.router);


app.error(function(err, req, res, next){
	if (err !== 0 )
	{
		if (err.hasOwnProperty('errno'))											//client facing error is thrown
			res.send(JSON.stringify(err)); 
		else
		{
			var clientError = new Error(); 
			clientError.errno = 5; 
			clientError.reason = 'some internal error occurred'; 
			clientError.detail = err; 
			res.send(JSON.stringify(clientError)); 
		}
	}
}); 

app.use(function(req, res){
  res.send(404, { error: "Lame, can't find that" });
});


require('./createUser')(app, redisClient); 
require('./registerAccount')(app, redisClient); 
require('./deregisterAccount')(app, redisClient); 
require('./recommend')(app, redisClient); 
require('./updateModel')(app, redisClient); 
require('./utils')(app, redisClient); 


//Error generation test
app.get('/ws/error', function(req, res, next){
	var e = new Error(); 
	e.src = 'me'; 
	e.reason = 'you'; 
	throw e; 
	
	
}); 








if (!module.parent) {
  app.listen(3000);
  console.log('photoReX server listening on port 3000');
}






