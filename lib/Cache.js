var redis = require( 'redis' );

var Cache = function ( redis ) {
	return {
		init: function () {
			this.client = redis.createClient();
		},

		store: function ( options ) {
			var hash = options.hash, 
				storeObj = {};

			storeObj[hash] = options.data
			
			this.client.hmset(hash, storeObj, function (err, obj) {
				if ( err && options.error ) {
					options.error( err );
				}
			});
		},

		setExpireTime: function ( hash, time ) {
			console.log('setExpireTime')
			this.client.expire(hash, time, function () {
				console.log('expires')
			});
		},

		get: function ( options ) {
			var self = this,
				hash = options.hash;

			this.client.hgetall(hash, function (err, obj) {
				if ( err && options.error ) {
					options.error( {err: err} );
				}
		    	
		    	if ( obj && options.sucess ) {
		    		options.sucess( obj );
		    	} else if ( options.getData ) {
		    		options.getData( function (options) {
		    			self.store(options);
		    		});
		    	}
			});
		}
	}
}

var cache = new Cache( redis );
cache.init()

module.exports = cache;