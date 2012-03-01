
module.exports = function(app, redisClient){

var MIN_QUEUE_LENGTH = 3; 				//number of required recommendation pages in the queue


function validateRecommendParams(req)
{	
	//right now, there's nothing to validate (userid is already validated as part of authentication)
	//at this point, howMany is not used in the rec generation. or is it? 
	
	
	return; 
	
//	var e = require('./serverError').ErrorWithNumber(10); 
//	throw e; 
}


function recommend(req, res, next){

	validateRecommendParams(req); 
	
	console.log('recommend for user: ' + req.body.userid); 
	redisClient.incr('counter:page.requests'); 		//total number of recommendations (doesn't need to be synced with other commands)
	
	var qkey = 'user:' + req.body.userid + ':queue'; 

	//read a blocking from the queue 
	redisClient.blpop(qkey, 10, function (err, reply){
		if (redisClient.errorCheck(err, next))
			return; 
		
			res.send(reply); 
	});
	
	
	//we quickly get to here, no matter if queue is empty or not. we can ask for more recommendations in parallel
	redisClient.llen(qkey, function(err, reply){
		if (redisClient.errorCheck(err, next))
			return; 

		var len = parseInt(reply); 
		
		if (len< MIN_QUEUE_LENGTH)		//add a recommendation request to the queue of recommendations 
		{
			redisClient.rpush('users:recommend:queue', '' + req.body.userid + ':' + (MIN_QUEUE_LENGTH-len)); 
		}		
	}); 
}


app.all('/ws/recommend', recommend); 


}; 