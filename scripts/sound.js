class CSound {
	static context = new AudioContext();

	constructor(path) {
		this.isLoaded = false;
		this.isLooped = false;
		this.buffer = null;
		this._event = new CEvent();

		fetch(path)
			.then(res => res.arrayBuffer())
			.then(data => CSound.context.decodeAudioData(data))
			.then(buffer => {
				this.isLoaded = true;
				this.buffer = buffer;
				this._event.emit('loaded');
			});
	}

	on(eventName, callback) {
		if ( eventName === 'loaded' && this.buffer ) {
			callback();
			return;
		}

		this._event.on(eventName, callback);
	}

	play(volume = 1, looped = false) {
		if ( !this.buffer ) return;
		if ( CSound.context.state === 'suspended' ) CSound.context.resume();

		const source = CSound.context.createBufferSource();
		source.buffer = this.buffer;
		source.loop = looped;
		source.onended = () => this._event.emit('ended');

		const gainNode = CSound.context.createGain();
		gainNode.gain.value = volume;

		source.connect(gainNode);
		gainNode.connect(CSound.context.destination);

		source.start();
	}
}


class CSoundManager {
	constructor() {
		this.sounds = Object.create(null);
	}

	play(path, volume, looped) {
		let info = this.sounds[path];
		if ( !info ) {
			info = {
				'playedAt': 0, 
				'sound': new CSound(path)
			};

			this.sounds[path] = info;
		}
		
		const playedSince = Date.now() - info.playedAt;
		if ( playedSince < 100 ) return;

		const sound = info.sound;

		if ( sound.isLoaded ) {
			info.playedAt = Date.now();
			sound.play(volume, looped);
			return;
		}
		
		info.playedAt = Infinity;

		sound.on('loaded', () => {
			info.playedAt = Date.now();
			sound.play(volume, looped);
		});
	}

	playLooped(path, volume) {
		this.play(path, volume, true);
	}
}

const SoundPlayer = new CSoundManager();