class CPlayer {
	constructor(id, direction) {
		this.id = id;
		this.name = null;
		this.money = 300;
		this.direction = direction ?? ENUM.direction.right;

		this.stopAtTrenchX = 0;
		this.flag = null;

		this.currentTrenchX = 0;
		this.trenchCount = 0;

		this.color = '#fff';
		this._event = new CEvent();
	}

	setFlag(sprite) {
		this.flag = sprite;
	}

	reportTrenchCapture(x) {
		if ( this.currentTrenchX === x ) return;
		this.currentTrenchX = x;

		const count = GameMap.countTrenches(this.currentTrenchX, this.direction);
		this.trenchCount = count;

		console.log('trench count:', count);
	}

	moveTrenchLine(givenDirection = 1) {
		const direction = this.direction * givenDirection
		const x = GameMap.getNextTrenchPosition(this.stopAtTrenchX, direction);
		if ( !x ) return;

		// console.log('Previous trench line:', this.stopAtTrenchX);
		// console.log('New trench position:', x);

		if ( x === this.stopAtTrenchX ) return;
		this.stopAtTrenchX = x;

		EntityManager.iterateByPlayer(this, entity => {
			entity.exitTrench();
		});

		GameMap.draw();
	}

	produceEntity(unitName) {
		const entity = EntityManager.create(unitName, this);
		this.money -= entity.stats.price;

		return entity;
	}

	setColor(color) {
		this.color = color;
	}

	setName(name) {
		this.name = name;
	}

	addMoney(value) {
		if ( value === 0) return;
		
		this.money += value;
		this._event.emit('money_changed', this.money);
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}
}

class CTeamManager {
	constructor() {
		this.players = [];
		this.counter = 0;
	}

	createPlayer(direction) {
		const playerId = this.counter++;
		const player = new CPlayer(playerId, direction);
		player.moveTrenchLine();

		this.players.push(player);

		return player
	}
}

const TeamManager = new CTeamManager();