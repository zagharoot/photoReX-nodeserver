
module.exports = function(app, redisClient){

var MIN_QUEUE_LENGTH = 3; 				//number of required recommendation pages in the queue

function recommend(req, res, next){
	redisClient.inc('counter:page.requests'); 		//total number of recommendations 
	
	var qkey = 'user:' + req.body.userid + ':queue'; 
	
	redisClient.llen(qkey, function(err, reply){

		var len = parseInt(reply); 
		
		if (len< MIN_QUEUE_LENGTH)
		{
			redisClient.publish('recommend', ''+ (MIN_QUEUE_LENGTH-len)); 
		}
		
		//read a blocking from the queue 
		redisClient.blpop('key', 10, function (err, reply){
			//reply has the id of the page. retrieve the images 
			
			if (err)
				throw new Error('could not get a recommendation'); 
			
			var page = parseInt(reply); 
			var pageKey = 'user:' + req.body.userid + ':page:' + page + ':desc'; 
			
			redisClient.get(pageKey, function(err, reply){
				//reply has the json representation of the page. can be returned as is. 

				if (err)
					throw new Error('could not get a recommendation') ;
				res.send(reply); 
			}); 
			
		}); 
	}); 
}


app.get('/rlimage/imagerecommendationservice.asmx/recommend', recommend); 


}; 