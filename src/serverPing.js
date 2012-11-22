
module.exports = function(app, redisClient){

	
function serverPing(req, res, next)
{
	res.send('server is working properly\n'); 
}
	

app.all('/ws/serverPing', serverPing );


}; 
