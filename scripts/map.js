const TILE_WIDTH = 99;

class CMap {
	constructor(elementQuery) {
		const canvas = CanvasManager.create(elementQuery);
		const ctx = canvas.graphics;

		this.canvas = canvas;
		this.graphics = ctx;

		this.terrainMap = new CTilemap();
		this.terrainMap.setFixedWidth(99);

		for (const terrainId in TERRAIN) {
			const terrainInfo = TERRAIN[terrainId]
			this.terrainMap.register(terrainId, terrainInfo.assets);
		}

		this.bg1Map = new CTilemap();
		this.bg1Map.register('*', [
			{
				image: 'media/terrain/forest.png',
			}
		]);

		this.bg2Map = new CTilemap();
		this.bg2Map.register('*', [
			{
				image: 'media/terrain/hill_1.png',
				weight: 8,
			},

			{
				image: 'media/terrain/hill_2.png',
				weight: 1,
			},

			{
				image: 'media/terrain/hill_3.png',
				weight: 1,
			},
		]);

		this.tiles = [];
		this.width = 0;
		this.player = null;
		this.trenchCount = 0;

		canvas.on('resize', () => {
			this.draw();
		});
	}

	setPlayerFocus(player) {
		this.player = player;
	}

	generate(length) {
		this.tiles = [];
		for (let x = 0; x < length; x++) {
			const terrainId = Math.random() < 0.2 ? ENUM.terrain.trench : ENUM.terrain.plains;
			this.tiles.push(terrainId);

			if ( terrainId === ENUM.terrain.trench ) {
				this.trenchCount++;
			}

			this.terrainMap.setAt(terrainId, x);
		}

		this.width = this.tiles.length * TILE_WIDTH;

		this.bg1Map.generateToPixels(this.width);
		this.bg2Map.generateToPixels(this.width);

		this.bg2Map.on('loaded', () => this.draw())
	}

	countTrenches(startX, direction) {
		let count = 0;
		let x = startX;

		direction = direction * -1;

		const tiles = this.tiles;
		while ( x >= 0 && x < tiles.length ) {
			const tileId = tiles[x];
			if ( tileId === ENUM.terrain.trench ) {
				count++;
			}

			x += direction;
		}

		return count;
	}

	toTilePosition(x) {
		return Math.floor(x / TILE_WIDTH);
	}

	getTerrainAt(gridX) {
		return this.tiles[gridX];
	}

	getNextTrenchPosition(startX, direction = ENUM.direction.right) {
		const length = this.tiles.length;

		for (let i = 1; i < length; i++) {
			const x = (startX + i * direction + length) % length;

			const tileId = this.tiles[x];
			if ( tileId !== ENUM.terrain.trench ) continue;

			return x;
		}
	}

	draw() {
		this.canvas.clear();

		const ctx = this.graphics;
		const startHeight = this.canvas.height;

		Camera.translate(ctx);

		ctx.translate(0, startHeight - TERRAIN_HEIGHT);
		this.bg2Map.draw(ctx, Camera.x / 2);
		this.bg1Map.draw(ctx, Camera.x / 4);

		ctx.translate(0, TERRAIN_HEIGHT);
		this.terrainMap.draw(ctx);
	}
}

const GameMap = new CMap('#canv-terrain');
GameMap.generate(40);