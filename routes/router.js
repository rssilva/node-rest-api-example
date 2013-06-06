var users = require( '../routes/users' ),
	characters = require( '../routes/characters' ),
	weapons = require( '../routes/weapons' );

module.exports = function (app) {
	return {
		init: function () {
			this.configUsersRoutes();
			this.configCharactersRoutes();
			this.configWeaponsRoutes();
		},

		configUsersRoutes: function () {
			app.get( '/users', users.listAll );
			app.get( '/users/:id', users.findById );
			app.get( '/users/:id/characters', users.getCharacters );
			app.get( '/users/:id/characters/:charId', users.getCharacterById );
			app.get( '/users/:id/characters/:charId/weapons', users.getCharacterWeapons );
			app.get( '/users/:id/characters/:charId/weapons/:weaponId', users.getCharacterWeaponById );

			app.put( '/users', users.add );
			app.put( '/users/:id/characters', users.addCharacter );
			app.put( '/users/:id/characters/:charId/weapons', users.addCharacterWeapon );
				
			app.post( '/users/:id', users.setData );
			app.post( '/users/:id/characters/:charId', users.setCharacterData );
			app.post( '/users/:id/characters/:charId/weapons/:weaponId', users.setCharacterWeaponData );

			app.delete( '/users/:id', users.delete );
			app.delete( '/users/:id/characters/:charId', users.deleteCharacter );
			app.delete( '/users/:id/characters/:charId/weapons/:weaponId', users.deleteCharacterWeapon );
		},

		configCharactersRoutes: function () {
			app.get( '/characters', characters.listAll );
			app.get( '/characters/:charId', characters.findById );
			app.get( '/characters/:charId/weapons', characters.listWeapons );
			app.get( '/characters/:charId/weapons/:weaponId', characters.findWeaponById );

			app.put( '/characters', characters.add );
			app.put( '/characters/:charId/weapons', characters.addWeapon );

			app.post( '/characters/:charId', characters.setData );
			app.post( '/characters/:charId/weapons/:weaponId', characters.setCharacterWeaponData );

			app.delete( '/characters/:charId', characters.delete );
			app.delete( '/characters/:charId/weapons/:weaponId', characters.deleteCharacterWeaponById );
		},

		configWeaponsRoutes: function () {
			app.get( '/weapons', weapons.listAll );
			app.get( '/weapons/:weaponId', weapons.findById );

			app.put( '/weapons', weapons.add );

			app.post( '/weapons/:weaponId', weapons.setData );

			app.delete( '/weapons/:weaponId', weapons.delete );
		}
	}
}