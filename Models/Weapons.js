var mongoose = require('mongoose');

var Weapons = function ( mongoose ) {
	return {
		init: function () {
			
			this.Schema = new mongoose.Schema({
				name: String,
				userId: String,
				charId: String,
				level: Number,
				hands: Number,
				hitsLeft: Number
			});

			this.Model = mongoose.model( 'Weapons', this.Schema );
		},

		executeQuery: function ( query, responseString, callback ) {
			var response = {};

			this.Model.find( query, function ( err, result ) {
			    if (!err) {
		    		response[responseString] = result;
			    } else {
			        response.err = err;
			    }

		    	if ( callback ) {
		    		callback ( response );
		    	}
			});
		},

		//PUT
		add: function ( data, callback ) {
			var weapon = new this.Model( data ), 
				response  = {};

			weapon.save( function ( err ) {
				if (!err) {
					response.result = true;
				} else {
					response.err = err;
				}

				if ( callback ) {
					callback( response )
				}
			});
		},

		//GET
		listAll: function ( callback ) {
			var response = {};

			this.executeQuery( {}, 'weapons', callback );
		},

		//GET
		findById: function ( weaponId, callback ) {
			var response = {};

			this.Model.findOne( {_id: weaponId}, function ( err, result ) {
			    if (!err) {
		    		response.weapon = result;
			    } else {
			        response.err = err;
			    }

		    	if ( callback ) {
		    		callback ( response );
		    	}
			});
		},

		//GET
		listByUserId: function ( userId, callback ) {
			this.executeQuery( {userId: userId}, 'weapons', callback );
		},

		listByCharacterId: function ( charId, callback) {
			this.executeQuery( {charId: charId}, 'weapons', callback );
		},

		//POST
		findByIdAndUpdate: function ( weaponId, data, callback ) {
			var response = {};
			
			this.Model.findByIdAndUpdate( weaponId, data, function (err, result) {
				if (!err) {
					response.result = true;
				} else {
					response.err = err;
				}

				if ( callback ) {
					callback( response );
				}
			});
		},

		//DELETE
		delete: function ( weaponId, callback ) {
			var self = this,
				response = {};

			this.Model.remove({_id: weaponId}, function ( err, result ) {
	    	    if (!err) {
	    	    	response.result = result;
	    	    } else {
	    	        response.err = err;
	    	    }

	        	if ( callback ) {
	        		callback ( response );
	        	}
			});
		},


		deleteUserWeapons: function ( userId, callback ) {
			var response = {};

			this.Model.remove({userId: userId}, function ( err, result ) {
	    	    if (!err) {
	    	    	response.result = result;
	    	    } else {
	    	        response.err = err;
	    	    }

	        	if ( callback ) {
	        		callback ( response );
	        	}
			});
		},

		deleteCharacterWeapons: function ( charId, callback ) {
			var response = {};

			this.Model.remove({charId: charId}, function ( err, result ) {
	    	    if (!err) {
	    	    	response.result = result;
	    	    } else {
	    	        response.err = err;
	    	    }

	        	if ( callback ) {
	        		callback ( response );
	        	}
			});
		}
	}
}

var weapons = new Weapons( mongoose );
weapons.init();

module.exports = weapons;