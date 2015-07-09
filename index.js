/*	--created by Anmol Shukla on 08/07/2015
	
	Uses a singleton logger approach
	Buffer will be written/posted only when: (1) Buffer is full (2) maxLogsInBuffer has reached its limit  
	TO DO:
		| File output
		| Set batch size for logs written/posted
		| Error handling
	Adv:
		| Total control over logging behavior - custom flush intervals, batch size

*/
var loggerInstance;
var buffer; // buffer contains csv of logs
var useFile           = false;
var currentBufferSize = 0;
var currentLogs       = 0;
var isJson            = true;
var maxBufferSize     = 1024;
var maxLogsInBuffer   = 10;
var minLogsInBuffer   = 1;
var encoding          = 'utf-8';
var flushInterval     = 5000; // milliseconds
var http              = require('http');
var postOptions       = {
	host: '127.0.0.1',
	port: '3333',
	path: '/',
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json',
	  'Connection'  : 'keep-alive'
	},
	keepAlive: true,
	keepAliveMsecs: 10000
}

var log = function log(stuff) {
	console.log("logging stuff: "+stuff);
	stuff = JSON.stringify(stuff);
	var sizeLeft = maxBufferSize-currentBufferSize;
	// do we have any space left?
	if(getSizeInBuffer(stuff) > sizeLeft) {
		// NO! gotta flush
		flush(log, stuff); // pass log as a callback to flush as flush is async
		clear(); // call clear as we didnt pass it as callback
	} else {
		stuff = currentBufferSize==0?stuff: ","+stuff; // we dont need ',' before first log
		currentBufferSize += buffer.write(stuff, currentBufferSize, encoding);
		currentLogs++;
	}
}

var flush = function flush(callback, callbackParam) {
	if(currentLogs < minLogsInBuffer) {
		return; // can't flush now
	}
	var stringifiedBuf = buffer.toString(encoding, 0, currentBufferSize);

	// now create the final dump we want to flush 
	dump = "["+stringifiedBuf+"]";
	var req = http.request(postOptions, function() {
		console.log("yo posted that shit");
		callback(callbackParam);
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	req.write(dump);
	req.end();
}

var clear = function clear() {
	currentBufferSize = 0;
	currentLogs       = 0;
}

var getCurrentBufferSize =  function getCurrentBufferSize() {
	return currentBufferSize;
}

var getSizeInBuffer = function getSizeInBuffer(stuff) {
	return Buffer.byteLength(stuff, encoding);
}


exports.logger = function(options) {
	
	var interval = setInterval(function() {
	  flush(clear);
	}, flushInterval);


	if(loggerInstance)
		return loggerInstance;
	else {
		// set various options
		if(options != null) {
			if(options.isJson) isJson = options.isJson;
			if(options.encoding) encoding = options.encoding;
			if(options.useFile) useFile = options.useFile;
			if(options.maxBufferSize) maxBufferSize  = options.maxBufferSize;
			if(options.maxLogsInBuffer) maxLogsInBuffer = options.maxLogsInBuffer;
			if(options.minLogsInBuffer) minLogsInBuffer = options.minLogsInBuffer;
			if(options.postOptions) postOptions = options.postOptions;
			if(options.flushInterval) flushInterval = options.flushInterval;

		}
		// create a new buffer
		buffer = new Buffer(maxBufferSize);
		return loggerInstance = {
			log 	: log,
			flush 	: flush,
			clear 	: clear,
			size 	: getCurrentBufferSize,
			buffer  : buffer
		}
	}
}