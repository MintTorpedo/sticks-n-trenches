class CGameSession {
	constructor(canvas) {
		this.canvas = canvas;
		this.graphics = canvas.graphics;
		this._event = new CEvent();

		this.gameState = ENUM.gameState.idle;
		this.difficulty = ENUM.difficulty.normal;
		this.levelData = null;
		this.musicIsPlaying = false;

		const teamManager = new CTeamManager(this);
		this.teamManager = teamManager;

		this.entityManager = new CEntityManager(this);
		this.map = new CMap(this);

		this.player = teamManager.createPlayer(ENUM.direction.right);
		this.enemy  = teamManager.createPlayer(ENUM.direction.left);

		this.map.setPlayerFocus(this.player);

		const flag = new CSpriteAnimationSolo(SPRITESHEETS.flag);
		flag.setRepeat(true);
		flag.setOffsetScale(-0.5, -2.05);
		flag.setFPS(15);

		this.flag = flag;
		this.player.setFlag(flag);

		this.timer = new CTimer();
		this.vfx = new CVFX(this);
		this.entitySprites = new CSpriteManager(this);
		this.projectiles = new CProjectileManager(this);
		this.strokes = new CStrokeManager(this);

		this.updateFlag();
	}

	on(eventName, callback) {
		this._event.on(eventName, callback);
	}

	updateFlag() {
		const x = this.player.stopAtTrenchX * TERRAIN_WIDTH + TERRAIN_WIDTH / 2
		this.flag.setPosition(x, 0);
	}

	inputDirection(direction) {
		if ( this.gameState !== ENUM.gameState.running ) return;

		this.player.moveTrenchLine(direction);
		this.updateFlag();
	}

	inputPurchase(baseStats) {
		if ( this.gameState !== ENUM.gameState.running ) return;

		const player = this.player;
		const entity = player.produceEntity(baseStats.name);
		if ( !entity ) return;

		let purchaseSound = baseStats.purchaseSound ?? 'sfx/fx_menu.wav';
		SoundPlayer.play(purchaseSound, 0.5);
	}

	inputDifficulty(difficultyLevel) {
		difficultyLevel = parseInt(difficultyLevel);

		this.difficulty = difficultyLevel;
		this.enemy.setIncome(difficultyLevel);
	}

	playSoundtrack() {
		if ( this.musicIsPlaying ) return;
		this.musicIsPlaying = true;

		Soundtrack.play( this.levelData.soundtrack )
	}

	loadLevel(data) {
		if ( this.gameState !== ENUM.gameState.idle ) return;

		this.levelData = data;

		const player = this.player;
		const playerData = data.player;
		player.setMoney(playerData.money);
		player.setIncome(playerData.income, playerData.incomeFixed);
		player.setLoadout(playerData.loadout);

		const enemy = this.enemy;
		const enemyData = data.enemy;
		enemy.setMoney(enemyData.money);
		enemy.setIncome(enemyData.income, enemyData.incomeFixed);
		enemy.setLoadout(enemyData.loadout);

		const processEvent = eventData => {
			let targetPlayer = this.enemy;
			if ( eventData.team === 'player' ) {
				targetPlayer = this.player;
			}

			const tileX = eventData.traits.tileX;
			const mobility = eventData.traits.mobility;

			//console.log('event data:', eventData);

			eventData.spawn.forEach(unitName => {
				const entity = targetPlayer.createEntity(unitName);
				if ( tileX !== undefined ) {
					entity.setPosition( tileX * TILE_WIDTH - TILE_WIDTH / 2 );
				}

				if ( mobility !== undefined ) { // Curse me..
					entity.setMobility(mobility);
				}
			});
		}

		data.interval.forEach(eventData => {
			this.timer.interval(eventData.seconds, () => processEvent(eventData));
		});

		data.timed.forEach(eventData => {
			this.timer.await(eventData.seconds, () => processEvent(eventData));
		});

		this.timer.interval(0.6, () => {
			player.generateIncome();
			enemy.generateIncome();
		});

		// Note: the code below will eventually be moved into its own AI class
		this.timer.interval(1, () => {
			if ( Math.random() <= 0.05 ) {
				enemy.moveTrenchLine( Math.random() <= 0.2 ? -1 : 1 );
			}

			const loadout = enemy.loadout;

			while (true) {
				if ( Math.random() < 0.25 ) break;
				const diceRoll = Math.floor(Math.random() * loadout.length);
				const unitName = loadout[diceRoll];

				const entity = enemy.produceEntity(unitName);
				if ( !entity ) break;
			}
		});

		this.map.import(data.map);
		this.gameState = ENUM.gameState.running;

		const playerHQ = player.createHQ();
		const enemyHQ = enemy.createHQ();

		playerHQ.on('death', () => {
			this.gameState = ENUM.gameState.ended;
			this._event.emit('win');
		});

		enemyHQ.on('death', () => {
			this.gameState = ENUM.gameState.ended;
			this._event.emit('win');
		});

		this.inputDirection(1);
	}

	update(dt) {
		this.flag.update(dt);

		if ( this.gameState !== ENUM.gameState.running ) return;
		this.vfx.update(dt);
		this.strokes.update(dt);
		this.entityManager.update(dt);
		this.entitySprites.update(dt);
		this.projectiles.update(dt);
		this.timer.update(dt);
	}

	draw() {
		const canvas = this.canvas;
		const ctx = this.graphics;

		this.map.drawEntityDots(ctx);
		Camera.translate(ctx);

		ctx.translate(0, canvas.height - TERRAIN_GRASS_OFFSET);

		this.entityManager.drawShadows(ctx);
		this.flag.draw(ctx);
		this.entityManager.draw(ctx);

		this.projectiles.draw(ctx);
		this.strokes.draw(ctx);
		this.vfx.draw(ctx);
	}
}