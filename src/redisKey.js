
function users()
{
	return "users"; 
}

function usersRecommendQueue()
{
	return "users:recommend:queue"; 
}



function user(userid)
{
	return "user:" + userid;  
}

function userServices(userid)
{
	return "user:" + userid + ":services"; 
}

function userFlickr(userid)
{
	return "user:" + userid + ":flickr"; 
}

function userInstagram(userid)
{
	return "user:" + userid + ":instagram"; 	
}

function user500px(userid)
{
	return "user:" + userid + ":500px"; 	
}
//WEBSITE:


function userQueue(userid)
{
	return "user:" + userid + ":queue"; 	
}

function userVisited(userid)
{
	return "user:" + userid + ":visited"; 
}

function userViewed(userid)
{
	return "user:" + userid + ":viewed"; 
}


function userPages(userid)
{
	return "user:" + userid + ":pages"; 
}

function userPagePictures(userid, page)
{
	return "user:" + userid + ":page:" + page + ":pics"; 
}

function pic(pichash)
{
	return "pic:" + pichash; 
}

function picVisitors(pichash)
{
	return "pic:" + pichash + ":visitors";  
	
}

function picViewers(pichash)
{
	return "pic:" + pichash + ":viewers"; 
}

function counterUserPage(userid)
{
	return "counter:user:" + userid + ":page" ; 
}

function counterUserId()
{
	return "counter:user.id"; 
}

function counterPageRequests()
{
	return "counter:page.requests"; 
}

exports.users			= users; 
exports.usersRecommendQueue = usersRecommendQueue; 
exports.user 			= user;
exports.userServices	= userServices; 
exports.userFlickr		= userFlickr; 
exports.userInstagram	= userInstagram;
exports.user500px		= user500px; 
exports.userQueue		= userQueue; 
exports.userVisited		= userVisited; 
exports.userViewed		= userViewed; 
exports.userPages		= userPages; 
exports.userPagePictures= userPagePictures; 
exports.pic  			= pic; 
exports.picVisitors		= picVisitors; 
exports.picViewers		= picViewers; 
exports.counterUserPage = counterUserPage; 
exports.counterUserId 	= counterUserId; 
exports.counterPageRequests = counterPageRequests; 





















