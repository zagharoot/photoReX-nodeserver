module.exports = function(app, redisClient){


function validateUpdateModelParams(req)
{
	//TODO: fill this 

	return; 
}
	
	
function updateModel(req, res, next){
	validateUpdateModelParams(req); 
	
}

app.post('/ws/updateModel', updateModel); 

}; 
