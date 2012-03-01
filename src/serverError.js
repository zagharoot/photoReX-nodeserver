

function clientError(number)
{
	var e = new Error(); 
	
	e.internal = false; 
	
	if (number === undefined)
		number = -1; 
	
	
	e.errno = number; 

	if (number == parseInt(Error.CL_BAD_INPUT_ARG))
		e.reason = 'The required parameters to the api method was not provided!'; 
	else if (number == parseInt(Error.CL_NO_SUCH_SERVICE))
		e.reason = 'There is no support for the requested photo service'; 
	else
		e.reason = ''; 
	
	return e; 
}


function internalError(number, details) 
{
	var e = new Error(); 
	e.internal = true; 
	
	if (number == undefined)
		number = -1; 

	e.errno = number; 
	e.details = details; 

	if (number == parseInt(Error.IN_REDIS_ERROR))
		e.reason = 'An error related to REDIS happened!'; 
	else if (number == parseInt(Error.IN_RECOMMENDATION_TIMEOUT))
		e.reason = 'The recommendation queue was empty after waiting for many seconds!'; 
	else
		e.reason = ''; 
	
	
	return e; 
}


exports.clientError =  clientError; 
exports.internalError = internalError; 
