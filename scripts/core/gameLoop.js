class CGame {
	constructor() {
		this._callbacks = [];
		this.previous = 0;
		this._frameId = null;

		this._nextFrame = this._nextFrame.bind(this);

		window.addEventListener('focus', () => this._resume());
		window.addEventListener('blur', () => this._pause());
		window.addEventListener('load', () => this._resume());
	}

	_resume() {
		if ( this._frameId !== null ) return; // already running

		this.previous = performance.now();
		this._frameId = requestAnimationFrame(this._nextFrame);
	}

	_pause() {
		if ( this._frameId === null ) return;

		cancelAnimationFrame(this._frameId);
		this._frameId = null;
	}

	_nextFrame(timestamp) {
		// Schedule first, so an exception in a callback can't end the loop
		this._frameId = requestAnimationFrame(this._nextFrame);

		const elapsed = Math.max(0, timestamp - this.previous);
		this.previous = timestamp;

		const deltaTime = elapsed / 1000;

		for (let i = 0; i < this._callbacks.length; i++) {
			this._callbacks[i](deltaTime);
		}
	}

	onTick(callback) {
		this._callbacks.push(callback);
	}
}

const Game = new CGame();