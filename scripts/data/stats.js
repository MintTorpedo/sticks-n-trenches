const UNIT_STATS = {
	'hq': {
		class: ENUM.class.building,
		icon: 'media/hq.png',

		health: 300,
		armor: 2,
		mobility: 0,

		shadow: [70, 40],

		spritesheets: {
			move: {
				path: 'media/hq.png',
				size: [1, 1],
				frames: 1,

				offset: [0, -25],
			},

			idle: {
				path: 'media/hq.png',
				size: [1, 1],
				frames: 1,

				offset: [0, -25],
			},
		},

	},

	'rifleman': {
		class: ENUM.class.infantry,
		icon: 'media/icons/rifleman.png',

		health: 30,
		mobility: 70,
		price: 25,

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
			fireOnKeyframe: 'fire',

			sound: 'sfx/v2/rifle.mp3',
		},
	},

	'grenadier': {
		class: ENUM.class.infantry,
		icon: 'media/icons/riflegren.png',

		health: 30,
		mobility: 100,
		price: 35,

		spritesheets: {
			move: {
				path: 'media/spritesheets/riflegren/move.png',
				size: [3, 3],
				frames: 9,

				offset: [12, 0],
			},

			idle: {
				path: 'media/spritesheets/riflegren/idle.png',
				size: [4, 3],
				frames: 12,

				offset: [12, 0],
			},
			
			attack: {
				path: 'media/spritesheets/riflegren/attack.png',
				size: [5, 5],
				frames: 21,

				offset: [12 + 8, 0],

				keyframes: {
					6: 'fire',
				},
			},

			attack2: {
				path: 'media/spritesheets/riflegren/attack2.png',
				size: [11, 10],
				frames: 108,

				offset: [12 + 4, -2],

				keyframes: {
					44: 'fire',
					89: 'fire',
				},
			},

			death: {
				path: 'media/spritesheets/riflegren/death.png',
				size: [5, 5],
				frames: 23,

				offset: [12 - 59, 0]
			},
		},

		deathOffset: [-75, 0],

		attacks: [
			{
				damage: 8,
				range: 300,
				cooldown: 2,
				damageType: ENUM.damageType.piercing,

				spriteAction: 'attack',
				fireOnKeyframe: 'fire',

				sound: 'sfx/v2/rifle.mp3',
			},

			{
				damage: 20,
				penetration: -12,

				range: 600,
				cooldown: 20,
				damageType: ENUM.damageType.explosive,
				targeting: ENUM.targeting.farthest,

				splashRadius: 20,
				missRadius: 150,
				failureRate: 0.5,

				animation: 'attack2',
				fireOnKeyframe: 'fire',

				sound: 'sfx/v2/artillery.mp3',

				effect: {
					type: 'projectile',
					image: 'media/projectiles/riflegren.png',
					arc: 2,
					speed: 0.85,

					offset: [22, 56 / 2],
				},

				impact: {
					sprite: SPRITESHEETS.explosion2,
					
					sound: 'sfx/v2/fx_bomb1.mp3',
					volume: 0.5,
				},
			},
		],
	},

	'stormtrooper': {
		class: ENUM.class.infantry,
		icon: 'media/icons/stormtrooper.png',
		deathSound: 'sfx/v2/d2.mp3',

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

			// effect: {
			// 	type: 'stroke',
			// 	offset: [47, 36],
			// },
		},
	},

	'sniper': {
		class: ENUM.class.infantry,
		icon: 'media/icons/sniper.png',

		health: 30,
		mobility: 50,
		price: 60,
		cooldown: 30,

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

			range: 550,
			scanRange: 475,
			cooldown: 6,
			damageType: ENUM.damageType.piercing,
			//targeting: ENUM.targeting.farthest,

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

		health: 30,
		mobility: 40,
		price: 70,
		cooldown: 35,

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
				size: [7, 6],
				frames: 39,

				offset: [14 + 5, -3],
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
			range: 375,
			scanRange: 300,
			cooldown: 0.4,
			damageType: ENUM.damageType.piercing,

			animation: 'attack',
			sound: 'sfx/v2/smg.mp3',
		},
	},

	'armored car': {
		class: ENUM.class.car,
		icon: 'media/icons/car.png',

		purchaseSound: 'sfx/s_26.ogg',

		health: 50,
		armor: 6,
		mobility: 160,
		price: 125,
		cooldown: 100,

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
		deathSound: 'sfx/v2/d3.mp3',

		health: 30,
		mobility: 30,
		price: 90,
		cooldown: 40,

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
			fireOnKeyframe: 'fire',

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
		class: ENUM.class.tank,
		icon: 'media/icons/tank.png',

		purchaseSound: 'sfx/s_26.ogg',

		health: 125,
		armor: 7,
		mobility: 70,
		price: 200,
		cooldown: 100,

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
			fireOnKeyframe: 'fire',

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

	'assault gun': {
		class: ENUM.class.tank,
		icon: 'media/icons/armart.png',

		purchaseSound: 'sfx/s_26.ogg',

		health: 125,
		armor: 7,
		mobility: 65,
		price: 300,
		cooldown: 120,

		shadow: [120, 20],

		entitiesOnDeath: ['rifleman', 'rifleman', 'gunner'],

		spritesheets: {
			move: {
				path: 'media/spritesheets/armart/move.png',
				size: [3, 3],
				frames: 8,

				offset: [10, -4],
			},

			idle: {
				path: 'media/spritesheets/armart/idle.png',
				size: [3, 3],
				frames: 8,

				offset: [10, -4],
			},

			attack: {
				path: 'media/spritesheets/armart/attack.png',
				size: [6, 6],
				frames: 32,

				offset: [10 + 23, -4 - 1],

				keyframes: {
					11: 'fire'
				},
			},

			attack2: {
				path: 'media/spritesheets/armart/attack-2.png',
				size: [4, 3],
				frames: 12,

				offset: [10, -4],
			},

			death: {
				path: 'media/spritesheets/armart/death.png',
				size: [5, 4],
				frames: 19,

				offset: [10, -4],
			},
		},

		attacks: [
			{
				damage: 25,
				range: 1100,
				scanRange: 600,
				cooldown: 6,
				damageType: ENUM.damageType.explosive,
				targeting: ENUM.targeting.farthest,

				splashRadius: 30,
				missRadius: 100,

				animation: 'attack',
				fireOnKeyframe: 'fire',

				sound: 'sfx/v2/artillery.mp3',

				effect: {
					type: 'projectile',
					image: 'media/projectiles/shell.png',
					offset: [110 + 30, 75],
				},

				impact: {
					sprite: SPRITESHEETS.explosion2,
					
					sound: 'sfx/v2/fx_bomb1.mp3',
					volume: 0.5,
				},
			},

			{
				damage: 8,
				range: 350,
				scanRange: 300,
				cooldown: 0.4,
				damageType: ENUM.damageType.piercing,

				animation: 'attack2',
				sound: 'sfx/v2/smg.mp3',
			}
		],
	},

	'transport truck': {
		class: ENUM.class.car,
		icon: 'media/icons/truck.png',

		purchaseSound: 'sfx/s_26.ogg',
		isTransport: true,

		health: 70,
		armor: 2,
		mobility: 210,
		price: 90,
		cooldown: 85,

		shadow: [82, 14],

		spritesheets: {
			move: {
				path: 'media/spritesheets/t-truck/move.png',
				size: [3, 3],
				frames: 8,
			},

			idle: {
				path: 'media/spritesheets/t-truck/idle.png',
				size: [2, 2],
				frames: 4,
			},

			transporting: {
				path: 'media/spritesheets/t-truck/transporting.png',
				size: [3, 3],
				frames: 8,
			},

			death: {
				path: 'media/spritesheets/t-truck/death.png',
				size: [4, 4],
				frames: 15,
			},
		},

		attack: {},
	},
}


