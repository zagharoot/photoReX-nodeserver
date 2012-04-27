module.exports = function(app, redisClient){

var keys	= require('./redisKey'); 

function validateUpdateModelParams(req)
{
	//The format of the body should be like this: { userid: '5', collectionID: '4', picHash: 'zzz' }
	console.log(req.body); 

	if (req.hasOwnProperty('body'))
		if (req.body.hasOwnProperty('collectionID') && req.body.hasOwnProperty('picHash'))
				return; 
	
	var e = require('./serverError').clientError(Error.CL_BAD_INPUT_ARG); 
	throw e; 
}
	
function updateModel(req, res, next){
	validateUpdateModelParams(req); 
	
	var uid = req.body.userid; 
	var pichash = req.body.picHash; 
	var pageid = req.body.collectionID; 
	
	var userKey = keys.userViewed(uid); 
	var picKey  = keys.picViewers(pichash); 

//	console.log("userkey: " + userKey + " , userval" + userVal); 
	
	
	//update user and pic viewed
	redisClient.zadd(userKey, pageid, pichash); 
	redisClient.sadd(picKey, uid); 
}

app.post('/ws/updateModel', updateModel); 

}; 
