module.exports = function(app, redisClient){


function deregisterAccount(req, res, next){
	var account = req.body.account; 
	var accountName = account.accountName; 
	
	if (accountName == "flickrAccount")
	{
		console.log('deregister flickr account'); 
		
		var key = 'user:' + req.body.userid + ':flickr'; 
		
		redisClient.hdel(key, 'username', 'accessSecret', 'accessToken'); 		
		res.send('ACK'); 
		return; 
	}else		//WEBSITE: 
	{
		//Error: 
	}
	
	console.log('accountname is: ' + accountName); 
	res.send(accountName); 
}

app.post('/ws/deregisterAccount', deregisterAccount); 

}; 