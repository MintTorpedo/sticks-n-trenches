const ENUM = {
	class: {
		'infantry': 0,
		'tank': 1,
		'car': 2,
		'building': 3,
	},

	damageType: {
		'piercing': 0,
		'explosive': 1,
	},

	action: {
		'idle': 0,
		'move': 1,
		'attack': 2,
		'transporting': 3,
	},

	direction: {
		'right': 1,
		'left': -1
	},

	targeting: {
		'random': 0,
		'nearest': 1,
		'farthest': 2,
	},

	terrain: {
		'plains': 0,
		'trench': 1,
		'mud': 2,
		'road': 3,
	},

	gameState: {
		'idle': 0,
		'running': 1,
		'ended': 2,
	},

	difficulty: {
		'normal': 0,
		'hard': 1,
		'tryhard': 2,
		'impossible': 3,
	}
}