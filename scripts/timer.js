class CTimer {
	constructor(delay, callback) {
		this.delay = delay;
		this.elapsed = 0;
		this.callback = callback;
	}

	update(dt) {
		const elapsed = this.elapsed + dt;
		if (elapsed <= this.delay) {
			this.elapsed = elapsed;
			return;
		}

		this.elapsed = elapsed % this.delay;
		this.callback();
	}
}

class CTimerManager {
	constructor() {
		this.children = [];
	}

	interval(delay, callback) {
		const timer = new CTimer(delay, callback);
		this.children.push(timer);

		return timer;
	}

	update(dt) {
		for (let i = 0; i < this.children.length; i++) {
			const timer = this.children[i];
			timer.update(dt);
		}
	}
}

const Timer = new CTimerManager();