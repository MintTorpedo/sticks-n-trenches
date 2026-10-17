class CSoundtrackManager {
	constructor(tracks) {
		this.tracks = tracks;
		this.volume = 1;
		this.currentId = null;

		this._current = null;
		this._audio = Object.create(null);
	}

	_getAudio(id) {
		let audio = this._audio[id];
		if ( audio ) return audio;

		const info = this.tracks[id];

		audio = new Audio(info.path);
		audio.loop = info.looped ?? true;
		audio.preload = 'auto';

		this._audio[id] = audio;
		return audio;
	}

	_applyVolume() {
		if ( !this._current ) return;

		const track = this.tracks[this.currentId];
		this._current.volume = this.volume * (track.volume ?? 1);
	}

	play(soundtrackID) {
		if ( !this.tracks[soundtrackID] ) {
			console.warn(`CSoundtrackManager: unknown soundtrack "${soundtrackID}"`);
			return;
		}

		if ( soundtrackID === this.currentId ) return;

		this.stop();

		const audio = this._getAudio(soundtrackID);
		this._current = audio;
		this.currentId = soundtrackID;
		this._applyVolume();

		audio.play().catch(err => {
			// Autoplay was blocked (or play was interrupted). Clear the state so
			// a later play() with the same id is allowed to try again.
			if ( this._current !== audio ) return;

			this._current = null;
			this.currentId = null;
			console.warn(`CSoundtrackManager: failed to play "${soundtrackID}"`, err);
		});
	}

	stop() {
		if ( !this._current ) return;

		this._current.pause();
		this._current.currentTime = 0;

		this._current = null;
		this.currentId = null;
	}

	setVolume(volume) {
		this.volume = Math.min(1, Math.max(0, volume));
		this._applyVolume();
	}
}

const Soundtrack = new CSoundtrackManager({
	'track1': { path: 'soundtrack/bgm2.ogg', volume: 0.75 },
	'track2': { path: 'soundtrack/bgm3.ogg', volume: 0.75 },
	'track3': { path: 'soundtrack/bgm4.ogg', volume: 0.75 },
	'track4': { path: 'soundtrack/bgm5.ogg', volume: 0.75 },
	'victory': {path: 'soundtrack/gameclear.mp3', volume: 0.75, looped: false},
});