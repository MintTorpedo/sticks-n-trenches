class CTimerChild {
	constructor(delay, callback) {
		this.delay = delay;
		this.elapsed = 0;
		this.callback = callback;

		this.noRepeat = false;
		this.hasRepeated = false;
	}

	update(dt) {
		const elapsed = this.elapsed + dt;
		if (elapsed <= this.delay) {
			this.elapsed = elapsed;
			return;
		}

		this.elapsed = elapsed % this.delay;
		this.hasRepeated = true;
		this.callback();
	}
}

class CTimer {
	constructor() {
		this.children = [];
	}

	interval(seconds, callback) {
		const timer = new CTimerChild(seconds, callback);
		this.children.push(timer);

		return timer;
	}

	await(seconds, callback) {
		const timer = this.interval(seconds, callback);
		timer.noRepeat = true;
		
		return timer;
	}

	update(dt) {
		const children = this.children;

		for (let i = children.length - 1; i >= 0; i--) {
			const timer = children[i];
			timer.update(dt);

			if ( timer.hasRepeated && timer.noRepeat ) {
				children.splice(i, 1);
			}
		}
	}
}