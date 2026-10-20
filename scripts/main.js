import { onSlotClicked, generateSlots, slotApplyCooldown, onDirectionClicked, updateMoneyLabel, onDifficulty, onLevel, showWinScreen, onUserInteracted } from './slots.js'

const canvas = CanvasManager.create('#canv-main');
const ctx = canvas.graphics;

let hasInteracted = false;
onUserInteracted(function() {
	hasInteracted = true;

	gameSession.playSoundtrack();
});

Camera.setCanvas(canvas);

let gameSession = new CGameSession(canvas);
//gameSession.loadLevel( LEVELS[0] );

onDirectionClicked(function(direction) {
	gameSession.inputDirection(direction);
});

onSlotClicked(function(baseStats) {
	const success = gameSession.inputPurchase(baseStats);
	if ( !success ) return;

	slotApplyCooldown(baseStats.name);
});

onDifficulty(function(difficulty) {
	gameSession.inputDifficulty(difficulty);
	//console.log('New enemy difficulty:', difficulty);
});

onLevel(function(levelId) {
	const levelData = LEVELS[levelId];
	gameSession = new CGameSession(canvas);
	Camera.setGame(gameSession);

	gameSession.loadLevel( levelData );

	gameSession.player.on('money_changed', money => {
		updateMoneyLabel(money);
	});

	gameSession.on('win', () => {
		showWinScreen(true);
		Soundtrack.play('victory');
	});

	//console.log(gameSession);

	showWinScreen(false);
	generateSlots(gameSession.player.loadout);

	if ( hasInteracted ) {
		gameSession.playSoundtrack();
	}
});

function update(dt) {
	gameSession.update(dt);
	Camera.update(dt);
}

function draw() {
	canvas.clear();
	gameSession.draw(ctx);
}

Game.onTick(update);
Game.onTick(draw);