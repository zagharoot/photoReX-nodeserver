

var express = require('express');
var redis   = require('redis'); 
var fs 		= require('fs'); 

var app = express.createServer();
var redisClient = redis.createClient(); 


// add custom error codes to the Error class: CL errors are the ones sent to the client, IN are the internal ones 
Error.CL_BAD_INPUT_ARG 			= 11; 			//arguments to the call was not correct 
Error.CL_NO_SUCH_SERVICE		= 12; 			//the website service is not supported 

Error.IN_REDIS_ERROR			= 21; 			//error related to redis connection 
Error.IN_RECOMMENDATION_TIMEOUT = 22; 			//the recommendation queue didn't fill in time (timeout happened in blpop)

//------------------------------------------------------------------------------------


//There is a reason we do error handling this way. we can't just throw exception here because the call 
// stack rolls up under redis and therefore app.error is not called, which means can't do clean error checking 
redis.RedisClient.prototype.errorCheck = function (err, next) 
{	
	if (!err)
		return false; //no error 
	
	var e = require('./serverError').internalError(Error.IN_REDIS_ERROR,err); 
	
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


// ------------------------------------Configure LOGGING ----------------------------------------------------
express.logger.token('rawdate', function(req,res){return Math.round((new Date()).getTime() / 1000);});
var logFile = fs.createWriteStream('../server-logs/nodeserver-log.txt', {flags: 'a'}); //use {flags: 'w'} to open in write mode
var logOption = {format: "[:rawdate] :url :status :res[content-length] - :response-time ms", stream: logFile}; 
app.use(express.logger(logOption)); 

//----------------------------------------------------------------------------------------------------------
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
  res.send(404, { error: "There's no such service" });
});


require('./createUser')(app, redisClient); 
require('./registerAccount')(app, redisClient); 
require('./deregisterAccount')(app, redisClient); 
require('./recommend')(app, redisClient); 
require('./updateModel')(app, redisClient); 
require('./utils')(app, redisClient); 
require('./setEnabledAccount')(app, redisClient); 
require('./serverPing')(app, redisClient); 

//Error generation test. I probably need to remove this 
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






