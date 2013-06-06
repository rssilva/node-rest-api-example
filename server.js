'use strict'

// Including the cluster module
var cluster = require('cluster');

// If current cluster is the master
if (cluster.isMaster) {

    var cpuCount = require('os').cpus().length;
    console.log('Cpu quantity = ' + cpuCount);
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

// If current cluster is a Worker
} else {

   	var config = require('./config.js'),
		express = require( 'express' ),
		mongoose = require( 'mongoose' ), 
		app = express(), 
		Router = require('./routes/router.js');
    
   	app.configure( function () {
       app.use( express.logger('dev') );
       app.use( express.bodyParser() );
       app.use( '/', express.static(__dirname) );
   	});

   	mongoose.connect('mongodb://' + config.database.ip + '/' + config.database.name );
   	global.db = mongoose.connection;

   	global.db.on( 'error', console.error.bind( console, 'connection error:' ) );
   	global.db.once( 'open', function callback () {
		console.log('db connected');
   	});

   	var router = new Router( app );
   	router.init();

   	app.listen(3000);
   	console.log('Listening on port 3000...');

}

cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    // console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();

});