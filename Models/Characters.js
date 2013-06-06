var mongoose = require('mongoose'), 
	Weapons = require('../Models/Weapons.js');

var Characters = function ( mongoose ) {
	return {
		init: function () {
			
			this.Schema = new mongoose.Schema({
				name: String,
				userId: String,
				ville: String,
				level: Number,
				leftHand: String,
				rightHand: String,
				armor: String,
				helmet: String,
				weapons: Array
			});

			this.Model = mongoose.model( 'Character', this.Schema );
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
			var character = new this.Model( data ), 
				response  = {};

			character.save( function ( err ) {
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

			this.executeQuery( {}, 'characters', callback );
		},

		//GET
		findById: function ( charId, callback ) {
			var response = {};

			this.Model.findOne( {_id: charId}, function ( err, result ) {
			    if (!err) {
		    		response.character = result;
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
			this.executeQuery( {userId: userId}, 'characters', callback );
		},

		//POST
		findByIdAndUpdate: function ( charId, data, callback ) {
			var response = {};
			
			this.Model.findByIdAndUpdate( charId, data, function (err, result) {
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
		delete: function ( charId, callback ) {
			var self = this,
				response = {};

			this.Model.remove({_id: charId}, function ( err, result ) {
	    	    if (!err) {
	    	    	Weapons.deleteCharacterWeapons( charId, callback )
	    	    } else {
	    	        response.err = err;
	    	    }

	        	if ( callback ) {
	        		callback ( response );
	        	}
			});
		},



		//DELETE
		deleteUserCharacters: function ( userId, callback) {
			var response = {};

			this.Model.remove({userId: userId}, function ( err, result ) {
			    if (!err) {
			    	//USERID NAO TEM CARA
			    	Weapons.deleteUserWeapons( userId, callback );
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

var characters = new Characters( mongoose );
characters.init();

module.exports = characters;