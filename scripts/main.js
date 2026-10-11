import { onSlotClicked, onDirectionClicked, updateMoneyLabel, onDifficulty } from './slots.js'

const canvas = CanvasManager.create('#canv-main');
const ctx = canvas.graphics;

Camera.setCanvas(canvas);

const player = TeamManager.createPlayer(ENUM.direction.right);
const enemy  = TeamManager.createPlayer(ENUM.direction.left);

const flag = new CSpriteAnimationSolo(SPRITESHEETS.flag);
flag.setRepeat(true);
flag.setOffsetScale(-0.5, -2.05);
flag.setFPS(15);

player.setFlag(flag);
flag.setPosition(player.stopAtTrenchX * TERRAIN_WIDTH + TERRAIN_WIDTH / 2, 0);

EntityManager.setGraphics(ctx);

onDirectionClicked(function(direction) {
	player.moveTrenchLine(direction);

	flag.setPosition(player.stopAtTrenchX * TERRAIN_WIDTH + TERRAIN_WIDTH / 2, 0);
});

let unitBought = false;

let enemyBonusMoney = 1;
onSlotClicked(function(baseStats) {
	if ( player.money < baseStats.price ) return;
	player.produceEntity(baseStats.name);

	let purchaseSound = baseStats.purchaseSound ?? 'sfx/fx_menu.wav';
	SoundPlayer.play(purchaseSound, 0.5);

	if ( unitBought ) return;
	unitBought = true;

	const tracks = [
		'soundtrack/bgm2.ogg',
		'soundtrack/bgm3.ogg',
		'soundtrack/bgm4.ogg',
		'soundtrack/bgm5.ogg',
	];

	SoundPlayer.playLooped(tracks[ (enemyBonusMoney - 1) % tracks.length ], 0.85);
});

onDifficulty(function(newMoney) {
	enemyBonusMoney = newMoney;

	console.log('New enemy money:', newMoney);
});

player.on('money_changed', money => {
	updateMoneyLabel(money);
})

GameMap.setPlayerFocus(player);

Timer.interval(0.6, function() {
	player.addMoney(1 + player.trenchCount);
	enemy.addMoney((1 + player.trenchCount) * enemyBonusMoney);
});

Timer.interval(1, function() {
	if ( Math.random() <= 0.1 ) {
		enemy.moveTrenchLine( Math.random() < 0.2 ? -1 : 1 );
	}

	const options = [];
	for (const unitName in UnitStats) {
		const baseStats = UnitStats[unitName];
		options.push(baseStats);
	}

	while (true) {
		if ( Math.random() < 0.25 ) break;

		const baseStats = options[ Math.floor(Math.random() * options.length) ];
		if ( baseStats.price > enemy.money ) break;

		enemy.produceEntity(baseStats.name);
	}
})

function update(dt) {
	flag.update(dt);

	EntityManager.update(dt);
	EntitySpriteManager.update(dt);
	VFX.update(dt);

	ProjectileManager.update(dt);
	StrokeManager.update(dt);
	Timer.update(dt);

	Camera.update(dt);
}

function draw() {
	canvas.clear();

	//ctx.scale(0.8, 0.8);

	Camera.translate(ctx);
	ctx.translate(0, canvas.height - TERRAIN_GRASS_OFFSET);

	EntityManager.drawShadows();
	flag.draw(ctx);

	EntityManager.draw();

	ProjectileManager.draw(ctx);
	StrokeManager.draw(ctx);
	VFX.draw(ctx);
}

Game.onTick(update);
Game.onTick(draw);