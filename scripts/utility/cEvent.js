class CEvent {
	constructor() {
		this._listeners = Object.create(null);
	}

	emit(eventName, value) {
		const listeners = this._listeners[eventName];
		if ( !listeners ) return;

		for (let i = 0; i < listeners.length; i++) {
			listeners[i](value);
		}
	}

	on(eventName, callback) {
		const listeners = this._listeners[eventName];
		
		if (listeners) {
			listeners.push(callback);
			return;
		}

		this._listeners[eventName] = [callback];
	}

	clear(eventName) {
		delete this._listeners[eventName];
	}

	reset() {
		this._listeners = Object.create(null);
	}
}