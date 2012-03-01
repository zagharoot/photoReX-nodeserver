module.exports = function(app, redisClient){


function validateDeregisterAccountParams(req)
{	
	if (req.hasOwnProperty('body'))
		if (req.body.hasOwnProperty('account'))
			if (req.body.account.hasOwnProperty('accountName'))
			{
				var accountName = req.body.account.accountName; 
				if (accountName == 'flickrAccount' ) //WEBSITE: 
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
		
		var key = 'user:' + req.body.userid + ':flickr'; 
		
		redisClient.hdel(key, 'username', 'accessSecret', 'accessToken', function(err, reply){
			
			//if error happens, next is called and we return here 
			if (redisClient.errorCheck(err, next))
				return; 
			
			res.send('ACK'); 
			return; 
		}); 		
	} //WEBSITE: add  others here 
}

app.post('/ws/deregisterAccount', deregisterAccount); 

}; 