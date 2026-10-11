function Randomize(value, rangeRatio) {
	const range = value * rangeRatio;
	const offset = range / 2 - Math.random() * range;
	return value + offset;
}

class CEntity {
	constructor(id, manager, statName, player) {
		this.id = id;
		this._manager = manager;
		this.player = player;

		const baseStats = UnitStats[statName];
		this.stats = baseStats;
		this.isInfantry = baseStats.class === ENUM.class.infantry;
		
		this.mobility = Randomize(baseStats.mobility, 0.2);
		this.range = Randomize(baseStats.attack.range, 0.2);
		this.scanRange = this.range / baseStats.attack.range * baseStats.attack.scanRange;
		this.health = baseStats.health;

		this.gx = 0;
		this.x = 0;
		this.y = 0;
		this.z = Math.floor(Math.random() * CONFIG.entity.zMovement);

		this.cooldownScan = 0;
		this.cooldownAttack = 0;
		this.action = ENUM.action.move;
		this.target = null;

		this.isDead = false;
		this.isFullyDead = false; // Check for when death animation has completed
		this.isInTrench = false;
		this.isAttacking = false;

		const isFlipped = this.player.direction === ENUM.direction.left;

		this._resetPosition();

		this.animation = new CAnimationController(baseStats.spritesheets, isFlipped);
		this.setAction('move');
		this.animation.setDefault('idle');
	}

	setAction(actionType) {
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

	kill() {
		if ( this.isDead ) return;
		this.isDead = true;

		if ( this.stats.deathSound ) {
			SoundPlayer.play(this.stats.deathSound);
		}

		const controller = this.animation;
		const deathAnim = controller.play('death');
		if ( !deathAnim ) {
			this.isFullyDead = true;
			controller.kill();
			return;
		}

		deathAnim.on('completed', () => {
			const splatter = controller.play('splatter');

			splatter.on('completed', () => {
				this.isFullyDead = true;
				controller.kill();
			});
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

		const defence = this.isInTrench ? CONFIG.entity.trenchDefence : 1;
		const damage = Math.max(0,
			Math.floor( (weaponStats.damage - armor) * defence )
		); 

		this.health = Math.max(0, this.health - damage);
		if ( this.health === 0 ) {
			this.kill();

			entity.player.addMoney(
				Math.floor(this.stats.price / 3)
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

		this._manager.iterate(entity => {
			if ( entity.isDead ) return;
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
		const nextAction = this.isInTrench ? 'idle' : 'move';
		this.setAction(nextAction);

		this.cooldownAttack = 0;
	}

	_assignNewTarget() {
		this.target = this._findNewTarget();
		if ( !this.target ) {
			if ( this.action === ENUM.action.attack ) {
				this._concludeAttack();
			}

			return;
		}

		if ( this.cooldownAttack === Infinity ) {
			this.cooldownAttack = 0;
		}

		if ( this.action === ENUM.action.attack) return;
		this._attack(this.target);
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

			const hits = this._manager.getEntitiesWithin(hitx, hity, radius);
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
				StrokeManager.create(x0, y0, x1, y1 - height / 2, effect);
				return hit();
			}
			
			const missRadius = attackStats.missRadius
			if ( missRadius ) {
				x1 += missRadius / 2 - Math.random() * missRadius;
			}

			const projectile = ProjectileManager.create(x0, y0, x1, y1);
			projectile.setImage(effect.image);
			projectile.setImpact(attackStats.impact);
			projectile.on('completed', () => hit(x1, y1));
		}

		if ( attackStats.fireOnSpecificFrame ) {
			animation.onKeyframe('fire', fire);
		} else {
			fire();
		}
	}

	_updateAttack(dt) {
		this.cooldownAttack -= dt;
		if ( this.cooldownAttack > 0 ) return;

		if ( this.target.isDead ) {
			if ( this.isAttacking ) {
				const target = this._findNewTarget();
				if ( target ) {
					this.target = target;
				} else {
					this.cooldownAttack = Infinity;
					return;
				}
				
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

		this.y += 12;
		this.isInTrench = false;
		this.setAction('move');
	}

	_enterTile(gx) {
		this.gx = gx;

		if ( !this.isInfantry ) return;
		if ( this.player.stopAtTrenchX !== gx ) return;

		const terrain = GameMap.getTerrainAt(gx);
		if (terrain !== ENUM.terrain.trench) return;

		this.y = -12;
		this.isInTrench = true;
		this.setAction('idle');
		
		this.player.reportTrenchCapture(gx);
	}

	_resetPosition() {
		if ( this.player.direction === ENUM.direction.right ) {
			this.x = 0;
		} else {
			this.x = GameMap.width;
		}
	}

	_updateMove(dt) {
		const direction = this.player.direction
		this.x += dt * this.mobility * direction;

		const x = this.x;
		if (x >= GameMap.width || x <= -150) {
			this._resetPosition();
		}

		const gx = GameMap.toTilePosition(this.x - TILE_WIDTH / 2 * direction);
		if (this.gx === gx) return;

		this._enterTile(gx);
	}

	_scanTargets(dt) {
		this.cooldownScan -= dt;

		if ( this.cooldownScan > 0 ) return;
		this.cooldownScan = CONFIG.entity.cooldownScan;

		this._assignNewTarget();
	}

	update(dt) {
		// this.animation.update(dt);
		if ( this.isDead ) return;

		if ( this.action === ENUM.action.move ) {
			this._updateMove(dt);

		} else if ( this.action === ENUM.action.attack ) {
			this._updateAttack(dt);
			return;
		}

		this._scanTargets(dt);
	}

	draw(ctx) {
		const [x, y] = this.getScreenPosition();
		this.animation.draw(ctx, x, y);
	}
}