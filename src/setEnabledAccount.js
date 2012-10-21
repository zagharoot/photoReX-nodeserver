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
	
	
	if (enabled)
		console.log('enabling' + account + ' account for user ' + req.body.userid); 
	else
		console.log('disabling' + account + ' account for user ' + req.body.userid); 
		
		redisClient.lrem(keys.userServicesEnabled(req.body.userid), account, function(err, reply){ 	
//		redisClient.del(keys.userFlickr(req.body.userid), function(err, reply){
			
			//if error happens, next is called and we return here 
			if (redisClient.errorCheck(err, next))
				return; 
			
			res.send('ACK'); 
			return; 
		}); 		
}

app.post('/ws/setEnabledAccount', setEnabledAccount); 

}; 