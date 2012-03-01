module.exports = function(app, redisClient){

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
							&& account.hasOwnProperty('username')) 
						return; 
				} //WEBSITE:
				else			
					throw require('./serverError').clientError(11);   //no such service 
				
			}
				return; 
	
	var e = require('./serverError').clientError(10); 
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
		
		
		
		var key = 'user:' + req.body.userid + ':flickr'; 
		multi.hset(key, 'username', username); 
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

