var cache = require('../lib/Cache.js'),
	Characters = require('../Models/Characters.js'),
	Weapons = require('../Models/Weapons.js');

//GET
module.exports.listAll = function ( req, res ) {
	var hash = 'characters:characters';

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = {characters: JSON.parse(data[hash])};
			console.log('listAll redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Characters.listAll( function ( data ) {
				console.log('listAll mongo')
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

//PUT
module.exports.add = function ( req, res ) {
	var data = req.body;

	Characters.add( data, function ( result ) {
		cache.setExpireTime( 'characters:characters', 0 );

    	res.send( result );
    });
}

//POST
module.exports.setData = function ( req, res ) {
	var charId = req.params.charId,
		data = req.body, 
		characterHash = 'characters:' + charId;

	Characters.findByIdAndUpdate( charId, data, function ( result ) {
		cache.setExpireTime( 'characters:characters', 0 );
		cache.setExpireTime( characterHash, 0 )

		res.send( result );
	});
}

//GET
module.exports.findById = function ( req, res ) {
	var charId = req.params.charId, 
		hash = 'characters:' + charId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = JSON.parse(data[hash]);
			console.log('findById redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Characters.findById( charId, function ( data ) {
				console.log('findById mongo')
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

//DELETE
module.exports.delete = function ( req, res ) {
	var charId = req.params.charId, 
		hash = 'characters:' + charId;

	Characters.delete( charId, function ( data ) {
		cache.setExpireTime( 'characters:characters', 0 );
		cache.setExpireTime( hash, 0 );

		res.send( data )
	});
}

//PUT
module.exports.addWeapon = function ( req, res ) {
	var data = req.body, 
		charId = req.params.charId, 
		hash = 'weapons:characters:' + charId;

	data.charId = charId;	

	Weapons.add( data, function ( data ) {
		cache.setExpireTime( hash, 0 );

		res.send( data )
	});
}

//GET
module.exports.listWeapons = function ( req, res ) {
	var charId = req.params.charId, 
		hash = 'weapons:characters:' + charId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = {weapons: JSON.parse(data[hash])};
			console.log('listWeapons redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Weapons.listByCharacterId( charId, function ( data ) {
				console.log('listWeapons mongo')
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
module.exports.findWeaponById = function ( req, res ) {
	var weaponId = req.params.weaponId,
		hash = 'weapons:' + weaponId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = JSON.parse(data[hash]);
			console.log('findWeaponById redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Weapons.findById( weaponId, function ( data ) {
				console.log('findWeaponById mongo')
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

//POST
module.exports.setCharacterWeaponData = function ( req, res ) {
	var data = req.body,
		weaponId = req.params.weaponId,
		charId = req.params.charId, 
		characterHash = 'weapons:characters:' + charId,
		weaponHash = 'weapons:' + weaponId;

	Weapons.findByIdAndUpdate( weaponId, data, function ( data ) {
		cache.setExpireTime( characterHash, 0 );
		cache.setExpireTime( weaponHash, 0 );

		res.send( data )
	});
}

//DELETE
module.exports.deleteCharacterWeaponById = function ( req, res ) {
	var data = req.body,
		charId = req.params.charId,
		weaponId = req.params.weaponId,
		characterHash = 'weapons:characters:' + charId, 
		weaponHash = 'weapons:' + weaponId;

	Weapons.delete( weaponId, function ( data ) {
		cache.setExpireTime( characterHash, 0 );
		cache.setExpireTime( weaponHash, 0 );

		res.send( data )
	});
}

//DELETE
module.exports.deleteCharacterWeapons = function ( req, res ) {
	var data = req.body,
		charId = req.params.charId, 
		characterHash = 'weapons:characters:' + charId;

	Weapons.deleteCharacterWeapons( charId, function ( data ) {
		cache.setExpireTime( characterHash, 0 );

		res.send( data )
	});
}