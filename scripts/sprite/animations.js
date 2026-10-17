class CSpriteAnimation {
	constructor(spriteData, manager) {
		this.sprite = spriteData;
		this.keyframes = spriteData.keyframes ?? {};
		this._manager = manager;

		this.isPlaying = false;
		this.isRepeat = false;
		this.isLoaded = false;
		this.isRegistered = false;
		this.isFlipped = false;

		this.spriteWidth = null;
		this.spriteHeight = null;

		this.framePosition = 0;
		this.sourceX = 0;
		this.sourceY = 0;
		this.frameCount = spriteData.frames;

		this.x = 0;
		this.y = 0;
		this.offsetX = 0;
		this.offsetY = 0;

		this._event = new CEvent();
		this._eventKeyframe = new CEvent();

		const imageAsset = new CImageAsset(spriteData.path);
		this.imageAsset = imageAsset;
		this.image = imageAsset.get();

		imageAsset.onLoaded(() => this._onLoaded());
	}

	setOffset(x, y) {
		this.offsetX = x;
		this.offsetY = y;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setRepeat(bool) {
		this.isRepeat = bool;
	}

	setFlipped(isFlipped) {
		this.isFlipped = isFlipped;
	}

	_onLoaded() {
		this.isLoaded = true;

		const [width, height] = this.imageAsset.getDimension();

		const sprite = this.sprite;
		this.spriteWidth  = Math.floor(width / sprite.size[0]);
		this.spriteHeight = Math.floor(height / sprite.size[1]);

		this._event.emit('loaded');

		if ( this.isPlaying ) {
			this.play();
		}
	}

	_updatePosition(framePosition) {
		const sourceX = framePosition % this.sprite.size[0];
		const sourceY = Math.floor(framePosition / this.sprite.size[0]);

		this.sourceX = sourceX * this.spriteWidth;
		this.sourceY = sourceY * this.spriteHeight;

		this.framePosition = framePosition;
	}

	on(eventName, callback) {
		if ( eventName === 'loaded' && this.isLoaded ) {
			callback();
			return;
		}

		this._event.on(eventName, callback);
	}

	onKeyframe(eventName, callback) {
		this._eventKeyframe.on(eventName, callback);
	}

	play() {
		this.isPlaying = true;
		this._updatePosition(0);

		this._event.clear('completed');
		this._eventKeyframe.reset();

		if ( !this.isLoaded ) return;
		if ( this.isRegistered ) return;
		this.isRegistered = true;

		if ( !this._manager ) return;
		this._manager.register(this);
	}

	stop() {
		if ( !this.isPlaying ) return;
		this.isPlaying = false;
	}

	dispose() {
		this.stop();

		if ( !this.isRegistered ) return;
		this.isRegistered = false;
		this._manager.unregister(this);
	}

	_complete() {
		this._event.emit('ended');
		this._event.emit('completed');

		this.stop();
	}

	nextFrame() {
		if ( !this.isPlaying ) return;
		
		const position = (this.framePosition + 1) % this.frameCount;
		if (position === 0 && !this.isRepeat) {
			this._complete();
			return;
		}

		const keyframe = this.keyframes[position]
		if ( keyframe ) {
			this._eventKeyframe.emit(keyframe)
		}

		this._updatePosition(position);
	}

	drawAt(ctx, x, y) {
		if ( !this.isPlaying ) return;

		const offsetX = this.offsetX;
		if ( Camera.boxIsOutsideView(x + offsetX, x - offsetX) ) return;

		ctx.save();
		ctx.translate(x, 0);

		if (this.isFlipped) {
			ctx.scale(-1, 1);
		}

		ctx.drawImage(
			this.image,

			this.sourceX, this.sourceY,
			this.spriteWidth, this.spriteHeight,

			offsetX,
			y + this.offsetY,
			
			this.spriteWidth,
			this.spriteHeight
		);

		ctx.restore();
	}

	draw(ctx) {
		this.drawAt(ctx, this.x, this.y);
	}
}

class CSpriteAnimationSolo extends CSpriteAnimation {
	constructor(spriteData) {
		super(spriteData);

		this.elapsed = 0;
		this.delay = 1 / 30;
		this.play();
	}

	setOffsetScale(wScale, yScale) {
		this.on('loaded', () => {

			this.setOffset(
				this.spriteWidth * wScale,
				this.spriteHeight * yScale,
			);
		});
	}

	setFPS(fps) {
		this.delay = 1 / fps; 
	}

	update(dt) {
		this.elapsed += dt;
		if ( this.elapsed < this.delay ) return;

		this.elapsed -= this.delay;
		this.nextFrame();
	}
}


class CSpriteManager {
	constructor() {
		this.sprites = [];
		this.elapsed = 0;
		this.fps = 1 / 30;
	}

	update(dt) {
		this.elapsed += dt;

		while (this.elapsed >= this.fps) {
			this.elapsed -= this.fps;

			const children = this.sprites;
			for (let i = 0; i < children.length; i++) {
				const sprite = children[i];
				sprite.nextFrame();
			}
		}
	}

	create(data, autoDispose = true) {
		const sprite = new CSpriteAnimation(data, this);
		if ( autoDispose ) {
			sprite.on('ended', () => sprite.dispose());
		}

		return sprite;
	}

	register(sprite) {
		this.sprites.push( sprite );
	}

	unregister(sprite) {
		const children = this.sprites;

		const index = children.findIndex(a => a === sprite);
		if ( index === -1 ) return;

		children.splice(index, 1);
	}
}