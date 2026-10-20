class CEvent {
	constructor() {
		this._listeners = Object.create(null);
	}

	emit(eventName, value) {
		const listeners = this._listeners[eventName];
		if ( !listeners ) return;

		let i = 0;
		while (i < listeners.length) {
			const eventInfo = listeners[i];
			const isDisconnect = eventInfo.callback(value);

			if (eventInfo.isOnce || isDisconnect) {
				listeners.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	on(eventName, callback, isOnce = false) {
		const listeners = this._listeners[eventName];
		const eventInfo = {callback, isOnce};
		
		if (listeners) {
			listeners.push(eventInfo);
			return;
		}

		this._listeners[eventName] = [eventInfo];
	}

	once(eventName, callback) {
		this.on(eventName, callback, true);
	}

	// disconnect(callback) {
	// 	for (let i = this._listeners.length - 1; i >= 0; i--) {
	// 		const eventInfo = this._listeners[i];
	// 		if ( eventInfo.callback !== callback ) continue;

	// 		this._listeners.splice(i, 1);
	// 	}
	// }

	clear(eventName) {
		delete this._listeners[eventName];
	}

	reset() {
		this._listeners = Object.create(null);
	}
}