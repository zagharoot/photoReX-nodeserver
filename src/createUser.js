
module.exports = function(app, redisClient){

	
function validateCreateUserParams(req)
{
	if (req.hasOwnProperty('body'))
		if (req.body.hasOwnProperty('secret'))
			if (req.body.secret.length < 100)
				return; 
	
	var e = require('./serverError').clientError(Error.CL_BAD_INPUT_ARG); 
	throw e; 
}




function createUser(req, res, next){
		
	validateCreateUserParams(req); 
	
	var secret = req.body.secret; 
	var userid = undefined; 
	
//	console.log("secret received: " + req.body.secret); 

	redisClient.incr("counter:user.id", function(err, reply){

		//if error happens, next is called and we return here 
		if (redisClient.errorCheck(err, next))
			return; 

				
		var user = {d: {masterAcountID: ''} }; 		
		userid = reply; 

		console.log('create user for secret: ' + secret + ' user:  ' + userid);	
		var multi = redisClient.multi(); 
		multi.sadd("users", userid);
		multi.hset("user:"+userid, "secret", secret);
		
		multi.exec(function(err, reply){
			if (redisClient.errorCheck(err, next))
				return; 

			//here we know everything went trough smoothly!
			user.d.masterAcountID = userid; 
			res.send(user);
		}); 
	}); 
}



app.all('/ws/createUser', createUser );


}; 
