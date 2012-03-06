
module.exports = function(app, redisClient){

var MIN_QUEUE_LENGTH = 3; 				//number of required recommendation pages in the queue


function validateRecommendParams(req)
{	
	//right now, there's nothing to validate (userid is already validated as part of authentication)
	//at this point, howMany is not used in the rec generation. or is it? 
	
	
	return; 
	
//	var e = require('./serverError').clientError(Error.CL_BAD_ARG); 
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

		if (!reply)
		{
			var e = require('./serverError').internalError(Error.IN_RECOMMENDATION_TIMEOUT); 
			next(e); 
		}else
		{
			res.send(reply[1]); 
			
			//save the current visit in redis (if we don't here, it's not saved in redis!) 
			var recom = JSON.parse(reply[1]);
			if (recom.hasOwnProperty('pageid'))
			{
				var val = "" + recom.pageid + ":" + new Date().getTime();
				redisClient.rpush(keys.userPages(req.body.userid), val); 
			}
		}
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