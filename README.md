# Chronos-logger
	A smart logger that buffers the logs/data and posts/flushes it to a set destination periodically.
	Aggregates the logs and sends/writes them in a batch.
## Dependency
- Absolutely none

## Installation
	`npm install chronos-logger`

## Usage

	var chronos = require("chronos-logger");
	var logger = chronos.logger(options);
	logger.log({type:"info", time:"124684168","log this"});
	logger.log({type:"error", time:"124684168","log this"});
	console.log(logger.size()); // 128 bytes
	console.log(logger.flush()); // manually flush the logs
	console.log(logger.clear()); // clear all the buffered logs 
	

## Options
"options" is a JSON containing some or all of the following properties:
1. isJson - true if the logs have to be treated as JSON and sent as an array of JSON, false just treats logs as an array of strings
2. encoding - available encoding are:
  a.UTF-8
  b.ASCII (fastest)
  c.UTF16LE
  d.UCS2
  e.base64
  f.binary
  f. hex
3. useFile - false: use a buffer only , true: data is written to a specified file
4. maxBufferSize - Maximum size of buffer to be maintained in bytes
5. maxLogsInBuffer - max logs to be maintained
6. minLogsInBuffer - min logs to be present in buffer if it is to be flushed
7. postOptions - typical http options required when posting data to the server, [refer](https://nodejs.org/api/http.html#http_http_request_options_callback)
8. flushInterval - interval between two successive flushing of logs in buffer

## Advantages:
1. Total control over logging behavior - custom flush intervals, batch size (via maxBufferSize)
2. Completely ASYNC
 

##### Notes
1. Uses a singleton logger approach, only one logger is available to take care of your logging needs
2. Buffer will be written/posted only when: (1) Buffer is full (2) maxLogsInBuffer has reached its limit
	
### To Do:
		File output
		Error handling
		Gzip outgoing requests
		Custome flushing/loggin strategy