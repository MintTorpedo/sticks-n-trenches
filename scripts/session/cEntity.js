function Randomize(value, rangeRatio) {
	const range = value * rangeRatio;
	const offset = range / 2 - Math.random() * range;
	return value + offset;
}

class CEntity {
	constructor(gameSession, id, statName, player) {
		this._game = gameSession;
		this._entityManager = gameSession.entityManager;
		this._strokes = gameSession.strokes;
		this._projectiles = gameSession.projectiles;
		this._map = gameSession.map;

		this._event = new CEvent();

		this.id = id;
		this.player = player;

		const baseStats = UnitStats[statName];
		this.stats = baseStats;
		this.isInfantry = baseStats.class === ENUM.class.infantry;
		
		this.mobility = Randomize(baseStats.mobility, 0.2);
		this.range = Randomize(baseStats.attack.range, 0.2);
		this.scanRange = this.range / baseStats.attack.range * baseStats.attack.scanRange;
		this.health = baseStats.health;

		this.tileX = 0;
		this.tileAlpha = 0;
		this.tileMidX = 0;

		this.terrain = TERRAIN[ ENUM.terrain.plains ];
		this.speedModifier = 1;

		let zDiceroll = Math.random();
		if ( baseStats.class === ENUM.class.building ) {
			zDiceroll = 0.5;
		}

		this.x = 0;
		this.y = 0;
		this.z = Math.floor(zDiceroll * CONFIG.entity.zMovement);

		this.cooldownScan = baseStats.attack.range === 0 && !baseStats.isTransport ? Infinity : 0;
		this.cooldownAttack = 0;
		this.action = ENUM.action.move;
		this.target = null;

		this.isDead = false;
		this.isFullyDead = false; // Check for when death animation has completed
		this.isInTrench = false;
		this.isAttacking = false;
		this.isTransport = this.stats.isTransport;
		this.isBeingLoaded = false;

		this.passenger = null;
		this.destination = 0;

		const isFlipped = this.player.direction === ENUM.direction.left;

		this._resetPosition();

		this.animation = new CAnimationController(gameSession, baseStats.spritesheets, isFlipped);
		this.setAction('move');
		this.animation.setDefault('idle');
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}

	_resetPosition() {
		if ( this.player.direction === ENUM.direction.right ) {
			this.x = 0;
		} else {
			this.x = this._map.width;
		}
	}

	setPosition(x) {
		this.x = x;
	}

	setMobility(value) {
		this.mobility = value;

		if ( value === 0 && this.action === ENUM.action.move ) {
			this.setAction('idle');
		}
	}

	setAction(actionType) {
		if ( actionType === 'move' && this.mobility <= 0 ) {
			actionType = 'idle';
		}

		this.action = ENUM.action[actionType];
		return this.animation.play(actionType);
	}

	getScreenPosition() {
		return [this.x + this.z * 2 / 7, - this.y - this.z];
	}

	distanceFromFast(otherEntity) {
		const x = this.x - otherEntity.x;
		const y = this.y - otherEntity.y;

		return x*x + y*y;
	}

	distanceFrom(otherEntity) {
		const squareDist = this.distanceFromFast(otherEntity);
		return Math.sqrt(squareDist);
	}

	spawnEntities(names) {
		if ( !names ) return;

		for (let i = 0; i < names.length; i++ ) {
			const entityName = names[i];
			const entity = this.player.createEntity(entityName);

			const randomX = 25 - Math.random() * 50;
			entity.setPosition(this.x + randomX);
		}
	}

	kill() {
		if ( this.isDead ) return;
		this.isDead = true;
		this.health = 0;

		if ( this.stats.deathSound ) {
			SoundPlayer.play(this.stats.deathSound);
		}

		if ( this.passenger ) {
			this._unload();
		}

		const onDeath = () => {
			this.isFullyDead = true;
			controller.kill();

			this._event.emit('death');
		}

		const controller = this.animation;
		const deathAnim = controller.play('death');
		if ( !deathAnim ) {
			this.spawnEntities(this.stats.entitiesOnDeath);
			onDeath();
			return;
		}

		deathAnim.on('completed', () => {
			const splatter = controller.play('splatter');
			splatter.on('completed', onDeath);

			this.spawnEntities(this.stats.entitiesOnDeath);
		});
	}

