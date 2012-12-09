module.exports = function(app, redisClient){

var keys	= require('./redisKey'); 

/*
 * This service is mostly for development use (not for production). It clears all the visited and cache for a particular user 
 */

function validateClearHistoryParams(req)
{	
	//at this point, there's no more argument to check because user is already validated as part of the authentication
}

function clearHistory(req, res, next){
	console.log('clearing history for user ' + req.body.userid); 
	
	validateClearHistoryParams(req); 
		
	var multi = redisClient.multi(); 
	
	//clear the recommendation queue for this user
	var key = keys.userQueue(req.body.userid); 
	multi.del(key); 
	key = keys.userVisited(req.body.userid); 
	multi.del(key); 
	
	multi.exec( function(err, reply){
			if (err)
				return; 
			
			res.send('ACK'); 
	});
}


app.post('/ws/clearHistory', clearHistory); 

}; 