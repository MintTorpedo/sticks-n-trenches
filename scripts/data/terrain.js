const TERRAIN = {
	[ENUM.terrain.plains]: {
		id: ENUM.terrain.plains,
		defence: 1,

		speed: {
			[ENUM.class.building]: 0,
			[ENUM.class.infantry]: 1,
			[ENUM.class.car]: 1,
			[ENUM.class.tank]: 1,
		},

		assets: [
			{
				image: 'media/terrain/plains1.png',
				weight: 3,
			},

			{
				image: 'media/terrain/plains2.png'
			},

			{
				image: 'media/terrain/plains3.png'
			},
		],

		minimapImage: 'media/minimap/plains.png',
	},

	[ENUM.terrain.trench]: {
		id: ENUM.terrain.trench,
		defence: 0.2,

		speed: {
			[ENUM.class.building]: 0,
			[ENUM.class.infantry]: 1,
			[ENUM.class.car]: 0.5,
			[ENUM.class.tank]: 1,
		},

		assets: [
			{
				image: 'media/terrain/trench.png',
			},
		],

		minimapImage: 'media/minimap/trench.png',
	},

	[ENUM.terrain.mud]: {
		id: ENUM.terrain.mud,
		defence: 1,

		speed: {
			[ENUM.class.building]: 0,
			[ENUM.class.infantry]: 0.5,
			[ENUM.class.car]: 0.25,
			[ENUM.class.tank]: 0.75,
		},

		assets: [
			{
				image: 'media/terrain/mud.png'
			}
		],

		minimapImage: 'media/minimap/mud.png',
	},

	[ENUM.terrain.road]: {
		id: ENUM.terrain.road,
		defence: 1.5,

		speed: {
			[ENUM.class.building]: 0,
			[ENUM.class.infantry]: 1,
			[ENUM.class.car]: 1.25,
			[ENUM.class.tank]: 1,
		},

		assets: [
			{
				image: 'media/terrain/road.png'
			}
		],

		minimapImage: 'media/minimap/road.png',
	},
}

const TERRAIN_WIDTH = 99;
const TERRAIN_HEIGHT = 100;
const TERRAIN_GRASS_OFFSET = 35;