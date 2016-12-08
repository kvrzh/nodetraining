//sendHttpError.js
module.exports = function(req,res,next){
	res.sendHttpError = function(error){
		res.status(error.status);
		var error = {
			message:error.message,
			status:error.status
		}
		console.log(error);
		if(res.req.headers['x-requested-with'] == 'XMLHttpRequest'){
			res.json(error);
		}else{
			res.render('error',{error:error});
		}
	}
	next();
}