const DEFAULT_STATS_BASE = {
	health: 1,
	armor: 0,
	mobility: 10,
	cooldown: 3,
	shadow: [24, 8],
	deathOffset: [0, 0],
	spritesheets: {},
	entitiesOnDeath: [],

	isTransport: false,

	price: 999,
	icon: 'media/icons/rifleman.png',
	deathSound: 'sfx/v2/d1.mp3',

	attack: {},
};

const DEFAULT_STATS_ATTACK = {
	damage: 0,
	penetration: 0,
	range: 0,
	cooldown: 9999,
	targeting: ENUM.targeting.random,
	failureRate: 0,

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
	for (const unitName in UNIT_STATS) {
		const baseStats = UNIT_STATS[unitName];
		baseStats.name = unitName;

		FillMissingProperties(baseStats, DEFAULT_STATS_BASE);
		
		let deathSprite = DEFAULT_SPRITE_SPLATTER;
		if ( baseStats.deathOffset ) {
			const bloodSprite = {...DEFAULT_SPRITE_SPLATTER};
			bloodSprite.offset = baseStats.deathOffset;

			deathSprite = bloodSprite;
		}
		baseStats.spritesheets['splatter'] = deathSprite;

		if ( baseStats.attacks === undefined ) {
			baseStats.attacks = [baseStats.attack];
		}

		baseStats.attacks.forEach(attackStats => {
			FillMissingProperties(attackStats, DEFAULT_STATS_ATTACK);
			attackStats.scanRange = attackStats.scanRange ?? attackStats.range;
		});
		// if ( attackStats === undefined ) continue;
	}
})();
