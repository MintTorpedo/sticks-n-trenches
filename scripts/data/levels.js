const LEVELS = [
	{
		title: 'The basics',
		theme: 'default',
		map: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		soundtrack: 'track1',

		player: {
			money: 60,
			incomeFixed: 2,

			loadout: ['rifleman'],
		},

		enemy: {
			money: 60,

			income: 0,
			incomeFixed: 1,

			loadout: ['rifleman'],
		},
	},

	{
		title: 'Trenches',
		theme: 'default',
		map: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		soundtrack: 'track2',

		player: {
			money: 60,
			income: 1,

			loadout: ['rifleman'],
		},

		enemy: {
			money: 0,

			income: 0,
			incomeFixed: 3,

			loadout: ['rifleman'],
		},
	},

	{
		title: 'Snipers !',
		theme: 'default',
		map: [0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 2, 0, 2, 0, 1, 2, 2, 2, 2, 1, 0, 2, 0, 0],
		soundtrack: 'track1',

		player: {
			money: 60,
			income: 1,

			loadout: ['rifleman'],
		},

		enemy: {
			money: 40,

			income: 0,
			incomeFixed: 2,

			loadout: ['rifleman'],
		},

		timed: [
			{
				spawn: ['sniper'],
				team: 'enemy',

				traits: {
					tileX: 10,
					mobility: 0,
				}
			},

			{
				spawn: ['sniper'],
				team: 'enemy',

				traits: {
					tileX: 21,
					mobility: 0,
				}
			},
		],

		interval: [
			{
				seconds: 30,
				spawn: ['sniper'],
				team: 'enemy',
			}
		]
	},

	{
		title: 'Sniper v sniper',
		theme: 'default',
		map: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 2, 1, 0, 0, 2, 2, 0, 1, 0, 0, 2, 1, 2, 2, 2],
		soundtrack: 'track2',

		player: {
			money: 80,
			income: 1,

			loadout: ['rifleman', 'sniper'],
		},

		enemy: {
			money: 60,

			income: 0,
			incomeFixed: 2,
			loadout: ['rifleman', 'sniper'],
		},

		interval: [
			{
				seconds: 30,
				spawn: ['rifleman', 'rifleman', 'rifleman', 'sniper', 'sniper'],
				team: 'enemy',

				traits: {
					tileX: 28,
				}
			}
		]
	},

	{
		title: 'Entrenched',
		theme: 'default',
		map: [0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0],
		soundtrack: 'track4',

		player: {
			money: 100,
			income: 1,

			loadout: ['rifleman', 'sniper', 'artillery'],
		},

		enemy: {
			money: -180,

			income: 0,
			incomeFixed: 4,
			loadout: ['stormtrooper', 'sniper'],
		},

		timed: [
			{
				//seconds: 30,
				spawn: [
					'rifleman', 'rifleman', 'rifleman', 'rifleman',
					'sniper', 'sniper', 'sniper', 'sniper',
				],

				team: 'enemy',

				traits: {
					tileX: 14,
					mobility: 0,
				}
			},

			{
				//seconds: 30,
				spawn: [
					'rifleman', 'rifleman', 'rifleman', 'rifleman',
					'sniper', 'sniper', 'sniper', 'sniper',
				],

				team: 'enemy',

				traits: {
					tileX: 21,
					mobility: 0,
				}
			},
		],

		interval: [
			{
				seconds: 40,
				spawn: [
					'rifleman', 'rifleman', 'rifleman', 'sniper'
				],

				team: 'enemy',
			}
		],
	},

	{
		title: 'Test',
		theme: 'default',
		map: [3, 3, 3, 3, 0, 1, 0, 0, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 0, 1, 0, 0, 1, 0, 3, 3, 3, 3],
		soundtrack: 'track3',

		player: {
			money: 170,
			income: 1,

			loadout: ['rifleman', 'sniper', 'gunner', 'artillery', 'transport truck'],
		},

		enemy: {
			money: 40,

			income: 0,
			incomeFixed: 6,
			loadout: ['stormtrooper', 'sniper', 'gunner', 'artillery'],
		},

		interval: [
			{
				seconds: 60,
				spawn: ['tank'],

				team: 'enemy',
			}
		],
	},
];

const DEFAULT_LEVEL_BASE = {
	interval: [],
	timed: [],
	theme: 'default',
	soundtrack: 'track1',

	player: {},
	enemy: {},
};

const DEFAULT_LEVEL_PLAYER = {
	money: 0,
	income: 1,
	loadout: [],
};

const DEFAULT_LEVEL_EVENT = {
	seconds: 0,
	team: 'enemy',
	traits: {}
};

// Format level data
(() => {
	LEVELS.forEach(level => {
		FillMissingProperties(level, DEFAULT_LEVEL_BASE);

		FillMissingProperties(level.player, DEFAULT_LEVEL_PLAYER);
		FillMissingProperties(level.enemy, DEFAULT_LEVEL_PLAYER);

		level.interval.forEach(event => FillMissingProperties(event, DEFAULT_LEVEL_EVENT) );
		level.timed.forEach(event => FillMissingProperties(event, DEFAULT_LEVEL_EVENT) );
	});
})();