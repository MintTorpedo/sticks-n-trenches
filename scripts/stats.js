const UnitStats = {
	'rifleman': {
		class: ENUM.class.infantry,
		icon: 'media/icons/rifleman.png',

		health: 30,
		mobility: 70,
		price: 20,

		spritesheets: {
			move: {
				path: 'media/spritesheets/rifleman/move.png',
				size: [3, 4],
				frames: 12,

				offset: [12, 0],
			},

			idle: {
				path: 'media/spritesheets/rifleman/idle.png',
				size: [3, 4],
				frames: 12,

				offset: [12, 0],
			},
			
			attack: {
				path: 'media/spritesheets/rifleman/attack.png',
				size: [6, 5],
				frames: 29,

				offset: [18, 0],

				keyframes: {
					8: 'fire'
				},
			},

			death: {
				path: 'media/spritesheets/rifleman/death.png',
				size: [5, 5],
				frames: 23,

				offset: [16 - 75, 1],
			},
		},

		deathOffset: [-75, 0],

		attack: {
			damage: 8,
			range: 300,
			cooldown: 2,
			damageType: ENUM.damageType.piercing,

			spriteAction: 'attack',
			fireOnSpecificFrame: true,

			sound: 'sfx/v2/rifle.mp3',

			effect: {
				type: 'stroke',
				offset: [39, 40],
			},
		},
	},

	'stormtrooper': {
		class: ENUM.class.infantry,
		icon: 'media/icons/stormtrooper.png',
		deathSound: 'sfx/v2/d2.ogg',

		health: 35,
		mobility: 130,
		price: 30,

		spritesheets: {
			move: {
				path: 'media/spritesheets/stormtrooper/move.png',
				size: [3, 3],
				frames: 8,

				offset: [10, 0],
			},

			idle: {
				path: 'media/spritesheets/stormtrooper/idle.png',
				size: [4, 4],
				frames: 16,

				offset: [10, 0],
			},

			attack: {
				path: 'media/spritesheets/stormtrooper/attack.png',
				size: [5, 4],
				frames: 19,

				offset: [10, 0],
			},

			death: {
				path: 'media/spritesheets/stormtrooper/death.png',
				size: [4, 3],
				frames: 12,

				offset: [10 + 20, 0],
			},
		},

		attack: {
			damage: 6,
			range: 175,
			cooldown: 0.4,
			damageType: ENUM.damageType.piercing,

			animation: 'attack',
			sound: 'sfx/v2/smg.mp3',

			effect: {
				type: 'stroke',
				offset: [57, 36],
			},
		},
	},

	'sniper': {
		class: ENUM.class.infantry,
		icon: 'media/icons/sniper.png',

		health: 30,
		mobility: 50,
		price: 60,

		spritesheets: {
			move: {
				path: 'media/spritesheets/sniper/move.png',
				size: [4, 3],
				frames: 10,

				offset: [10, 0],
			},

			idle: {
				path: 'media/spritesheets/sniper/idle.png',
				size: [4, 4],
				frames: 15,

				offset: [10, 0],
			},
			
			attack: {
				path: 'media/spritesheets/sniper/attack.png',
				size: [6, 5],
				frames: 29,

				offset: [0, 0],
			},

			death: {
				path: 'media/spritesheets/sniper/death.png',
				size: [5, 5],
				frames: 22,

				offset: [10 - 31, 0],
			},
		},

		attack: {
			damage: 20,
			penetration: -5,

			range: 650,
			scanRange: 500,
			cooldown: 6,
			damageType: ENUM.damageType.piercing,
			targeting: ENUM.targeting.farthest,

			animation: 'attack',
			sound: 'sfx/v2/sniper.mp3',

			effect: {
				type: 'stroke',

				color: '#fff',
				thickness: 3,
				duration: 0.3,

				offset: [40, 37],
			},
		},
	},

	'gunner': {
		class: ENUM.class.infantry,
		icon: 'media/icons/gunner.png',

		health: 40,
		mobility: 40,
		price: 70,

		spritesheets: {
			move: {
				path: 'media/spritesheets/gunner/move.png',
				size: [3, 5],
				frames: 15,

				offset: [14, 0],
			},

			idle: {
				path: 'media/spritesheets/gunner/idle.png',
				size: [4, 3],
				frames: 11,

				offset: [14, 0],
			},

			attack: {
				path: 'media/spritesheets/gunner/attack.png',
				size: [7, 7],
				frames: 44,

				offset: [14, 0],
			},

			death: {
				path: 'media/spritesheets/gunner/death.png',
				size: [4, 4],
				frames: 16,

				offset: [-36, 0],
			},
		},

		deathOffset: [-60, 0],

		attack: {
			damage: 8,
			scanRange: 300,
			range: 375,
			cooldown: 0.4,
			damageType: ENUM.damageType.piercing,

			animation: 'attack',
			sound: 'sfx/v2/smg.mp3',

			effect: {
				type: 'stroke',
				offset: [50, 30],
			},
		},
	},

	'armored car': {
		class: ENUM.class.vehicle,
		icon: 'media/icons/car.png',

		purchaseSound: 'sfx/s_26.ogg',

		health: 70,
		armor: 5,
		mobility: 160,
		price: 150,

		shadow: [82, 14],

		spritesheets: {
			move: {
				path: 'media/spritesheets/armored-car/move.png',
				size: [3, 3],
				frames: 8,
			},

			idle: {
				path: 'media/spritesheets/armored-car/idle.png',
				size: [6, 2],
				frames: 12,
			},

			attack: {
				path: 'media/spritesheets/armored-car/attack.png',
				size: [6, 2],
				frames: 12,
			},
		},

		attack: {
			damage: 8,
			range: 300,
			cooldown: 0.4,
			damageType: ENUM.damageType.piercing,

			animation: 'attack',
			sound: 'sfx/v2/smg.mp3',

			effect: {
				type: 'stroke',
				offset: [23, 66],

				color: '#ff0',
				thickness: 4,
			},

			impactEffect: 'none',
		},
	},


	'artillery': {
		class: ENUM.class.infantry,
		icon: 'media/icons/artillery.png',
		deathSound: 'sfx/v2/d3.ogg',

		health: 30,
		mobility: 30,
		price: 100,

		shadow: [60, 10],

		spritesheets: {
			move: {
				path: 'media/spritesheets/artillery/move.png',
				size: [4, 4],
				frames: 15,

				offset: [7, 0],
			},

			idle: {
				path: 'media/spritesheets/artillery/idle.png',
				size: [4, 4],
				frames: 14,

				offset: [7, 0],
			},

			attack: {
				path: 'media/spritesheets/artillery/attack.png',
				size: [11, 10],
				frames: 107,

				keyframes: {
					77: 'fire'
				},

				offset: [7 + 3, 0],
			},

			death: {
				path: 'media/spritesheets/artillery/death.png',
				size: [4, 4],
				frames: 15,

				offset: [7 - 57, 0],
			},
		},

		deathOffset: [-100, 0],

		attack: {
			damage: 25,
			range: 1000,
			scanRange: 800,
			cooldown: 6,
			damageType: ENUM.damageType.explosive,
			targeting: ENUM.targeting.random,

			splashRadius: 30,
			missRadius: 400,

			animation: 'attack',
			fireOnSpecificFrame: true,

			sound: 'sfx/v2/artillery.mp3',

			effect: {
				type: 'projectile',
				image: 'media/projectiles/shell.png',
				offset: [68, 52],
			},

			impact: {
				sprite: SPRITESHEETS.explosion2,
				
				sound: 'sfx/v2/fx_bomb1.mp3',
				volume: 0.5,
			},
		},
	},


	'tank': {
		class: ENUM.class.vehicle,
		icon: 'media/icons/tank.png',

		purchaseSound: 'sfx/s_26.ogg',

		health: 125,
		armor: 7,
		mobility: 70,
		price: 250,

		shadow: [82, 14],

		spritesheets: {
			move: {
				path: 'media/spritesheets/tank/move.png',
				size: [3, 3],
				frames: 8,

				offset: [-5, -4],
			},

			idle: {
				path: 'media/spritesheets/tank/idle.png',
				size: [3, 3],
				frames: 7,

				offset: [-5, -4],
			},

			attack: {
				path: 'media/spritesheets/tank/attack.png',
				size: [6, 5],
				frames: 27,

				offset: [-5, -4],

				keyframes: {
					14: 'fire'
				},
			},

			death: {
				path: 'media/spritesheets/tank/death.png',
				size: [5, 4],
				frames: 17,

				offset: [-5, -4],
			},
		},

		attack: {
			damage: 30,
			penetration: 7,
			range: 350,
			scanRange: 300,
			cooldown: 5,
			damageType: ENUM.damageType.explosive,
			targeting: ENUM.targeting.nearest,

			splashRadius: 20,
			missRadius: 15,

			animation: 'attack',
			fireOnSpecificFrame: true,

			sound: 'sfx/v2/cannon.mp3',

			effect: {
				type: 'projectile',
				image: 'media/projectiles/shell.png',
				offset: [41, 78],
			},

			impact: {
				sprite: SPRITESHEETS.explosion,
				
				sound: 'sfx/v2/fx_bomb6.mp3',
				volume: 0.5,
			},
		},
	},
}


