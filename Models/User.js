var config = require('../config.js'),
	Characters = require('../Models/Characters.js'),
	mongoose = require('mongoose');

var Users = function ( mongoose ) {
	return {
		init: function () {
			
			this.Schema = new mongoose.Schema({
				name: String,
				id: Number,
				age: Number,
				characters: Array,
				email: String
			});
			
			this.Model = mongoose.model( 'User', this.Schema );
		},

		//PUT
		add: function ( data, callback ) {

			var user = new this.Model( data ), 
				response = { confirmation: false };

			user.save( function (err) {

				if (!err) {
					response.confirmation = true;

				} else {

					response.err = err;
				}

				if ( callback ) {
					callback( response );
				}
			});
		},

		//POST
		setData: function ( id, data, callback ) {
			var	options = {},
				response = {
					result: false
				};
			
			this.Model.findByIdAndUpdate( id, data, options, function( err, user ) {
				if ( err ) {
					response.err = err;
				}
				
				response.response = true;

				if ( callback ) {
					callback( response )
				}
			});
		},

		//GET
		listAll: function ( callback ) {
			var response = {};



			this.Model.find({}, function ( err, users ) {
			    if (!err) {
		    		response.users = users;
			    } else {
			        response.err = err;
			    }

		    	if ( callback ) {
		    		callback ( response );
		    	}
			});
		},

		//GET
		findById: function ( id, callback ) {
			var response = {};

			this.Model.findOne({_id: id}, function ( err, user ) {
			    if (!err) {
		    		response.user = user;
			    } else {
			        response.err = err;
			    }

		    	if ( callback ) {
		    		callback ( response );
		    	}
			});
		},

		//DELETE
		delete: function ( id, callback ) {
			var self = {},
				response = {};

			this.Model.remove({_id: id}, function ( err, result ) {
			    if (!err) {

			    	Characters.deleteUserCharacters( id, callback );
			    } else {
			        response.err = err;
			    	if ( callback ) {
			    		callback ( response );
			    	}
			    }
			});
		}	
	}
}

var users = new Users( mongoose );
users.init();

module.exports = users;