	takeDamage(entity) {
		if ( this.isDead ) return;

		const weaponStats = entity.stats.attack;

		let armor = this.stats.armor;
		let penetration = weaponStats.penetration;
		if ( penetration < 0 && armor > 0 ) {
			armor -= penetration;
			penetration = 0;
		}

		armor = Math.max(0, armor - penetration);

		let defence = this.terrain.defence;
		if ( this.terrain.id === ENUM.terrain.trench && !this.isInTrench ) {
			defence = 1;
		}

		const damage = Math.max(0,
			Math.floor( (weaponStats.damage - armor) * defence )
		); 

		this.health = Math.max(0, this.health - damage);
		if ( this.health === 0 ) {
			this.kill();

			entity.player.addMoney(
				Math.floor(this.stats.price * CONFIG.entity.moneyDeathRatio)
			);
		}

		if ( this.stats.armor > 0 && weaponStats.damageType === ENUM.damageType.piercing ) {
			SoundPlayer.play('sfx/v2/metal.mp3');
		}
	}

	_findNewTarget() {
		const alliedPlayer = this.player;
		const entities = [];

		const range = this.action === ENUM.action.move ? this.scanRange : this.range;

		this._entityManager.iterate(entity => {
			if ( entity.isDead ) return;
			if ( entity === this ) return;

			if ( this.isTransport ) {
				if ( entity.player !== alliedPlayer) return;
				if ( !entity.isInfantry ) return;
				if ( entity.isBeingLoaded ) return;
				if ( entity.getTrenchDistance() < 300 ) return;
				if ( entity.action !== ENUM.action.move ) return;

			} else {
				if ( entity.player === alliedPlayer) return;
				if ( entity.distanceFrom(this) > range ) return;
			}

			entities.push(entity);
		});

		const length = entities.length;
		if (length === 0) return null;
		if (length === 1) return entities[0];

		switch (this.stats.targeting) {
			case ENUM.targeting.nearest:
				return targetNearest(this, entities);

			case ENUM.targeting.farthest:
				return targetFarthest(this, entities);

			default:
				return targetRandom(this, entities);
		}
	}

	_concludeAttack() {
		let nextAction = this.isInTrench ? 'idle' : 'move';
		this.setAction(nextAction);

		this.cooldownAttack = 0;
	}

	_assignNewTarget() {
		const prevTarget = this.target;
		if ( prevTarget && !prevTarget.isDead ) return;

		this.target = this._findNewTarget();
		if ( !this.target ) {
			if ( this.action === ENUM.action.attack ) {
				this._concludeAttack();
			}

			return;
		}

		if ( this.isTransport ) return;

		if ( this.cooldownAttack === Infinity ) {
			this.cooldownAttack = 0;
		}

		if ( this.action === ENUM.action.attack) return;
		this._attack(this.target);
	}

	getTrenchDistance() {
		return Math.abs(this.player.stopAtTrenchX * TILE_WIDTH - this.x)
	}

	_attack(entity) {
		this.isAttacking = true;

		const animation = this.setAction('attack');
		animation.on('completed', () => {
			this.isAttacking = false;
			if ( !entity.isDead ) return;

			this._assignNewTarget();
		});

		const attackStats = this.stats.attack;
		const cooldown = attackStats.cooldown;
		const remaining = Math.abs(this.cooldownAttack) % cooldown;
		this.cooldownAttack = cooldown - remaining;

		const hit = (hitx, hity) => {
			if ( !hitx ) {
				entity.takeDamage(this);
				return;
			}

			const radius = attackStats.splashRadius;
			if ( !radius ) return;

			const hits = this._entityManager.getEntitiesWithin(hitx, hity, radius);
			hits.forEach( entity => {
				if ( entity.player === this.player ) return;
				entity.takeDamage(this)
			});
		}

		const fire = () => {
			if ( attackStats.sound ) {
				SoundPlayer.play(attackStats.sound);
			}

			const effect = attackStats.effect;
			if ( !effect ) return hit();

			let [x0, y0] = this.getScreenPosition();
			let [x1, y1] = entity.getScreenPosition();

			if ( effect.offset ) {
				x0 += effect.offset[0] * this.player.direction;
				y0 -= effect.offset[1];
			}

			if ( effect.type === 'stroke' ) {
				const [_, height] = entity.animation.getSpriteDimension();
				this._strokes.create(x0, y0, x1, y1 - height / 2, effect);
				return hit();
			}
			
			const missRadius = attackStats.missRadius
			if ( missRadius ) {
				x1 += missRadius / 2 - Math.random() * missRadius;
			}

			const projectile = this._projectiles.create(x0, y0, x1, y1);
			projectile.setImage(effect.image);
			projectile.setImpact(attackStats.impact);
			projectile.on('completed', () => hit(x1, y1));
		}

		const keyframeName = attackStats.fireOnKeyframe;
		if ( keyframeName ) {
			animation.onKeyframe(keyframeName, fire);
		} else {
			fire();
		}
	}

