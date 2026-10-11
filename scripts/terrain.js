const TERRAIN = {
	[ENUM.terrain.plains]: {
		defence: 1,

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
	},

	[ENUM.terrain.trench]: {
		defence: 0.2,

		assets: [
			{
				image: 'media/terrain/trench.png',
			},
		],
	}
}

const TERRAIN_WIDTH = 99;
const TERRAIN_HEIGHT = 100;
const TERRAIN_GRASS_OFFSET = 35;