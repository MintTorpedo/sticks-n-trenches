class CLoadout {
	constructor(entityNames = []) {
		this.mapped = Object.create(null);
		this.names = [];

		entityNames.forEach(name => {
			const baseStats = UNIT_STATS[name];
			if ( !baseStats ) return;

			const info = {
				stats: baseStats,
				elapsed: 0,
			}

			this.names.push(info);
			this.mapped[name] = info;

			this.applyCooldown(name);
		});

		this.names.sort((a, b) => a.price - b.price);
	}

	get(entityName) {
		const info = this.mapped[entityName];
		if ( !info ) return null;

		return info.stats;
	}

	getRandomAvailable() {
		const length = this.names.length;
		if ( length === 0 ) return null;

		const available = [];
		this.names.forEach(slot => {
			const stats = slot.stats;
			if ( this.isOnCooldown(stats.name) ) return;

			available.push(slot);
		});

		if ( available.length === 0 ) return null;

		const diceroll = Math.floor(Math.random() * available.length);
		const slot = available[diceroll];

		return slot.stats;
	}

	isOnCooldown(entityName) {
		const info = this.mapped[entityName];
		if ( !info ) return true;

		const current = performance.now();
		if ( info.elapsed > current ) return true;

		return false;
	}

	applyCooldown(entityName) {
		const info = this.mapped[entityName];
		if ( !info ) return;

		info.elapsed = performance.now() + info.stats.cooldown * 1000;
	}
}