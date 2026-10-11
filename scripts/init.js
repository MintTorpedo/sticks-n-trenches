class CGame {
	constructor() {
		this._callbacks = [];
		this.isPaused = false;
		this.previous = 0;

		this._nextFrame = this._nextFrame.bind(this);

		window.onfocus = () => {
			this.isPaused = false;
			this.previous = performance.now();
			requestAnimationFrame(this._nextFrame);
		}

		window.onblur = () => {
			this.isPaused = true;
		}

		window.onload = () => {
			this._nextFrame(0);
		}
	}

	_nextFrame(timestamp) {
		if ( this.isPaused ) return;

		const elapsed = timestamp - this.previous;
		this.previous = timestamp;

		const deltaTime = elapsed / 1000;

		for (let i = 0; i < this._callbacks.length; i++) {
			this._callbacks[i](deltaTime);
		}

		requestAnimationFrame(this._nextFrame);
	}

	onTick(callback) {
		this._callbacks.push(callback);
	}
}

const Game = new CGame();

// const __updateCallbacks = [];
// function GameOnUpdate(callback) {
// 	__updateCallbacks.push(callback);
// }

// let __windowIsFocused = true;
// window.onfocus = function() {
// 	__windowIsFocused = true;
// }

// window.onblur = function() {
// 	__windowIsFocused = false;
// }

// window.onload = function() {
// 	const FPS = 1 / 20;
// 	let accumulator = 0;
// 	let previous = 0;

// 	function main(timestamp) {
// 		if ( !__windowIsFocused ) {
// 			previous = timestamp;
// 			return;
// 		}

// 		const elapsed = timestamp - previous;
// 		previous = timestamp;

// 		const deltaTime = elapsed / 1000;

// 		for (let i = 0; i < __updateCallbacks.length; i++) {
// 			__updateCallbacks[i](deltaTime);
// 		}

// 		requestAnimationFrame(main);
// 	}

// 	main(0);
// }