	_updateAttack(dt) {
		this.cooldownAttack -= dt;
		if ( this.cooldownAttack > 0 ) return;

		if ( this.target.isDead ) {
			const target = this._findNewTarget();

			if ( this.isAttacking && !target ) {
				this.cooldownAttack = Infinity;
				return;
			}

			if ( target ) {
				this.target = target;
			} else {
				this._concludeAttack();
			}

			return;
		}

		this._attack(this.target);
	}

	exitTrench() {
		if ( !this.isInTrench ) return;
		if ( this.isDead ) return;

		//this.y += 12;

		this.isInTrench = false;

		if ( this.action === ENUM.action.idle ) {
			this.setAction('move');
		}
	}

	_enterTrench(tx) {
		if ( !this.isInfantry ) return;
		if ( this.player.stopAtTrenchX !== tx ) return;

		//const terrain = GameMap.getTerrainAt(tx);
		if ( this.terrain.id !== ENUM.terrain.trench ) return;
		//this.y = -12;
		this.isInTrench = true;
		this.setAction('idle');
		
		this.player.reportTrenchCapture(tx);
	}
	_setLookDirection(targetX) {
		const direction = Math.sign(targetX - this.x);
		this.animation.setDirection(direction);
	}

	_getTrenchDestination() {
		const trenchX = this.player.stopAtTrenchX * TILE_WIDTH;
		return trenchX - CONFIG.entity.unloadDistance * this.player.direction;
	}

	updateTrenchDestination() {
		const destination = this._getTrenchDestination();
		this.destination = destination;
		this._setLookDirection(destination);
	}

	_transport(target) {
		target.isDead = true;
		target.setPosition(-1000);

		this.passenger = target;
		this.action = ENUM.action.transporting;
		this.target = null;

		this.updateTrenchDestination();
		this.setAction('transporting');
	}

	_unload() {
		const target = this.passenger;
		target.isDead = false;
		target.isInTrench = false;
		target.isBeingLoaded = false;
		target.setPosition(this.x);
		target.setAction('move');

		this.passenger = null;
		this.setAction('idle');
	}

	_getDirectionTransport() {
		let direction = 0;

		let targetX = this.destination;
		if ( !this.passenger ) {
			const target = this.target;

			if ( !target || target.isDead) {
				this.target = null;
				this.setAction('idle');
				return 0;
			}

			targetX = this.target.x;
		}

		const diff = targetX - this.x;
		direction = Math.sign(diff);

		if ( Math.abs(diff) > CONFIG.entity.loadDistance ) return direction;

		if ( this.passenger ) {
			this._unload();
		} else {
			this._transport(this.target);
		}

		return 0;
	}

	_updateMove(dt) {
		let direction = this.player.direction;

		if ( this.isTransport ) {
			direction = this._getDirectionTransport();
		}

		this.x += dt * this.mobility * this.speedModifier * direction;

		// const x = this.x;
		// if (x >= GameMap.width || x <= -150) {
		// 	this._resetPosition();
		// }

		const mtx = Math.floor((this.x - TILE_WIDTH / 2 * direction) / TILE_WIDTH);
		if ( mtx !== this.tileMidX ) {
			this._enterTrench(mtx);
			this.tileMidX = mtx;
		}

		let tx = this.x / TILE_WIDTH;
		const alpha = tx - Math.floor(tx);
		this.tileAlpha = alpha;

		tx = Math.floor(tx);
		if (this.tileX === tx) {
			if (this.terrain.id === ENUM.terrain.trench && this.isInfantry) {
				this.y = (1 - Math.abs(alpha * 2 - 1)) * -12;
			}

			return;
		}

		this.tileX = tx;

		const terrain = this._map.getTerrainAt(tx);
		if ( !terrain ) return;

		this.terrain = terrain;
		this.speedModifier = this.terrain.speed[ this.stats.class ];
	}

	_scanTargets(dt) {
		this.cooldownScan -= dt;

		if ( this.cooldownScan > 0 ) return;
		this.cooldownScan = CONFIG.entity.cooldownScan;

		this._assignNewTarget();

		if ( !this.isTransport ) return;
		this.cooldownScan *= 5;

		const target = this.target;
		if ( !target ) {
			this.setAction('idle');
			return;
		}

		target.isBeingLoaded = true;

		const direction = Math.sign(target.x - this.x);
		this.animation.setDirection(direction);
		this.setAction('move');
	}

	update(dt) {
		if ( this.isDead ) return;

		if ( this.action === ENUM.action.move ) {
			this._updateMove(dt);

		} else if ( this.action === ENUM.action.attack ) {
			this._updateAttack(dt);
			return;

		} else if ( this.action === ENUM.action.transporting ) {
			this._updateMove(dt);
			return;
		}

		this._scanTargets(dt);
	}

	draw(ctx) {
		const [x, y] = this.getScreenPosition();
		this.animation.draw(ctx, x, y);
	}
}