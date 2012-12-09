module.exports = function(app, redisClient){

var keys	= require('./redisKey'); 

function validateSetEnabledAccountParams(req)
{	
	if (req.hasOwnProperty('body'))
	{
		if (! req.body.hasOwnProperty('enabled'))
		{
			throw require('./serverError').clientError(Error.CL_BAD_INPUT_ARG); 
		}
		
		if (req.body.hasOwnProperty('account'))
			{
				var accountName = req.body.account; 
				if (accountName == 'flickrAccount' ) //WEBSITE: 
					return;
				else if (accountName == 'fiveHundredPXAccount')		
					return; 
				else			
					throw require('./serverError').clientError(Error.CL_NO_SUCH_SERVICE);   //no such service 
			}
	}
	var e = require('./serverError').clientError(Error.CL_BAD_INPUT_ARG); 	//bad parameters 
	throw e; 
}

function setEnabledAccount(req, res, next){
	validateSetEnabledAccountParams(req); 
		
	var account = req.body.account; 
	var enabled = req.body.enabled; 

	
	//clear the recommendation queue for this user as the content might not be uptodate 
	//TODO: should we add a recommend command so we put some pics back into it? 
	key = keys.userQueue(req.body.userid); 
	redisClient.del(key, function(err, reply){
		
		if (redisClient.errorCheck(err, next))
			return; 
	}); 
	
	
	
	key = keys.userServicesEnabled(req.body.userid); 

	if (enabled)
	{
		redisClient.rpush(key, account, function(err, reply){
			
			//if error happens, next is called and we return here
			if (redisClient.errorCheck(err, next))
				return; 

			res.send('ACK');
			return; 			
		});
	}else{		
		redisClient.lrem(key, 0, account, function(err, reply){ 	

			//if error happens, next is called and we return here 
			if (redisClient.errorCheck(err, next))
				return; 
			
			res.send('ACK'); 
			return; 
		}); 		
	}
	
	
	
}
app.post('/ws/setEnabledAccount', setEnabledAccount); 

}; 