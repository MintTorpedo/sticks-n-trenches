class CEntityManager {
	constructor(gameSession) {
		this._game = gameSession;

		this.entities = [];
		this.counter = 0;
	}

	create(statName, player) {
		const baseStats = UNIT_STATS[statName];
		if ( !baseStats ) return console.warn(`Invalid unit name "${statName}"`);

		const entityId = ++this.counter;
		let entity;
		if ( baseStats.isTransport ) {
			entity = new CEntityTransport(this._game, entityId, statName, player);
		} else {
			entity = new CEntity(this._game, entityId, statName, player);
		}

		const index = this.getEntityOrderIndex(entity);
		this.entities.splice(index, 0, entity);

		return entity;
	}

	// kill(entity) {
	// 	const index = this.entities.indexOf(entity);
	// 	if ( index === -1 ) return;

	// 	this.entities.splice(index, 1);
	// }

	getEntityOrderIndex(entity) {
		let low = 0;
		let high = this.entities.length;

		while (low < high) {
			const mid = (low + high) >> 1;

			if (this.entities[mid].z >= entity.z) {
				low = mid + 1;
			} else {
				high = mid;
			}
		}

		return low;
	}

	getEntitiesWithin(sx1, sy1, radius) {
		const result = [];

		for (let i = 0; i < this.entities.length; i++) {
			const entity = this.entities[i];
			const [sx2, sy2] = entity.getScreenPosition();
			
			const dist = Math.hypot(sx2 - sx1, sy2 - sy1);
			if (dist > radius) continue;

			result.push(entity);
		}

		return result;
	}

	iterate(callback) {
		const entities = this.entities;

		for (let i = 0; i < entities.length; i++) {
			const entity = entities[i];
			if ( callback(entity) !== undefined ) break;
		}
	}

	iterateByPlayer(player, callback) {
		const entities = this.entities;

		for (let i = 0; i < entities.length; i++) {
			const entity = entities[i];
			if ( entity.player !== player ) continue;

			if ( callback(entity) !== undefined ) break;
		}
	}

	update(dt) {
		const entities = this.entities;
		for (let i = entities.length - 1; i >= 0; i--) {
			const entity = entities[i];
			entity.update(dt);

			if ( entity.isFullyDead ) {
				entities.splice(i, 1);
			}
		}
	}

	draw(ctx) {
		for (let i = 0; i < this.entities.length; i++) {
			const entity = this.entities[i];
			entity.draw(ctx);
		}

	}

	drawShadows(ctx) {
		ctx.save();
		ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';

		for (let i = 0; i < this.entities.length; i++) {
			const entity = this.entities[i];
			if ( entity.isDead ) continue;
			
			const [x, y] = entity.getScreenPosition();

			// ctx.fillRect(x - 3, y - 3, 6, 6);

			const shadow = entity.stats.shadow;

			ctx.beginPath();
			ctx.ellipse(x, y, shadow[0], shadow[1], 0, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.restore();
	}
}