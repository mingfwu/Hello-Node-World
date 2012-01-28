// Enable to store in Mongo - see https://github.com/amark/mongous
//var db = require("mongous").Mongous;


var path = require('path')
	, DataSift = require('datasift')
	, app = require('http').createServer(handler)
  	, io = require('socket.io').listen(app)
  	, fs = require('fs')
    , url = require('url')
    , qs = require('querystring');
    
app.listen(8080);

consumer = new DataSift()


// Static Web Server
function handler (request, response) {

  var filePath = '.' + request.url;
  if (filePath == './') { 
		  filePath = './index.html';
  }
  
  	if (filePath == './disconnect') {
  		console.log('DISCONNECTING');
  		disconnectConsumer();
        filePath = './index.html';
  	};
    
    if (filePath == './input') {
        //console.log(consumer)
        console.log('PROCESSING INPUT');
        request.content = '';
        request.addListener('data',function(data) { request.content += data; });
        request.addListener('end', function() {
	    	request.content = qs.parse(request.content);
	    	console.log(request.content);
            if (request.content.username == '' || request.content.apikey == '' || request.content.streamId == '')
            {
            	console.log('INVALID INPUTS')
                return;
            }
            
	        username = request.content.username;
	        apikey = request.content.apiKey;
            streamId = request.content.streamId;
            
	        console.log('PARSED INPUTS: ',username, apikey, streamId);
	        initConsumer(username, apikey, streamId)
	        
        });
        filePath = './index.html';
    };
    
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

        path.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });

}

function disconnectConsumer() {
	
	//console.log(consumer)
	
	//Emitted when there is an error
	consumer.on("error", function(error){
		console.log("Error: " + error.message);
	});
	
	consumer.disconnect();
	
	//Emitted when disconnected
	consumer.on("disconnect", function(){
		console.log("Truly Disconnected!");
	});
	
	//Emitted when disconnected
	consumer.on("exit", function(){
		console.log("Truly Disconnected!");
	});
}

function initConsumer(username, apikey, streamId){
	
	// Check to see if the request is active or not
	if (consumer.request != null) {
		console.log('Connective active. Subscribing stream');
		consumer.subscribe(streamId)
	} else { 
		//Create a new instance of the DataSift consumer
		console.log('Establishing connection')
		consumer = new DataSift(username,apikey);		
		//Connect
		consumer.connect();
	}
	
	//Emitted when stream is connected
	consumer.on("connect", function(){
		consumer.subscribe(streamId);
	});

	//Emitted when there is an error
	consumer.on("error", function(error){
		console.log("Error: " + error.message);
	});

	//Emitted when there is a warning
	consumer.on("warning", function(message){
		console.log("Warning: " + message);
	});

	//Emitted when disconnected
	consumer.on("disconnect", function(){
		console.log("Disconnected!");
	});
	

	//Emitted when an interaction is received
	consumer.on("interaction", function(obj){

		// Source
		if (obj.data !== undefined && obj.data.interaction !== undefined && obj.data.interaction.source !== undefined) {
			
			//Dump to MongoDB?
			//db('test.test').save(obj.data)

			//console.log(obj.data);
	        io.sockets.emit('streamId', streamId);
	  		io.sockets.emit('data', { source: obj.data.interaction.source });

		}

	/*	
		// Gender
		if (obj.data !== undefined && obj.data.demographic !== undefined && obj.data.demographic.gender !== undefined) {
			
	  		io.sockets.emit('data', { source: obj.data.demographic.gender });

		}
	*/

	});
}








