module.exports = function(app, redisClient){

function ping(req, res, next){
	res.send('pong'); 
}

function version(req, res, next){
	//TODO: how to manage versions correctly? 
	res.send('1.0.0'); 		
}

app.get('/ws/ping', ping); 
app.get('/ws/version', version); 

}; 
