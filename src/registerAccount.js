module.exports = function(app, redisClient){

	var keys	= require('./redisKey'); 

function validateRegisterAccountParams(req)
{	
	if (req.hasOwnProperty('body'))
		if (req.body.hasOwnProperty('account'))
			if (req.body.account.hasOwnProperty('accountName'))
			{
				var account = req.body.account; 
				if (account.accountName == 'flickrAccount')
				{
					if (account.hasOwnProperty('accessSecret') && account.hasOwnProperty('accessToken') 
							&& account.hasOwnProperty('username') && account.hasOwnProperty('userid')) 
						return; 
				} //WEBSITE:
				else if (account.accountName == 'fiveHundredPXAccount')
				{
					if (account.hasOwnProperty('accessSecret') && account.hasOwnProperty('accessToken') 
							&& account.hasOwnProperty('userid') && account.hasOwnProperty('userid')) 
						return; 
				}
				else			
					throw require('./serverError').clientError(Error.CL_NO_SUCH_SERVICE);   //no such service 
				
			}
				return; 
	
	var e = require('./serverError').clientError(Error.CL_BAD_ARG); 
	throw e; 
}

	
	
function registerAccount(req, res, next){

	validateRegisterAccountParams(req); 
	
	var account = req.body.account; 
	var accountName = account.accountName; 
	
	
	var multi = redisClient.multi(); 
	
	if (accountName == "flickrAccount")
	{
		console.log('register flickr for user: '+ req.body.userid); 

		var accessSecret = account.accessSecret; 
		var accessToken = account.accessToken; 
		var username =    account.username; 
		var userid = 	account.userid; 
		
		
		
		var key = keys.userFlickr(req.body.userid); // 'user:' + req.body.userid + ':flickr'; 
		
		//make sure whatever we add here, we remove in deregister
		multi.hset(key, 'username', username); 
		multi.hset(key, 'userid', userid); 
		multi.hset(key, 'accessSecret', accessSecret); 
		multi.hset(key, 'accessToken', accessToken); 
	}else if (accountName == 'fiveHundredPXAccount')
	{
		console.log('register 500px for user: '+ req.body.userid); 

		var accessSecret = account.accessSecret; 
		var accessToken = account.accessToken; 
		var userid =    account.userid; 
		var username =  account.username; 
		
		
		
		var key = keys.user500px(req.body.userid); // 'user:' + req.body.userid + ':flickr'; 
		multi.hset(key, 'username', username); 
		multi.hset(key, 'userid', userid); 
		multi.hset(key, 'accessSecret', accessSecret); 
		multi.hset(key, 'accessToken', accessToken); 
	}else		//WEBSITE: 
	{
		//Error: 
	}

	
	
	//now submit the whole transaction: 
	multi.exec(function(err, reply){
		if (redisClient.errorCheck(err, next))
			return; 
		
		res.send('ACK'); 		
	});
	
}

app.post('/ws/registerAccount', registerAccount ); 

}; 

