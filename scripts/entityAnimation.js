const EntitySpriteManager = new CSpriteManager();

class CAnimationController {
	constructor(spritesheets, isFlipped) {
		this.spritesheets = spritesheets;
		this.playingAnimation = null;

		this.actions = Object.create(null);
		this.defaultAnimation = null;

		for (const actionName in spritesheets) {
			const data = spritesheets[actionName];

			const animation = EntitySpriteManager.create(data, false);
			animation.setFlipped(isFlipped);
			animation.on('loaded', () => {
				const offset = data.offset ?? ([0, 0]);

				animation.setOffset(
					offset[0] - animation.spriteWidth / 2,
					-offset[1] - animation.spriteHeight
				);
			});

			this.actions[actionName] = animation;

			if (actionName === 'move' || actionName === 'idle') {
				animation.setRepeat(true);
				continue;
			}

			animation.on('ended', () => {
				if ( !this.defaultAnimation ) return;
				this._playAnimation(this.defaultAnimation);
			});
		}
	}

	getSpriteDimension() {
		const sprite = this.defaultAnimation;
		return [sprite.spriteWidth, sprite.spriteHeight];
	}

	_getAnimation(actionName) {
		const animation = this.actions[actionName]
		if ( !animation ) {
			//console.log(`[CAnimation] Unable to play "${actionName}" because it does not exist`);
			return;
		}

		return animation;
	}

	setDefault(actionName) {
		const animation = this._getAnimation(actionName);
		if ( !animation ) return;

		this.defaultAnimation = animation;
		if ( this.playingAnimation ) return;

		this.play(actionName);
	}

	_playAnimation(animation) {
		const prevAnimation = this.playingAnimation;
		if ( prevAnimation ) {
			prevAnimation.stop();
		}

		animation.play();
		this.playingAnimation = animation;

		return animation;
	}

	play(actionName) {
		const animation = this._getAnimation(actionName);
		if ( !animation ) return console.log('Failed to find action:', actionName, this.actions);
		
		return this._playAnimation(animation);
	}

	kill() {
		for (const actionName in this.actions) {
			const animation = this.actions[actionName];
			animation.dispose();
		}
	}
	draw(ctx, x, y) {
		if ( !this.playingAnimation ) return;

		this.playingAnimation.drawAt(ctx, x, y);
	}
}