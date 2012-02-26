module.exports = function(app, redisClient){


function validateRegisterAccountParams(req)
{
	//TODO: fill this 
	return true; 
}
	
	
function registerAccount(req, res, next){

	var account = req.body.account; 
	var accountName = account.accountName; 
	
	if (accountName == "flickrAccount")
	{
		console.log('its a flickr account'); 

		var accessSecret = account.accessSecret; 
		var accessToken = account.accessToken; 
		var username =    account.username; 
		
		
		var key = 'user:' + req.body.userid + ':flickr'; 
		redisClient.hset(key, 'username', username); 
		redisClient.hset(key, 'accessSecret', accessSecret); 
		redisClient.hset(key, 'accessToken', accessToken); 
		res.send('ACK'); 
		return; 
	}else		//WEBSITE: 
	{
		//Error: 
	}
	
	console.log('accountname is: ' + accountName); 
	res.send(accountName); 
	
}

app.post('/ws/registerAccount', registerAccount ); 

}; 

