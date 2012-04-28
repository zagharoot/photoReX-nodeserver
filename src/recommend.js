
module.exports = function(app, redisClient){

var MIN_QUEUE_LENGTH = 3; 				//number of required recommendation pages in the queue

var keys	= require('./redisKey'); 

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
	redisClient.incr(keys.counterPageRequests()); 		//total number of recommendations (doesn't need to be synced with other commands)
	
	var qkey = keys.userQueue(req.body.userid); // 'user:' + req.body.userid + ':queue'; 

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
//			console.log(reply[1]); 
			var recom = JSON.parse(reply[1]); 
			
			//we need to add viewed property to the objects 
			var userViewedKey = keys.userViewed(req.body.userid); 
			var multi = redisClient.multi(); 
			for(var i=0; i< recom.pics.length; i++)
			{
				multi.zscore(userViewedKey, recom.pics[i].picture.hash); 
			}

			multi.exec(function(err, replies){
				
				//in case of error, we can still send recom (we were unable to augment data)
				if (err || replies == null || replies.length < recom.pics.length)
					res.send(reply[1]); 
				
				
				for (var j=0; j< replies.length; j++)
				{
//					console.log(recom.pics[j].picture.hash + " : " + replies[j]); 
					if (replies[j] != null) 
						recom.pics[j].picture.isViewed = true; 
					else
						recom.pics[j].picture.isViewed = false; 
				}

				res.send(JSON.stringify(recom)); 
			});
			
			
			//save the current visit in redis (if we don't here, it's not saved in redis!) 
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
			redisClient.rpush(keys.usersRecommendQueue(), '' + req.body.userid + ':' + (MIN_QUEUE_LENGTH-len+3)); 
		}		
	}); 
}


app.all('/ws/recommend', recommend); 

}; 