const DEFAULT_STATS_BASE = {
	health: 1,
	armor: 0,
	mobility: 10,
	shadow: [24, 8],
	deathOffset: [0, 0],
	spritesheets: {},

	price: 0,
	icon: 'media/icons/rifleman.png',
	deathSound: 'sfx/v2/d1.ogg',
};

const DEFAULT_STATS_ATTACK = {
	damage: 1,
	penetration: 0,
	range: 0,
	cooldown: 1,
	targeting: ENUM.targeting.random,

	damageType: ENUM.damageType.piercing,
	animation: 'attack',
};

const DEFAULT_SPRITE_SPLATTER = {
	path: 'media/vfx/blood.png',
	size: [3, 3],
	frames: 9,

	offset: [0, 0],
};

(() => {
	function FillMissingProperties(origin, replacement) {
		for (const propName in replacement) {
			if ( origin[propName] !== undefined ) continue;

			origin[propName] = replacement[propName];
		}
	}


	for (const unitName in UnitStats) {
		const baseStats = UnitStats[unitName];
		baseStats.name = unitName;

		FillMissingProperties(baseStats, DEFAULT_STATS_BASE);
		
		let deathSprite = DEFAULT_SPRITE_SPLATTER;
		if ( baseStats.deathOffset ) {
			const bloodSprite = {...DEFAULT_SPRITE_SPLATTER};
			bloodSprite.offset = baseStats.deathOffset;

			deathSprite = bloodSprite;
		}
		baseStats.spritesheets['splatter'] = deathSprite;


		const attackStats = baseStats.attack;
		if ( attackStats === undefined ) continue;

		attackStats.scanRange = attackStats.scanRange ?? attackStats.range;

		FillMissingProperties(attackStats, DEFAULT_STATS_ATTACK);
	}
})();
