const TILE_WIDTH = 99;

class CMap {
	constructor(gameSession) {
		this._game = gameSession;
		this._entityManager = gameSession.entityManager;

		const canvas = CanvasManager.create('#canv-terrain');
		const ctx = canvas.graphics;

		this.canvas = canvas;
		this.graphics = ctx;

		this.terrainMap = new CTilemap();
		this.terrainMap.setFixedWidth(99);

		this.miniMap = new CTilemap();

		for (const terrainId in TERRAIN) {
			const terrain = TERRAIN[terrainId]
			this.terrainMap.register(terrainId, terrain.assets);

			this.miniMap.register(terrainId, [{image: terrain.minimapImage}]);
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

	import(mapArray) {
		this.tiles = [];
		this.trenchCount = 0;

		for (let x = 0; x < mapArray.length; x++) {
			const terrainId = mapArray[x];
			this.tiles[x] = terrainId;

			if ( terrainId == ENUM.terrain.trench ) {
				this.trenchCount++;
			}

			this.terrainMap.setAt(x, terrainId);
			this.miniMap.setAt(x, terrainId)
		}

		this.width = this.tiles.length * TILE_WIDTH;

		this.bg1Map.generateToPixels(this.width);
		this.bg2Map.generateToPixels(this.width);

		this.bg2Map.on('loaded', () => this.draw());
		this.draw();
	}

	generate(length) {
		const generated = [];
		for (let x = 0; x < length; x++) {
			const diceRoll = Math.random()
			let terrainId = ENUM.terrain.plains;

			if (diceRoll < 0.15) {
				terrainId = ENUM.terrain.trench;

			} else if (diceRoll < 0.3) {
				terrainId = ENUM.terrain.mud;

			} else if (diceRoll < 0.6) {

				terrainId = ENUM.terrain.road;
			}

			generated.push(terrainId);
		}

		this.import(generated);
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
		const terrainId = this.tiles[gridX];
		return TERRAIN[terrainId];
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

	getNthTrenchPosition(trenchNth) {
		let trenchCount = 0;

		for (let x = 1; x < this.tiles.length; x++) {
			const terrainId = this.tiles[x];
			if ( terrainId !== ENUM.terrain.trench ) continue;

			trenchCount++;
			if ( trenchCount !== trenchNth ) continue;

			return x;
		}
	}

	drawEntityDots(ctx) {
		const mapWidth = this.terrainMap.width;
		const miniWidth = this.miniMap.width;

		const entities = this._entityManager.entities;
		
		for (let i = 0; i < entities.length; i++) {
			const entity = entities[i];
			if (entity.isDead) continue;

			if (entity.player === this.player) {
				ctx.fillStyle = '#0d0';
			} else {
				ctx.fillStyle = '#d00';
			}

			let size = 4;

			const entityType = entity.stats.class;
			if ( entityType === ENUM.class.car ) {
				size = 7;
			} else if ( entityType === ENUM.class.tank ) {
				size = 10;
			} else if ( entityType === ENUM.class.building ) {
				size = 14;
			}

			ctx.fillRect(
				miniWidth * (entity.x / mapWidth) - size / 2, 
				20 - size - entity.y / 2,
				size, size
			);
		}
	}

	draw() {
		this.canvas.clear();

		const ctx = this.graphics;
		const viewportHeight = this.canvas.height;
		const viewportWidth = this.canvas.width;

		ctx.save();
		ctx.translate(0, 40);
		this.miniMap.draw(ctx);

		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 1;

		const mapWidth = this.terrainMap.width;
		const miniWidth = this.miniMap.width;
		ctx.strokeRect(miniWidth * (Camera.x - 20) / mapWidth, -40, miniWidth * viewportWidth / mapWidth, 40 - 1)		
		ctx.restore();

		Camera.translate(ctx);

		ctx.translate(0, viewportHeight - TERRAIN_HEIGHT);
		this.bg2Map.draw(ctx, Camera.x / 2);
		this.bg1Map.draw(ctx, Camera.x / 4);

		ctx.translate(0, TERRAIN_HEIGHT);
		this.terrainMap.draw(ctx);
	}
}

// const GameMap = new CMap('#canv-terrain');
// GameMap.import([
// 	3, 3, 3, 3, 0, 1, 0, 0, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 0, 1, 0, 0, 1, 0, 3, 3, 3, 3
// ]);