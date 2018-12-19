to = function(promise) {
	return promise
		.then(data => {
			return [null, data];
		}).catch(err =>
			[pe(err)]
		);
};

pe = require('parse-error');

TE = function(err_message, log){ // TE stands for Throw Error
	if(log === true){
		const logger = require('morgan');
		logger.error('Backend throwing error ',err_message);
	}
	throw new Error(err_message);
};

ReE = function(res, err, code){ // Error Web Response
	if(typeof err === 'object' && typeof err.message !== 'undefined'){
		err = err.message;
	}

	if(typeof code !== 'undefined') res.statusCode = code;

	return res.json({success:false, error: err});
};

ReS = function(res, data, code){ // Success Web Response
	let send_data = {success:true};

	if(typeof data === 'object'){
		send_data = Object.assign(data, send_data);//merge the objects
	}

	if(typeof code !== 'undefined') res.statusCode = code;

	return res.json(send_data)
};

// Catch unhandled rejections and throw to console with a full stack
process.on('unhandledRejection', ex => {
    const logger = require('./bootstrap/winston');
	if (Array.isArray(ex) && ex.length === 1)
		ex = ex[0];

	logger.error(`Backend process unhandled Rejection: ${ex.stack}`)
});