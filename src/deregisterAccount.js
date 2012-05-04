module.exports = function(app, redisClient){

	var keys	= require('./redisKey'); 

function validateDeregisterAccountParams(req)
{	
	if (req.hasOwnProperty('body'))
		if (req.body.hasOwnProperty('account'))
			if (req.body.account.hasOwnProperty('accountName'))
			{
				var accountName = req.body.account.accountName; 
				if (accountName == 'flickrAccount' ) //WEBSITE: 
					return;
				else if (accountName == 'fiveHundredPXAccount')		//TODO: maybe do some kind of hand shake? 
					return; 
				else			
					throw require('./serverError').clientError(Error.CL_NO_SUCH_SERVICE);   //no such service 
			}
	
	var e = require('./serverError').clientError(Error.CL_BAD_INPUT_ARG); 	//bad parameters 
	throw e; 
}

function deregisterAccount(req, res, next){
	validateDeregisterAccountParams(req); 
		
	var account = req.body.account; 
	var accountName = account.accountName; 
	
	if (accountName == "flickrAccount")
	{
		console.log('deregister flickr account for user ' + req.body.userid); 
				
		redisClient.del(keys.userFlickr(req.body.userid), function(err, reply){
			
			//if error happens, next is called and we return here 
			if (redisClient.errorCheck(err, next))
				return; 
			
			res.send('ACK'); 
			return; 
		}); 		
	} //WEBSITE: add  others here 
	else if (accountName = 'fiveHundredPXAccount')
	{
		console.log('deregister 500px account for user ' + req.body.userid); 
		
		redisClient.del(keys.user500px(req.body.userid), function(err, reply){
			
			//if error happens, next is called and we return here 
			if (redisClient.errorCheck(err, next))
				return; 
			
			res.send('ACK'); 
			return; 
		}); 		
		
	}
}

app.post('/ws/deregisterAccount', deregisterAccount); 

}; 