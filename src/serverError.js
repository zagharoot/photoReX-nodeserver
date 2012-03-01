

function clientError(number)
{
	var e = new Error(); 
	
	e.internal = false; 
	
	if (number === undefined)
		number = -1; 
	
	
	e.errno = number; 


	//TODO: a switch case to populate details about the error
	e.reason = 'you bad caller!!!'; 

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

	return e; 
}


exports.clientError =  clientError; 
exports.internalError = internalError; 
