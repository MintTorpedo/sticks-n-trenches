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

		const baseStats = UNIT_STATS[statName];
		this.stats = baseStats;
		this.isInfantry = baseStats.class === ENUM.class.infantry;
		
		this.mobility = Randomize(baseStats.mobility, 0.2);
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

		this.action = ENUM.action.move;

		this.isDead = false;
		this.isFullyDead = false; // Check for when death animation has completed
		this.isInTrench = false;
		//this.isTransport = this.stats.isTransport;
		this.isBeingLoaded = false;

		this.passenger = null;
		this.destination = 0;

		this.attacks = [];
		for (let i = 0; i < baseStats.attacks.length; i++) {
			const attackStats = baseStats.attacks[i];
			const maxRange = attackStats.range;
			const range = Randomize(maxRange, 0.2);

			this.attacks.push({
				id: i,
				stats: attackStats,
				cooldown: 0,

				range: range,
				scanRange: range / maxRange * attackStats.scanRange,
				target: null,
			});
		}

		this.activeAttack = null;
		this.scanCooldown = this.attacks[0].range === 0 ? Infinity : 0;

		this.target = null; // To be deleted..
		//this.cooldownAttack = 0;

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

	takeDamage(entity, weaponStats) {
		if ( this.isDead ) return;

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

	_findNewTarget(attack) {
		attack = attack ?? this.attacks[0];

		const range = this.action === ENUM.action.move ? attack.scanRange : attack.range;
		if ( range <= 0 ) return null;

		const alliedPlayer = this.player;
		const entities = [];

		this._entityManager.iterate(entity => {
			if ( entity.isDead ) return;
			if ( entity === this ) return;

			if ( entity.player === alliedPlayer) return;
			if ( entity.distanceFrom(this) > range ) return;

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

		// for (let i = 0; i < this.attacks.length; i++) {
		// 	this.attacks[i].cooldown = 0;
		// }
	}

	// _assignNewTarget(attack) {
	// 	attack = attack ?? this.attacks[0];

	// 	const prevTarget = attack.target;
	// 	if ( prevTarget && !prevTarget.isDead ) return;

	// 	const target = this._findNewTarget(attack);
	// 	attack.target = target;

	// 	if ( !target ) {
	// 		if ( this.action === ENUM.action.attack ) {
	// 			this._concludeAttack();
	// 		}

	// 		return;
	// 	}

	// 	if ( this.action === ENUM.action.attack) return;
	// 	this._attack(target, attack);
	// }

	_assignNewTarget() {
		for (let i = 0; i < this.attacks.length; i++) {
			const attack = this.attacks[i];
			if ( attack.cooldown > 0 ) continue;

			if ( !this._hasValidTarget(attack) ) {
				attack.target = null;
				//continue;
			}

			const target = this._findNewTarget(attack);
			if ( !target ) continue;

			attack.target = target;
			this._attack(target, attack);

			return;
		}

		if ( this.action === ENUM.action.attack ) {
			this._concludeAttack();
		}
	}

	_attack(entity, attack) {
		this.activeAttack = attack;

		const weaponStats = attack.stats;
		attack.cooldown = weaponStats.cooldown;

		if ( weaponStats.failureRate < 1 ) {
			const diceRoll = Math.random();

			if ( weaponStats.failureRate > diceRoll ) {
				this.activeAttack = null;
				return;
			}
		}

		this.action = ENUM.action.attack;
		const animation = this.animation.play(weaponStats.animation);
		animation.on('completed', () => {
			this.activeAttack = null;

			if ( this._hasValidTarget(attack) ) return;
			attack.target = this._findNewTarget(attack);
		});

		const hit = (hitx, hity) => {
			if ( !hitx ) {
				entity.takeDamage(this, weaponStats);
				return;
			}

			const radius = weaponStats.splashRadius;
			if ( !radius ) return;

			const hits = this._entityManager.getEntitiesWithin(hitx, hity, radius);
			hits.forEach( entity => {
				if ( entity.player === this.player ) return;
				entity.takeDamage(this, weaponStats)
			});
		}

		const fire = () => {
			if ( weaponStats.sound ) {
				SoundPlayer.play(weaponStats.sound);
			}

			const effect = weaponStats.effect;
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
			
			const missRadius = weaponStats.missRadius
			if ( missRadius ) {
				x1 += missRadius / 2 - Math.random() * missRadius;
			}

			const projectile = this._projectiles.create(x0, y0, x1, y1);
			projectile.setImage(effect.image);
			projectile.setArcHeight(effect.arc);
			projectile.setSpeed(effect.speed);
			projectile.setImpact(weaponStats.impact);
			projectile.on('completed', () => hit(x1, y1));
		}

		const keyframeName = weaponStats.fireOnKeyframe;
		if ( keyframeName ) {
			animation.onKeyframe(keyframeName, fire);
		} else {
			fire();
		}
	}

	_hasValidTarget(attack) {
		const target = attack.target;
		if ( !target || target.isDead ) return false;

		const range = attack.range;
		return range >= this.distanceFrom(target);
	}

	_updateAttack() {
		for (let i = 0; i < this.attacks.length; i++) {
			const attack = this.attacks[i];

			if ( attack.cooldown > 0 ) continue;
			if ( this.activeAttack && this.activeAttack !== attack) continue;

			let target = attack.target;
			if ( !this._hasValidTarget(attack) ) {
				target = this._findNewTarget(attack);

				if ( !target ) {
					//attack.cooldown = CONFIG.entity.scanCooldown;
					continue;
				}

				attack.target = target;
			}

			this._attack(target, attack);
		}

		if ( this.activeAttack ) return;
		if ( this.attacks[0].cooldown > 0 ) return;

		this._concludeAttack();
	}

	_updateCooldown(dt) {
		for (let i = 0; i < this.attacks.length; i++) {
			const attack = this.attacks[i];
			attack.cooldown = Math.max(0, attack.cooldown - dt);
		}
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

	getDistanceFromTrench() {
		return Math.abs(this.player.stopAtTrenchX * TILE_WIDTH - this.x)
	}

	_updateMove(dt) {
		let direction = this.player.direction;
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
		this.scanCooldown -= dt;
		if ( this.scanCooldown > 0 ) return;

		this.scanCooldown = CONFIG.entity.scanCooldown;
		this._assignNewTarget();
	}

	update(dt) {
		if ( this.isDead ) return;

		this._updateCooldown(dt);

		if ( this.action === ENUM.action.move ) {
			this._updateMove(dt);

		} else if ( this.action === ENUM.action.attack ) {
			this._updateAttack(dt);
			return;
		}

		if ( this.action === ENUM.action.move || this.action === ENUM.action.idle ) {
			this._scanTargets(dt);
		}
	}

	draw(ctx) {
		const [x, y] = this.getScreenPosition();
		this.animation.draw(ctx, x, y);
	}
}


class CEntityTransport extends CEntity {
	constructor(gameSession, id, statName, player) {
		super(gameSession, id, statName, player);

		this.target = null;
		this.destination = null;
		this.scanCooldown = 0;

		delete this.attacks;
		delete this.activeAttack;

		//console.log(this);

		this.setAction('idle');
	}

	_setLookDirection(targetX) {
		const direction = Math.sign(targetX - this.x);
		this.animation.setDirection(direction);
	}

	_getTrenchPosition() {
		return this.player.stopAtTrenchX * TILE_WIDTH;
	}

	refreshTrenchDestination() {
		const destination = this._getTrenchPosition() - TILE_WIDTH * 1.5 * this.player.direction;
		this.destination = destination;
		this._setLookDirection(destination);
	}

	_transport(target) {
		target.isDead = true;
		target.setPosition(-1000);

		this.passenger = target;
		this.target = null;

		this.refreshTrenchDestination();
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

	_verifyTarget() {
		const target = this.target;
		if ( !target || target.isDead ) {
			this.target = null;
			this.setAction('idle');

			return;
		}

		this.destination = target.x;
	}

	_verifyDestination() {
		const distance = Math.abs(this.destination - this.x);
		if ( distance > CONFIG.entity.loadDistance ) return;

		if ( this.passenger ) {
			this._unload();
		} else {
			this._transport(this.target);
		}

		//console.log('Destination reached !!!', distance, this);
	}

	_updateMove(dt) {
		let direction = Math.sign(this.destination - this.x);
		this.x += dt * this.mobility * this.speedModifier * direction;

		const tx = Math.floor(this.x / TILE_WIDTH);
		if (this.tileX === tx) return;

		this.tileX = tx;

		const terrain = this._map.getTerrainAt(tx);
		if ( !terrain ) return;

		this.terrain = terrain;
		this.speedModifier = this.terrain.speed[ this.stats.class ];
	}

	_findNewTarget() {
		const alliedPlayer = this.player;
		const entities = [];

		this._entityManager.iterate(entity => {
			if ( entity.isDead ) return;
			if ( entity === this ) return;

			if ( entity.player !== alliedPlayer) return;
			if ( !entity.isInfantry ) return;
			if ( entity.isBeingLoaded ) return;
			if ( entity.getDistanceFromTrench() < 300 ) return;
			if ( entity.action !== ENUM.action.move ) return;

			entities.push(entity);
		});

		const length = entities.length;
		if (length === 0) return null;
		if (length === 1) return entities[0];

		return targetFarthestTrench(this, entities);
	}

	_scanTargets(dt) {
		this.scanCooldown -= dt;
		if ( this.scanCooldown > 0 ) return;

		this.scanCooldown = CONFIG.entity.scanTransportCooldown;

		//console.log('scanning !!', this);
		//console.trace();

		const target = this._findNewTarget();
		if ( !target ) return;

		this.target = target;
		target.isBeingLoaded = true;

		const direction = Math.sign(target.x - this.x);
		this.animation.setDirection(direction);
		this.setAction('move');
	}

	update(dt) {
		if ( this.isDead ) return;

		if ( this.action === ENUM.action.idle ) {
			this._scanTargets(dt);
			return;
		}

		if ( this.action === ENUM.action.move ) {
			this._verifyTarget();
		}
		
		this._updateMove(dt);
		this._verifyDestination();
	}
}