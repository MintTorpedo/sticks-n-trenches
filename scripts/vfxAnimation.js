class CVFXSpriteManager {
	constructor() {
		this._manager = new CSpriteManager();
	}

	create(x, y, spriteData) {
		const animation = this._manager.create(spriteData, true);
		const offset = spriteData.offset ?? [0, 0];

		animation.on('loaded', () => {
			animation.setOffset(
				animation.spriteWidth * offset[0],
				animation.spriteHeight * offset[1],
			);
		});

		animation.setPosition(x, y);
		animation.play();

		return animation;
	}

	update(dt) {
		this._manager.update(dt);
	}

	draw(ctx) {
		const children = this._manager.sprites;

		for (let i = 0; i < children.length; i++) {
			const animation = children[i];
			animation.draw(ctx);
		}
	}
}

const VFX = new CVFXSpriteManager();