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

		this.currentTrenchX = 0;
		this.trenchCount = 0;

		this.color = '#fff';
		this._event = new CEvent();
	}

	reportTrenchCapture(x) {
		if ( this.currentTrenchX === x ) return;
		this.currentTrenchX = x;

		const count = this._gameMap.countTrenches(this.currentTrenchX, this.direction);
		this.trenchCount = count;

		console.log('trench count:', count);
	}

	moveTrenchLine(givenDirection = 1) {
		const direction = this.direction * givenDirection
		const x = this._gameMap.getNextTrenchPosition(this.stopAtTrenchX, direction);
		if ( !x ) return;

		// console.log('Previous trench line:', this.stopAtTrenchX);
		// console.log('New trench position:', x);

		if ( x === this.stopAtTrenchX ) return;
		this.stopAtTrenchX = x;

		this._entityManager.iterateByPlayer(this, entity => {
			if (entity.passenger) {
				entity.refreshTrenchDestination();
			}

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

		this.players.push(player);

		return player
	}
}

// const TeamManager = new CTeamManager();