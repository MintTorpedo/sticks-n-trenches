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
		map: [0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0],
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
				spawn: {
					entities: [
						'rifleman', 'rifleman', 'rifleman', 'rifleman',
						'sniper', 'sniper', 'sniper', 'sniper',
					],
					team: 'enemy',

					traits: {
						tileX: 12,
						mobility: 0,
					}
				}
			},

			{
				//seconds: 30,
				spawn: {
					entities: [
						'rifleman', 'rifleman', 'rifleman', 'rifleman',
						'sniper', 'sniper', 'sniper', 'sniper',
					],

					team: 'enemy',
					traits: {
						tileX: 21,
						mobility: 0,
					}
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
		title: 'Sandbox',
		theme: 'default',
		map: [3, 3, 3, 3, 0, 1, 0, 0, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 0, 1, 0, 0, 1, 0, 3, 3, 3, 3],
		soundtrack: 'track4',

		player: {
			money: 100,
			income: 1,

			loadout: ['rifleman', 'sniper', 'gunner', 'artillery', 'transport truck', 'armored car', 'tank', 'assault gun'],
		},

		enemy: {
			money: -20,

			income: 0,
			incomeFixed: 10,
			loadout: ['stormtrooper', 'grenadier', 'sniper', 'gunner', 'artillery', 'transport truck', 'armored car', 'assault gun'],
		},

		events: [
			{
				eventName: 'trench_captured',
				eventTarget: 'player',
				eventValue: 7,

				spawn: {
					entities: ['grenadier', 'grenadier', 'grenadier', 'grenadier', 'grenadier', 'tank'],
					team: 'enemy',

					traits: {}
				}
			},

			{
				eventName: 'trench_captured',
				eventTarget: 'player',
				eventValue: 6,

				spawn: {
					entities: ['grenadier', 'grenadier', 'grenadier', 'grenadier'],
					team: 'enemy',

					traits: {}
				}
			},
		],

		// timed: [
		// 	{
		// 		spawn: ['grenadier'],
		// 		team: 'player',
		// 		traits: {
		// 			tileX: 30,
		// 		}
		// 	}
		// ],

		interval: [
			{
				seconds: 100,

				spawn: {
					entities: ['tank'],
					team: 'enemy',
				},
			}
		],
	},
];

const DEFAULT_LEVEL_BASE = {
	theme: 'default',
	soundtrack: 'track1',

	player: {},
	enemy: {},

	interval: [],
	timed: [],
	events: [],
};

const DEFAULT_LEVEL_PLAYER = {
	money: 0,
	income: 1,
	loadout: [],
};

const DEFAULT_EVENT_TIME = {
	seconds: 0,
};

const DEFAULT_SPAWN_INFO = {
	entities: [],
	team: 'enemy',
	traits: {},
};

// Format level data
(() => {
	const FillEvent = (eventInfo) => {
		if ( eventInfo.spawn ) {
			FillMissingProperties(eventInfo.spawn, DEFAULT_SPAWN_INFO);
		}
	};

	const FillTimedEvent = (eventInfo) => {
		FillMissingProperties(eventInfo, DEFAULT_EVENT_TIME);
		FillEvent(eventInfo);
	};

	LEVELS.forEach(level => {
		FillMissingProperties(level, DEFAULT_LEVEL_BASE);

		FillMissingProperties(level.player, DEFAULT_LEVEL_PLAYER);
		FillMissingProperties(level.enemy, DEFAULT_LEVEL_PLAYER);

		level.interval.forEach(FillTimedEvent);
		level.timed.forEach(FillTimedEvent);
		level.events.forEach(FillEvent);
	});
})();