var	cache = require('../lib/Cache.js'),
	Weapon = require('../Models/Weapons.js');

module.exports.listAll = function ( req, res ) {
	var hash = 'weapons:weapons';

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = {weapons: JSON.parse(data[hash])};
			console.log('listAll redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Weapons.listAll( function ( data ) {
				console.log('listAll mongo')
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

module.exports.findById = function ( req, res ) {
	var weaponId = req.params.weaponId;

	var hash = 'weapons:' + weaponId;

	cache.get({
		hash: hash,
		sucess: function (data) {
			data = JSON.parse(data[hash]);
			console.log('findById redis')
			res.send( data );
		},
		getData: function ( storeCallback ) {
			Weapons.findById( weaponId, function ( data ) {
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

module.exports.add = function ( req, res ) {
	var data = req.body, 
		hash = 'weapons:weapons';

	Weapons.add( data, function ( response ) {
		cache.setExpireTime( hash, 0 );

		res.send( response )
	})
}

module.exports.setData = function ( req, res ) {
	var weaponId = req.params.weaponId,
		data = req.body, 
		hash = 'weapons:' + weaponId;

	Weapons.findByIdAndUpdate( weaponId, data, function () {
		cache.setExpireTime( hash, 0 );

		res.send( data );
	});
}

module.exports.delete = function ( req, res ) {
	var weaponId = req.params.weaponId, 
		hash = 'weapons:' + weaponId;

	Weapons.delete( weaponId, function ( response ) {
		cache.setExpireTime( hash, 0 );

		res.send( response );
	});
}