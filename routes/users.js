var	cache = require('../lib/Cache.js'),
	Users = require('../Models/User.js'),
	Character = require('../Models/Characters.js'),
	Weapons = require('../Models/Weapons.js');


//GET
module.exports.listAll = function ( req, res ) {
	var hash = 'users:users';

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = {users: JSON.parse(data[hash])};
			console.log('listAll redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Users.listAll( function (data) {
				console.log('listAll mongo')
				var dataToStore = JSON.stringify(data.users);

				storeCallback({
					hash: hash, 
					data: dataToStore,
					error: function ( error ) {
						res.send( {err: error} );
					}
				});

				res.send( data );
			});
		},
		error: function ( response ) {
			res.send( response );
		}
	});
}

//GET
module.exports.findById = function ( req, res ) {
	var id = req.params.id, 
		hash = 'users:' + id;
	
	cache.get({
		hash: hash,
		sucess: function (data) {
			data = JSON.parse( data[hash] );
			console.log('findById redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			
			Users.findById( id, function ( user ) {
				console.log('findById mongo')
				var dataToStore = JSON.stringify(user);

				storeCallback({
					hash: hash,
					data: dataToStore,
					error: function ( error ) {
						res.send( {err: error} );
					}
				});

				res.send( user );
			});
		},
		error: function ( response ) {
			res.send( response );
		}
	});
}



//PUT
module.exports.add = function ( req, res ) {
	var data = req.body;

	Users.add( data, function ( result ) {
		cache.setExpireTime( 'users:users', 0 );
    	res.send( result );
    });
}

//POST
module.exports.setData = function ( req, res ) {
	var data = req.body,
		id = req.params.id, 
		hash = 'users:' + id;

	Users.setData( id, data, function ( user ) {
		cache.setExpireTime( hash, 0 );
		cache.setExpireTime( 'users:users', 0 );

    	res.send( user );
    });
}



//DELETE
module.exports.delete = function ( req, res ) {
	var id = req.params.id, 
		hash = 'users:' + id;

	Users.delete( id, function ( confirm ) {
		cache.setExpireTime( hash, 0 );
		cache.setExpireTime( 'users:users', 0 );

		res.send( confirm )
	});
}



//GET
module.exports.getCharacters = function ( req, res ) {
	var id = req.params.id, 
		hash = 'characters:users:' + id;

	cache.get({
		hash: hash,
		sucess: function (data) {
			
			data = {characters: JSON.parse(data[hash])};
			console.log('getCharacters redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Characters.listByUserId( id, function ( data ) {
				
				console.log('getCharacters mongo')

				var dataToStore = JSON.stringify(data.characters);

				storeCallback({
					hash: hash, 
					data: dataToStore,
					error: function ( error ) {
						res.send( {err: error} );
					}
				});

				res.send( data );
			});
		},
		error: function ( response ) {
			res.send( response );
		}
	});
}

//GET
module.exports.getCharacterById = function ( req, res ) {
	var charId = req.params.charId, 
		hash = 'characters:' + charId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = JSON.parse( data[hash] );
			console.log('getCharacterById redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			
			Characters.findById( charId, function ( data ) {
				console.log('getCharacterById mongo')
				var dataToStore = JSON.stringify( data );

				storeCallback({
					hash: hash,
					data: dataToStore,
					error: function ( error ) {
						res.send( {err: error} );
					}
				});

				res.send( data );
			});
		},
		error: function ( response ) {
			res.send( response );
		}
	});
}


//PUT
module.exports.addCharacter = function ( req, res ) {
	var data = req.body,
		userId = req.params.id,
		userHash = 'characters:users:' + userId;
		

	data.userId = userId;	

	Characters.add( data, function ( result ) {
		cache.setExpireTime( userHash, 0 );

		res.send( result );
	});
}


//POST
module.exports.setCharacterData = function ( req, res ) {
	var	data = req.body,
		userId = req.params.id,
		charId = req.params.charId, 
		userHash = 'characters:users:' + userId,
		characterHash = 'characters:' + charId;

	data.userId = userId;	
	
	Characters.findByIdAndUpdate( charId, data, function ( result ) {
		cache.setExpireTime( userHash, 0 );
		cache.setExpireTime( characterHash, 0 );

		res.send( result );
	});	
}

//DELETE
module.exports.deleteCharacter = function ( req, res ) {
	var id = req.params.id,
		charId = req.params.charId,
		userHash = 'characters:users:' + userId,
		characterHash = 'characters:' + charId;
	
	Users.deleteCharacter( id, charId, function ( result ) {
		cache.setExpireTime( userHash, 0 );
		cache.setExpireTime( characterHash, 0 );

		res.send( result );
	});
}

//GET
module.exports.getCharacterWeapons = function ( req, res ) {
	var charId = req.params.charId, 
		hash = 'weapons:character:' + charId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			
			data = {weapons: JSON.parse(data[hash])};
			console.log('getCharacterWeapons redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Weapons.listByCharacterId( charId, function ( data ) {
				
				console.log('getCharacterWeapons mongo')

				var dataToStore = JSON.stringify(data.weapons);

				storeCallback({
					hash: hash, 
					data: dataToStore,
					error: function ( error ) {
						res.send( {err: error} );
					}
				});

				res.send( data );
			});
		},
		error: function ( response ) {
			res.send( response );
		}
	});
}

//GET
module.exports.getCharacterWeaponById = function ( req, res) {
	var weaponId = req.params.weaponId,
		hash = 'weapons:' + weaponId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			
			data = JSON.parse(data[hash]);
			console.log('getCharacterWeaponById redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Weapons.findById( weaponId, function ( data ) {
				
				console.log('getCharacterWeaponById mongo')

				var dataToStore = JSON.stringify(data);

				storeCallback({
					hash: hash, 
					data: dataToStore,
					error: function ( error ) {
						res.send( {err: error} );
					}
				});

				res.send( data );
			});
		},
		error: function ( response ) {
			res.send( response );
		}
	});
}

//PUT
module.exports.addCharacterWeapon = function ( req, res) {
	var data = req.body,
		id = req.params.id,
		charId = req.params.charId, 
		hash = 'weapons:character:' + charId;

	data.charId = charId;
	data.userId = id;	

	Weapons.add( data, function ( response ) {
		cache.setExpireTime( hash, 0 );

		res.send( response );
	});
}


//POST
module.exports.setCharacterWeaponData = function ( req, res) {
	var data = req.body,
		charId = req.params.charId,
		weaponId = req.params.weaponId,
		characterHash = 'weapons:character:' + charId,
		weaponHash = 'weapons:' + weaponId;

	Weapons.findByIdAndUpdate( weaponId, data, function ( response ) {
		cache.setExpireTime( characterHash, 0 );
		cache.setExpireTime( weaponHash, 0 );

		res.send( response );
	});
}

//DELETE
module.exports.deleteCharacterWeapon = function ( req, res) {
	var data = req.body,
		charId = req.params.charId,
		weaponId = req.params.weaponId,
		characterHash = 'weapons:character:' + charId,
		weaponHash = 'weapons:' + weaponId;

	Weapons.delete( weaponId, function ( response ) {
		cache.setExpireTime( characterHash, 0 );
		cache.setExpireTime( weaponHash, 0 );

		res.send( response );
	});
}