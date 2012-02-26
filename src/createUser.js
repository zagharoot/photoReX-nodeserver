
module.exports = function(app, redisClient){

	
function validateCreateUserParams(req)
{
	if (! req.body)
		return false; 
	
	if (! req.body.secret)
		return false; 
	
	return true; 
}
	
function createUser(req, res, next){
	
	console.log("secret received: " + req.body.secret); 

	redisClient.incr("counter:user.id", function(err, reply){
		var user = {d: {masterAcountID: ''} }; 
		
		var userid = reply; 
		//TODO: check for errors 
		
		user.d.masterAcountID = userid; 
		res.send(user);
		
		redisClient.sadd("users", userid);
		redisClient.hset("user:"+userid, "secret", req.body.secret, redisClient.print); 
	}); 
}

app.all('/ws/createUser', createUser );


}; 
