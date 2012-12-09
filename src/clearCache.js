module.exports = function(app, redisClient){

var keys	= require('./redisKey'); 

/*
 * This service is mostly for development use (not for production). It clears the recommendation cache we've built for the user 
 */


function validateClearCacheParams(req)
{	
	//at this point, there's no more argument to check because user is already validated as part of the authentication
}

function clearCache(req, res, next){
	validateClearCacheParams(req); 
		
	//clear the recommendation queue for this user as the content might not be uptodate 
	var key = keys.userQueue(req.body.userid); 
	redisClient.del(key, function(err, reply){
		if (redisClient.errorCheck(err, next))
			return; 
		
		res.send('ACK');
		return; 			
	}); 	
}


app.post('/ws/clearCache', clearCache); 

}; 