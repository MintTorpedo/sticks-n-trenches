class CPlayer {
	constructor(gameSession, id, direction) {
		this._game = gameSession;
		this._gameMap = gameSession.map;
		this._entityManager = gameSession.entityManager;

		this.id = id;
		this.money = 300;
		this.direction = direction ?? ENUM.direction.right;

		this.incomePerTrench = 1;
		this.incomeFixed = 1;

		this.loadout = new CLoadout();

		this.stopAtTrenchX = 0;
		this.flag = null;

		this.trenchFrontlineX = null;
		this.trenchCount = 0;

		this.color = '#fff';

		this._event = new CEvent();
	}

	_setTrench(trenchX) {
		if ( this.trenchFrontlineX === trenchX ) return;
		this.trenchFrontlineX = trenchX;

		let count = 0;
		if ( trenchX ) {
			count = this._gameMap.countTrenches(trenchX, this.direction);
		}

		this.trenchCount = count;
		// console.log('Trench captured:', count);
	}

	captureTrench(trenchX) {
		const currentX = this.trenchFrontlineX;
		if ( currentX ) {
			if ( Math.sign(trenchX - currentX) !== this.direction ) return;
		}

		this._setTrench(trenchX);
		this._event.emit('trench_captured', trenchX);
	}

	removeTrench(lostTrenchX) {
		if ( !this.trenchFrontlineX ) return;
		if ( lostTrenchX !== this.trenchFrontlineX ) return;

		const fallbackTrenchX = this._gameMap.getNextTrenchPosition(lostTrenchX, this.direction * -1);
		this._setTrench(fallbackTrenchX);

		this._event.emit('trench_lost', lostTrenchX);
	}

	moveTrenchLine(givenDirection = 1) {
		const direction = this.direction * givenDirection
		const trenchX = this._gameMap.getNextTrenchPosition(this.stopAtTrenchX, direction);
		if ( !trenchX ) return;

		// console.log('Previous trench line:', this.stopAtTrenchX);
		// console.log('New trench position:', x);

		if ( trenchX === this.stopAtTrenchX ) return;

		const prevTrenchX = this.stopAtTrenchX;
		this.stopAtTrenchX = trenchX;

		this._entityManager.iterateByPlayer(this, entity => {
			if (entity.passenger) {
				entity.refreshTrenchDestination();
			}

			//if ( Math.sign(trenchX - prevTrenchX) !== this.direction ) return;
			entity.exitTrench();
		});

		// GameMap.draw();
	}

	createEntity(unitName) {
		return this._entityManager.create(unitName, this);
	}

	createHQ() {
		const entity = this.createEntity('hq');
		
		let x = TILE_WIDTH / 2
		if ( this.direction === ENUM.direction.left ) {
			x = this._gameMap.width - x;
		}

		entity.setPosition(x);
		return entity;
	}

	produceEntity(unitName) {
		const loadout = this.loadout;
		const baseStats = loadout.get(unitName);
		if ( !baseStats ) return; //console.log(`"${unitName}" does not exist in loadout`);

		if ( loadout.isOnCooldown(unitName) ) return; //console.log(`"${unitName}" is on cooldown`);

		const newMoney = this.money - baseStats.price;
		if ( newMoney <= 0 ) return; //console.log('Too expensive');

		const entity = this.createEntity(unitName);
		this.money = newMoney;
		
		loadout.applyCooldown(unitName);

		return entity;
	}

	setFlag(sprite) {
		this.flag = sprite;
	}

	setLoadout(list) {
		this.loadout = new CLoadout(list);
	}

	setMoney(value) {
		this.money = value;
	}

	setIncome(income, fixedIncome) {
		this.incomePerTrench = income ?? this.incomePerTrench;
		this.incomeFixed = fixedIncome ?? this.incomeFixed;
	}

	addMoney(value) {
		if ( value === 0) return;
		
		this.money += value;
		this._event.emit('money_changed', this.money);
	}

	generateIncome() {
		this.addMoney(this.incomeFixed + this.trenchCount * this.incomePerTrench);
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}

	once(eventName, callback) {
		this._event.once(eventName, callback);
	}
}

class CTeamManager {
	constructor(gameSession) {
		this._game = gameSession;

		this.players = [];
		this.counter = 0;
	}

	createPlayer(direction) {
		const playerId = this.counter++;
		const player = new CPlayer(this._game, playerId, direction);
		player.moveTrenchLine();

		player.on('trench_captured', (trenchX) => {
			this.players.forEach(targetPlayer => {
				if ( targetPlayer === player ) return;
				targetPlayer.removeTrench(trenchX);
			});
		});

		this.players.push(player);
		return player;
	}
}

// const TeamManager = new CTeamManager();